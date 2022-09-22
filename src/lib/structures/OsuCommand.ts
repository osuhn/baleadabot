import { Command } from '@skyra/http-framework';
import { v2 } from 'osu-api-extended';

export abstract class OsuCommand extends Command {
	public constructor(context: Command.Context, options: OsuCommand.Options) {
		super(context, options);
	}

	protected fetchUser({ userId, mode }: OsuCommand.FetchUserOptions) {
		return v2.user.get(userId, mode);
	}
}

export namespace OsuCommand {
	export interface Options extends Command.Options {}

	export type Interaction = Command.ChatInputInteraction;
	export type AutoCompleteInteraction = Command.AutocompleteInteraction;

	export interface FetchUserOptions {
		userId: string;
		mode: OsuModes;
	}

	export type OsuModes = 'osu' | 'taiko' | 'fruits' | 'mania';
}
