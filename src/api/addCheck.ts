import fetch from 'cross-fetch';

import { Check, CheckOptions } from '../types/Check';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export function addCheck(
	apiKey : string,
	options : CheckOptions,
) : Promise<Check> {
	return fetch(formatUrl(apiKey, ['checks']), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(options),
	}).then(handleResponse);
}
