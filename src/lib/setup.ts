import { addFormatters } from '@skyra/http-framework-i18n';

addFormatters(
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
		format: (value: number, lng?: string) => value.toLocaleString(lng)
	}
);
