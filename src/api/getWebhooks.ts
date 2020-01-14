import fetch from 'cross-fetch';

import { Webhook } from '../types/Webhook';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export function getWebhooks(
	apiKey : string,
) : Promise<Webhook[]> {
	return fetch(formatUrl(apiKey, ['webhooks'])).then(handleResponse);
}
