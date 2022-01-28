import { Args, type MessageCommand, type MessageCommandContext } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { TFunction } from 'i18next';
import type { Args as LexureArgs } from 'lexure';

export class BaleadaArgs extends Args {
	public override t: TFunction;

	public constructor(message: Message, command: MessageCommand, parser: LexureArgs, context: MessageCommandContext, t: TFunction) {
		super(message, command, parser, context);
		this.t = t;
	}
}

declare module '@sapphire/framework' {
	export interface Args {
		t: TFunction;
	}
}
