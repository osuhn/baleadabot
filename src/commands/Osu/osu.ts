import { LanguageKeys } from '#lib/i18n/LanguageKeys';
import { OsuCommand } from '#lib/structures/OsuCommand';
import { searchForAnUser } from '#lib/utils/osu';
import { getGuilds } from '#lib/utils/util';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { AutocompleteInteractionArguments, RegisterCommand, RestrictGuildIds } from '@skyra/http-framework';
import { APIApplicationCommandAutocompleteInteraction, MessageFlags } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	builder
		.setName('osu')
		.setDescription('Display statics of an user')
		.addStringOption((option) => option.setName('username').setDescription('username or id').setAutocomplete(true))
		.addStringOption((option) => option.setName('mode').setDescription('mode').setAutocomplete(true))
)
@RestrictGuildIds(getGuilds())
export class UserCommand extends OsuCommand {
	private readonly modes: OsuCommand.OsuModes[] = ['osu', 'taiko', 'fruits', 'mania'];

	public override async autocompleteRun(interaction: APIApplicationCommandAutocompleteInteraction, args: AutocompleteInteractionArguments<Args>) {
		const { guild_id: guildId } = interaction;

		switch (args.focused) {
			case 'username': {
				if (!isNullishOrEmpty(guildId) && isNullishOrEmpty(args.username)) {
					args.username = '2';
				}

				const search = await searchForAnUser(args.username).catch(() => undefined);
				if (!search) return this.autocompleteNoResults();

				const choices = search.users.map(({ username: name, id: value }) => ({ name, value }));
				console.log(choices);

				return this.autocomplete({ choices });
			}

			case 'mode': {
				if (!isNullishOrEmpty(guildId) && isNullishOrEmpty(args.mode)) {
					args.mode = 'osu';
				}

				const choices = this.modes.map((m) => ({ name: m, value: m }));

				return this.autocomplete({ choices });
			}

			default: {
				return this.autocompleteNoResults();
			}
		}
	}

	public override chatInputRun(_interaction: OsuCommand.Interaction, { username: userId, mode }: Args): OsuCommand.Response {
		const user = this.fetchUser({ userId, mode });

		console.log(user);

		return this.message({
			content: LanguageKeys.UserNotFound,
			flags: MessageFlags.Ephemeral
		});
	}
}

interface Args {
	username: string;
	mode: OsuCommand.OsuModes;
}
