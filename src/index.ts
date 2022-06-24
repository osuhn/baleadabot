import '#lib/setup';
import { Client, container } from '@skyra/http-framework';
import { envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import { load, init } from '@skyra/http-framework-i18n';
import { registerCommands } from '#lib/utils/registerCommands';
import { createBanner } from '@skyra/start-banner';
import { blue } from 'colorette';
import { auth } from 'osu-api-extended';

setup(new URL('../src/.env', import.meta.url));
await load(new URL('../src/languages', import.meta.url));

await init({ fallbackLng: 'en-GB', returnNull: false, returnEmptyString: false });
await auth.login(envParseInteger('OSU_CLIENT_ID'), envParseString('OSU_CLIENT_SECRET'));

const client = new Client();
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
		extra: [
			'',
			`Loaded: ${container.stores.get('commands').size} commands`,
			`      : ${container.stores.get('interaction-handlers').size} interaction handlers`,
			`Listening on ${address}:${port}`
		]
	})
);
