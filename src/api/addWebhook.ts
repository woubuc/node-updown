import fetch from 'cross-fetch';

import { Webhook, WebhookOptions } from '../types/Webhook';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export function addWebhook(
	apiKey : string,
	options : WebhookOptions,
) : Promise<Webhook> {
	return fetch(formatUrl(apiKey, ['webhooks']), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(options),
	}).then(handleResponse);
}
