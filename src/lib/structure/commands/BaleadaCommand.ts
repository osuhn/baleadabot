import { Awaitable, ChatInputCommand, Command, MessageCommand, MessageCommandContext, type PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { BaleadaArgs } from '#lib/structure/commands/parsers/BaleadaArgs';
import * as Lexure from 'lexure';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';

export type InteractionParameters = Parameters<ChatInputCommand['chatInputRun']>;
export type MessageParameters = Parameters<MessageCommand['messageRun']>;
export type CommandParameteres = MessageParameters | InteractionParameters;
export abstract class BaleadaCommand extends Command<BaleadaCommand.Args, BaleadaCommand.Options> {
	public constructor(context: PieceContext, options: BaleadaCommand.Options) {
		super(context, {
			runIn: ['GUILD_ANY'],
			...options
		});
	}

	public override messageRun(...params: MessageParameters): Awaitable<unknown> {
		return this.handle(...params);
	}

	public override async chatInputRun(...params: InteractionParameters): Promise<unknown> {
		params[1].t = await fetchT(params[0].guild!);
		return this.handle(...params);
	}

	public abstract handle(...[]: CommandParameteres): Awaitable<unknown>;

	public override async messagePreParse(message: Message, parameters: string, context: MessageCommandContext): Promise<BaleadaCommand.Args> {
		const parser = new Lexure.Parser(this.lexer.setInput(parameters).lex()).setUnorderedStrategy(this.strategy);
		const args = new Lexure.Args(parser.parse());
		return new BaleadaArgs(message, this as MessageCommand, args, context, await fetchT(message));
	}
}

export namespace BaleadaCommand {
	export type Options = Command.Options;
	export type Args = BaleadaArgs;
	export type Context = Command.Context;
}

declare module '@sapphire/framework' {
	interface ChatInputCommandContext {
		t: TFunction;
	}
}
