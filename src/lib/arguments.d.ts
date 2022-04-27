import type { ArrayString, IntegerString } from '@skyra/env-utilities';
import type { OsuUser } from './types/declarations/osu';

declare module '@skyra/env-utilities' {
	interface Env {
		NODE_ENV: 'test' | 'development' | 'production';

		REGISTRY_GUILD_ID: ArrayString;

		HTTP_ADDRESS: string;
		HTTP_PORT: IntegerString;

		DISCORD_PUBLIC_KEY: string;
		DISCORD_CLIENT_ID: string;
		DISCORD_APPLICATION_SECRET: string;
		DISCORD_TOKEN: string;

		OSU_CLIENT_SECRET: string;
		OSU_CLIENT_ID: IntegerString;
		OSU_COOKIE: string;
	}
}

declare module 'osu-api-extended/dist/types/v2' {
	interface user_data extends OsuUser {}
}
