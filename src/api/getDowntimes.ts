import fetch from 'cross-fetch';

import { Downtime } from '../types/Downtime';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export interface GetDowntimesOptions {
	/**
	 * The page to fetch (100 results per page)
	 */
	page ?: number;
}

export function getDowntimes(
	apiKey : string,
	token : string,
	options : GetDowntimesOptions = {},
) : Promise<Downtime[]> {
	return fetch(formatUrl(apiKey, ['checks', token, 'downtimes'], options)).then(handleResponse);
}
