import { Client } from '@skyra/http-framework';
import { envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import { load, init, addFormatters } from '@skyra/http-framework-i18n';
import type { PathLike } from 'fs';
import { registerCommands } from '#lib/utils/registerCommands';
import { createBanner } from '@skyra/start-banner';
import { blue } from 'colorette';
import { auth } from 'osu-api-extended';

const main = async () => {
	setup(new URL('../src/.env', import.meta.url));
	await load(new URL('../src/languages', import.meta.url) as PathLike);

	const client = new Client({
		discordPublicKey: envParseString('DISCORD_PUBLIC_KEY')
	});

	void addFormatters(
		{
			name: 'uppercase',
			format: (value: string) => value.toUpperCase()
		},
		{
			name: 'lowercase',
			format: (value: string) => value.toLowerCase()
		},
		{
			name: 'localeString',
			format: (value: number, lng: string | undefined) => value.toLocaleString(lng)
		}
	);

	await init();
	await auth.login(envParseInteger('OSU_CLIENT_ID'), envParseString('OSU_CLIENT_SECRET'));
	await client.load();
	void registerCommands();

	const address = envParseString('HTTP_ADDRESS', '0.0.0.0');
	const port = envParseInteger('HTTP_PORT', 3000);

	await client.listen({ address, port });

	console.log(
		createBanner({
			name: [
				blue(String.raw`  ____        _                _       `),
				blue(String.raw` | __ )  ___ | | ___  ___   __| | ___ `),
				blue(String.raw` |  _ \ / _ \| |/ _ \/ _ \ / _  |/ _ \ `),
				blue(String.raw` | |_) | (_| | |  __/ (_| | (_| | (_| |`),
				blue(String.raw` |____/ \__,_|_|\___|\__,_|\__,_|\__,_|`),
				blue(String.raw`                                       `)
			],
			extra: [`Listening on ${address}:${port}`]
		})
	);
};

void main();
