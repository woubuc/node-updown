import fetch from 'cross-fetch';

import { Deleted } from '../types/Deleted';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export function deleteCheck(
	apiKey : string,
	token : string,
) : Promise<Deleted> {
	return fetch(formatUrl(apiKey, ['checks', token]), {
		method: 'DELETE',
	}).then(handleResponse);
}
