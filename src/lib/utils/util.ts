import { envParseArray } from '@skyra/env-utilities';

export function getGuilds(): readonly string[] {
	return envParseArray('REGISTRY_GUILD_ID');
}
