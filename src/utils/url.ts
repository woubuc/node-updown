import { APIKey } from '../types';

export const formatUrl = (apiKey : APIKey, endpoint : string[], query : Record<string, any> = {}) : string => {
	const url = endpoint
		.map(s => encodeURIComponent(s))
		.join('/');

	const querystring = Object.entries(query)
		.filter(([_, value]) => value !== undefined)
		.map(([key, value]) => {
			if (typeof value === 'boolean') {
				value = value ? '1' : '0';
			}
			return [key, value];
		})
		.map(([key, value]) => `${ encodeURIComponent(key)  }=${  encodeURIComponent(value) }`)
		.join('&');

	const key = apiKey.length > 0?`&api-key=${ encodeURIComponent(apiKey) }` : '';

	return `https://updown.io/api/${ url }?${ querystring }${ key }`;
};
