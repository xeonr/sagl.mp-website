import * as countries from 'i18n-iso-countries';

import en from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(en);

export function transformCountryName(value: string) {
	return countries.getName(value, 'en', { select: 'official'}) ?? 'Unknown'
}