export function formatUrl(apiKey : string, endpoint : string[], query : Record<string, any> = {}) : string {
	let url = endpoint
		.map(s => encodeURIComponent(s))
		.join('/');

	let querystring = Object.entries(query)
		.filter(([_, value]) => value !== undefined)
		.map(([key, value]) => {
			if (typeof value === 'boolean') {
				value = value ? '1' : '0';
			}
			return [key, value];
		})
		.map(([key, value]) => `${ encodeURIComponent(key)  }=${  encodeURIComponent(value) }`)
		.join('&');

	let key = '';
	if (apiKey.length > 0) {
		key = `&api-key=${ encodeURIComponent(apiKey) }`;
	}
	return `http://updown.io/api/${ url }?${ querystring }${ key }`;
}
