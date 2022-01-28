import type { BaleadaEnv } from '#lib/env/types';

declare global {
	namespace NodeJS {
		interface ProcessEnv extends BaleadaEnv {}
	}
}
