import { LanguageKeys } from '#lib/i18n/LanguageKeys';
import { OsuCommand } from '#lib/structures/OsuCommand';
import { errorEmbed, successEmbed } from '#lib/utils/embeds';
import { searchForAnUser } from '#lib/utils/osu';
import { getGuilds } from '#lib/utils/util';
import { Awaitable, isNullishOrEmpty } from '@sapphire/utilities';
import { AutocompleteInteractionArguments, RegisterCommand, RestrictGuildIds } from '@skyra/http-framework';
import { resolveUserKey } from '@skyra/http-framework-i18n';
import { APIApplicationCommandAutocompleteInteraction, APIApplicationCommandAutocompleteResponse, MessageFlags } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	builder
		.setName('osu')
		.setDescription('Display statics of an user')
		.addStringOption((option) => option.setName('username').setDescription('username or id').setAutocomplete(true))
		.addStringOption((option) =>
			option
				.setName('mode')
				.setDescription('mode')
				.setChoices(...UserCommand.modes.map((m) => ({ name: m, value: m })))
		)
)
@RestrictGuildIds(getGuilds())
export class UserCommand extends OsuCommand {
	public override async autocompleteRun(
		interaction: APIApplicationCommandAutocompleteInteraction,
		args: AutocompleteInteractionArguments<ArgsAutoComplete>
	) {
		const { guild_id: guildId } = interaction;

		const options: Record<keyof ArgsAutoComplete, () => Awaitable<APIApplicationCommandAutocompleteResponse>> = {
			username: async (): Promise<APIApplicationCommandAutocompleteResponse> => {
				if (!isNullishOrEmpty(guildId) && isNullishOrEmpty(args.username)) args.username = '2';

				const search = await searchForAnUser(args.username).catch(() => undefined);
				if (!search) return this.autocompleteNoResults();

				const choices = search.users.map(({ username: name, id: value }) => ({ name, value }));

				return this.autocomplete({ choices });
			}
		};

		const selected = options[args.focused!];
		const result = selected ? await selected() : this.autocompleteNoResults();

		return result;
	}

	public override async chatInputRun(
		interaction: OsuCommand.Interaction,
		{ username: userId, mode = 'osu' }: Args
	): Promise<OsuCommand.MessageResponseResult> {
		const user = await this.fetchUser({ userId, mode });

		if (!user)
			return this.message({
				embeds: [
					errorEmbed({
						interaction,
						options: {
							description: resolveUserKey(interaction, LanguageKeys.UserNotFound)
						}
					})
				],
				flags: MessageFlags.Ephemeral
			});

		return this.message({
			embeds: [
				successEmbed({
					interaction,
					options: {
						thumbnail: { url: user.avatar_url },
						description: `${user.username}'s stats`
					}
				})
			]
		});
	}

	private static modes: OsuCommand.OsuModes[] = ['osu', 'taiko', 'fruits', 'mania'];
}

interface Args {
	username: string;
	mode: OsuCommand.OsuModes;
}

type ArgsAutoComplete = Omit<Args, 'mode'>;
