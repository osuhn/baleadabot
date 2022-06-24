import { UnsafeEmbedBuilder } from '@discordjs/builders';
import type { APIEmbed } from 'discord-api-types/v10';

export function successEmbed(options: APIEmbed): APIEmbed {
	return new UnsafeEmbedBuilder(options).setColor(0x88f56d).setTimestamp().toJSON();
}

export function errorEmbed(options: APIEmbed): APIEmbed {
	return new UnsafeEmbedBuilder(options).setColor(0xf56d6d).setTimestamp().toJSON();
}
