import fetch from 'cross-fetch';

import { Check, CheckOptions } from '../types/Check';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export function updateCheck(
	apiKey : string,
	token : string,
	options : Partial<CheckOptions>,
) : Promise<Check> {
	return fetch(formatUrl(apiKey, ['checks', token]), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.assign({}, options, { token })),
	}).then(handleResponse);
}
