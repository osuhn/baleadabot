import { getFlag } from '#lib/common/osu';
import { LanguageKeys } from '#lib/i18n/LanguageKeys';
import { OsuCommand } from '#lib/structures/OsuCommand';
import { apply } from '#lib/utils/add-builder-localizations';
import { errorEmbed, successEmbed } from '#lib/utils/embeds';
import { searchUser } from '#lib/utils/osu';
import { getGuilds } from '#lib/utils/util';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { AutocompleteInteractionArguments, RegisterCommand, RestrictGuildIds } from '@skyra/http-framework';
import { resolveUserKey } from '@skyra/http-framework-i18n';
import { MessageFlags } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	apply(builder, LanguageKeys.Commands.Osu.OsuName, LanguageKeys.Commands.Osu.OsuDescription)
		.setDMPermission(false)
		.addStringOption((input) =>
			apply(input, LanguageKeys.Commands.Osu.OsuUsernameName, LanguageKeys.Commands.Osu.OsuUsernameDescription).setAutocomplete(true)
		)
		.addStringOption((input) =>
			apply(input, LanguageKeys.Commands.Osu.OsuModeName, LanguageKeys.Commands.Osu.OsuModeDescription).setChoices(
				...UserCommand.modes.map((m) => ({ name: m, value: m }))
			)
		)
)
@RestrictGuildIds(getGuilds())
export class UserCommand extends OsuCommand {
	public override async autocompleteRun(interaction: OsuCommand.AutoCompleteInteraction, args: AutocompleteInteractionArguments<ArgsAutoComplete>) {
		if (args.focused !== 'username') return interaction.replyEmpty();

		if (isNullishOrEmpty(args.username)) args.username = 'chikoshidori';

		const search = await searchUser(args.username).catch(() => undefined);
		if (!search) return interaction.replyEmpty();

		const choices = search.users.map(({ username: name, id: value }) => ({ name, value: value.toString() }));

		return interaction.reply({ choices });
	}

	public override async chatInputRun(interaction: OsuCommand.Interaction, { username: userId, mode = 'osu' }: Args) {
		const user = await this.fetchUser({ userId, mode });

		if (!user) {
			return interaction.reply({
				embeds: [errorEmbed({ description: resolveUserKey(interaction, LanguageKeys.Commands.Osu.UserNotFound) })],
				flags: MessageFlags.Ephemeral
			});
		}

		return interaction.reply({
			embeds: [
				successEmbed({
					author: {
						name: `${user.username}: ${user.statistics.pp.toLocaleString()}pp (#${user.statistics.global_rank.toLocaleString()} ${
							user.country_code
						}${user.statistics.country_rank})`,
						url: `https://osu.ppy.sh/u/${user.id}`,
						icon_url: getFlag(user.country_code)
					},
					fields: [
						{
							name: resolveUserKey(interaction, LanguageKeys.Commands.Osu.RankedScore),
							value: user.statistics.ranked_score.toLocaleString(),
							inline: true
						},
						{
							name: resolveUserKey(interaction, LanguageKeys.Commands.Osu.Accuracy),
							value: `${user.statistics.hit_accuracy.toFixed(2)}%`,
							inline: true
						},
						{
							name: resolveUserKey(interaction, LanguageKeys.Commands.Osu.MaxCombo),
							value: user.statistics.maximum_combo.toLocaleString(),
							inline: true
						}
					],
					thumbnail: { url: user.avatar_url },
					footer: {
						text: resolveUserKey(interaction, LanguageKeys.Commands.Osu.JoinedOsu, {
							date: new Date(user.join_date)
						})
					}
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
