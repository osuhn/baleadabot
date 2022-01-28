import '#lib/setup';
import { Client } from '#lib/Client';
import { envParseString } from '#lib/env';

const main = async () => {
	await new Client().login(envParseString('DISCORD_TOKEN'));
};

void main();
