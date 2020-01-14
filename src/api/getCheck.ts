import fetch from 'cross-fetch';

import { Check } from '../types/Check';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export interface GetCheckOptions {
	/**
	 * Include performance metrics for the last hour
	 */
	metrics ?: boolean;
}

export function getCheck(
	apiKey : string,
	token : string,
	options : GetCheckOptions = {},
) : Promise<Check> {
	return fetch(formatUrl(apiKey, ['checks', token], options)).then(handleResponse);
}
