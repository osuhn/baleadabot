import { SapphireClient } from '@sapphire/framework';
import { parseClientOptions } from '#root/config';

export class Client extends SapphireClient {
	public constructor() {
		super(parseClientOptions());
	}

	public override login(token: string) {
		return super.login(token);
	}
}
