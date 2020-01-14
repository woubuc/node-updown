export interface WebhookOptions {
	/**
	 * The URL of the webhook
	 */
	url : string;
}

export interface Webhook extends WebhookOptions {
	/**
	 * The ID of the webhook
	 */
	id : string;
}
