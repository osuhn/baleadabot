import type { OsuCommand } from '#lib/structures/OsuCommand';
import { UnsafeEmbedBuilder } from '@discordjs/builders';
import type { APIEmbed } from 'discord-api-types/v10';

export namespace Embeds {
	export interface StatusOptions {
		options: APIEmbed;
		interaction: OsuCommand.Interaction;
	}
}

export function successEmbed({ options, interaction }: Embeds.StatusOptions): APIEmbed {
	return new UnsafeEmbedBuilder(options).setColor(0x88f56d).setAuthor({ name: interaction.user!.username }).setTimestamp().toJSON();
}

export function errorEmbed({ options, interaction }: Embeds.StatusOptions): APIEmbed {
	return new UnsafeEmbedBuilder(options).setColor(0xf56d6d).setAuthor({ name: interaction.user!.username }).setTimestamp().toJSON();
}
