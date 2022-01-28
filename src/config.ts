// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { envParseArray, envParseBoolean, envParseString } from '#lib/env';
import { LogLevel } from '@sapphire/framework';
import type { HMROptions, InternationalizationOptions } from '@sapphire/plugin-i18next';
import type { ClientOptions } from 'discord.js';
import { config } from 'dotenv-cra';
import { join } from 'path';
import process from 'process';

config({
	debug: process.env.DOTENV_DEBUG_ENABLED ? envParseBoolean('DOTENV_DEBUG_ENABLED', false) : undefined,
	path: join(process.cwd(), '.env')
});

export const OWNERS = envParseArray('CLIENT_OWNERS', []);
export const LANGUAGE_ROOT = join(process.cwd(), 'src', 'languages');

const hmr: HMROptions = {
	enabled: process.env.NODE_ENV === 'development'
};

function parseI18nOption(): InternationalizationOptions {
	return {
		hmr,
		defaultMissingKey: 'default',
		defaultNS: 'globals',
		defaultLanguageDirectory: LANGUAGE_ROOT,
		formatters: [
			{
				name: 'localeString',
				format: (value: number, lng: string) => value.toLocaleString(lng)
			}
		],
		fetchLanguage: ({ guild }) => {
			if (!guild) return 'en-GB';
			return 'en-GB';
		},
		i18next: (_: string[], languages: string[]) => ({
			supportedLngs: languages,
			preload: languages,
			returnObjects: true,
			returnEmptyString: false,
			returnNull: false,
			load: 'all',
			fallbackLng: 'en-GB',
			defaultNS: 'globals',
			overloadTranslationOptionHandler: (args) => ({ defaultValue: args[1] ?? 'globals:default' }),
			initImmediate: false
		})
	};
}

function parseRegExpPrefix(): RegExp | undefined {
	const regex = envParseString('CLIENT_REGEX_PREFIX');
	return regex ? new RegExp(regex, 'i') : undefined;
}

export function parseClientOptions(): ClientOptions {
	return {
		allowedMentions: { users: [], roles: [] },
		regexPrefix: parseRegExpPrefix(),
		defaultPrefix: envParseString('CLIENT_PREFIX'),
		loadMessageCommandListeners: true,
		caseInsensitiveCommands: true,
		caseInsensitivePrefixes: true,
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
		partials: ['CHANNEL', 'MESSAGE'],
		hmr,
		loadDefaultErrorListeners: true,
		defaultCooldown: {
			limit: 1,
			delay: 5e3
		},
		logger: {
			level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug
		},
		i18n: parseI18nOption()
	};
}
