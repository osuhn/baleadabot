import '#lib/setup';
import { Client } from '#lib/Client';

const main = async () => {
	await new Client().login();
};

void main();
