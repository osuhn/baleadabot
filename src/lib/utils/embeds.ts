import type { OsuCommand } from '#lib/structures/OsuCommand';
import type { APIEmbed } from 'discord-api-types/v10';

export namespace Embeds {
	export interface StatusOptions {
		options: APIEmbed;
		interaction: OsuCommand.Interaction;
	}
}

export function successEmbed({ options, interaction }: Embeds.StatusOptions): APIEmbed {
	const embed: APIEmbed = {
		...options,
		color: 0x88f56d,
		timestamp: new Date().toISOString(),
		author: {
			name: interaction.user!.username
		}
	};

	return embed;
}

export function errorEmbed({ options, interaction }: Embeds.StatusOptions): APIEmbed {
	const embed: APIEmbed = {
		...options,
		color: 0xf56d6d,
		timestamp: new Date().toISOString(),
		author: {
			name: interaction.user!.username
		}
	};

	return embed;
}
