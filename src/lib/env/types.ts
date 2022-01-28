export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;

export type BaleadaEnvAny = keyof BaleadaEnv;
export type BaleadaEnvString = { [K in BaleadaEnvAny]: BaleadaEnv[K] extends BooleanString | IntegerString ? never : K }[BaleadaEnvAny];
export type BaleadaEnvBoolean = { [K in BaleadaEnvAny]: BaleadaEnv[K] extends BooleanString ? K : never }[BaleadaEnvAny];
export type BaleadaEnvInteger = { [K in BaleadaEnvAny]: BaleadaEnv[K] extends IntegerString ? K : never }[BaleadaEnvAny];

export interface BaleadaEnv {
	NODE_ENV: 'test' | 'development' | 'production';
	DOTENV_DEBUG_ENABLED: BooleanString;

	CLIENT_PREFIX: string;
	CLIENT_REGEX_PREFIX: string;
	CLIENT_OWNERS: string;

	DISCORD_TOKEN: string;
}
