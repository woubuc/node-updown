import fetch from 'cross-fetch';

import { Deleted } from '../types/Deleted';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export function deleteWebhook(
	apiKey : string,
	id : string,
) : Promise<Deleted> {
	return fetch(formatUrl(apiKey, ['webhooks', id]), {
		method: 'DELETE',
	}).then(handleResponse);
}
