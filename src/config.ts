// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { envParseArray } from '#lib/env-parser';
import { LogLevel } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { config } from 'dotenv-cra';
import { join } from 'path';
import process from 'process';

config({
	debug: true,
	path: join(process.cwd(), '.env')
});

export const OWNERS = envParseArray('OWNERS', []);

export function parseClientOptions(): ClientOptions {
	return {
		caseInsensitiveCommands: true,
		logger: {
			level: LogLevel.Debug
		},
		shards: 'auto',
		intents: [
			'GUILDS',
			'GUILD_MEMBERS',
			'GUILD_BANS',
			'GUILD_EMOJIS_AND_STICKERS',
			'GUILD_VOICE_STATES',
			'GUILD_MESSAGES',
			'GUILD_MESSAGE_REACTIONS',
			'DIRECT_MESSAGES',
			'DIRECT_MESSAGE_REACTIONS'
		],
		loadDefaultErrorListeners: false
	};
}
