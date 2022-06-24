import { LanguageKeys } from '#lib/i18n/LanguageKeys';
import { OsuCommand } from '#lib/structures/OsuCommand';
import { apply } from '#lib/utils/add-builder-localizations';
import { errorEmbed, successEmbed } from '#lib/utils/embeds';
import { searchForAnUser } from '#lib/utils/osu';
import { getGuilds } from '#lib/utils/util';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { AutocompleteInteractionArguments, RegisterCommand, RestrictGuildIds } from '@skyra/http-framework';
import { resolveUserKey } from '@skyra/http-framework-i18n';
import { APIApplicationCommandAutocompleteInteraction, MessageFlags } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	apply(builder, LanguageKeys.Commands.Osu.OsuName, LanguageKeys.Commands.Osu.OsuDescription)
		.setDMPermission(false)
		.addStringOption((input) =>
			//
			apply(input, LanguageKeys.Commands.Osu.OsuUsernameName, LanguageKeys.Commands.Osu.OsuUsernameDescription)
		)
		.addStringOption((input) =>
			apply(input, LanguageKeys.Commands.Osu.OsuModeName, LanguageKeys.Commands.Osu.OsuModeDescription).setChoices(
				...UserCommand.modes.map((m) => ({ name: m, value: m }))
			)
		)
)
@RestrictGuildIds(getGuilds())
export class UserCommand extends OsuCommand {
	public override async autocompleteRun(
		interaction: APIApplicationCommandAutocompleteInteraction,
		args: AutocompleteInteractionArguments<ArgsAutoComplete>
	) {
		const { guild_id: guildId } = interaction;
		if (args.focused !== 'username') return this.autocompleteNoResults();

		if (!isNullishOrEmpty(guildId) && isNullishOrEmpty(args.username)) args.username = 'chikoshidori';

		const search = await searchForAnUser(args.username).catch(() => undefined);
		if (!search) return this.autocompleteNoResults();

		const choices = search.users.map(({ username: name, id: value }) => ({ name, value: value.toString() }));

		return this.autocomplete({ choices });
	}

	public override async chatInputRun(
		interaction: OsuCommand.Interaction,
		{ username: userId, mode = 'osu' }: Args
	): Promise<OsuCommand.MessageResponseResult> {
		const user = await this.fetchUser({ userId, mode });

		if (!user)
			return this.message({
				embeds: [errorEmbed({ description: resolveUserKey(interaction, LanguageKeys.Commands.Osu.UserNotFound) })],
				flags: MessageFlags.Ephemeral
			});

		return this.message({
			embeds: [
				successEmbed({
					author: {
						name: `${user.username}: ${user.statistics.pp.toLocaleString()}pp (#${user.statistics.global_rank.toLocaleString()} ${
							user.country_code
						}${user.statistics.country_rank})`,
						url: `https://osu.ppy.sh/u/${user.id}`,
						icon_url: `https://assets.ppy.sh/old-flags/${user.country_code}.png`
					},
					thumbnail: { url: user.avatar_url }
				})
			]
		});
	}

	private static modes: OsuCommand.OsuModes[] = ['osu', 'taiko', 'fruits', 'mania'];
}

interface Args {
	username: string;
	mode?: OsuCommand.OsuModes;
}

type ArgsAutoComplete = Omit<Args, 'mode'>;
