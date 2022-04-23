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
)
@RestrictGuildIds(getGuilds())
export class UserCommand extends OsuCommand {
	public override async autocompleteRun(interaction: APIApplicationCommandAutocompleteInteraction, args: AutocompleteInteractionArguments<Args>) {
		const { guild_id: guildId } = interaction;

		console.log(interaction);

		switch (args.focused) {
			case 'username': {
				if (!isNullishOrEmpty(guildId) && isNullishOrEmpty(args.username)) {
					args.username = '2';
				}

				const search = await searchForAnUser(args.username);
				console.log(search);

				return this.autocomplete({
					choices: search.users.map((u) => ({ name: u.username, value: u.id }))
				});
			}

			default: {
				return this.autocompleteNoResults();
			}
		}
	}

	public override chatInputRun(interaction: OsuCommand.Interaction, { username }: Args): OsuCommand.Response {
		console.log(interaction.guild_locale, username);
		return this.message({
			content: LanguageKeys.UserNotFound,
			flags: MessageFlags.Ephemeral
		});
	}
}

interface Args {
	username: string;
}
