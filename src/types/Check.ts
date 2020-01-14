export type CheckLocation = 'lan' | 'mia' | 'bhs' | 'rbx' | 'fra' | 'sin' | 'tok' | 'syd';
export type CheckInterval = 15 | 30 | 60 | 120 | 300 | 600 | 1800 | 3600;
export type ApdexTarget = 0.125 | 0.25 | 0.5 | 1 | 2;
export type HttpVerb = 'GET/HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export interface CheckOptions {
	/**
	 * The URL you want to monitor
	 */
	url : string;

	/**
	 * Interval in seconds
	 */
	period ?: CheckInterval;

	/**
	 * APDEX threshold in seconds
	 */
	apdex_t ?: ApdexTarget;

	/**
	 * Is the check enabled
	 */
	enabled ?: boolean;

	/**
	 * Should the status page be publish
	 */
	published ?: boolean;

	/**
	 * Human readable name
	 */
	alias ?: string;

	/**
	 * Search for this string in the page
	 */
	string_match ?: string;

	/**
	 * Mute notifications until given time. Accepts a time, 'recovery' or 'forever'.
	 */
	mute_until ?: string | 'recovery' | 'forever';

	/**
	 * The HTTP verb used to perform the request.
	 */
	http_verb ?: HttpVerb;

	/**
	 * The HTTP body sent alongside the request
	 */
	http_body ?: string;

	/**
	 * Disabled monitoring locations
	 */
	disabled_locations ?: CheckLocation[];

	/**
	 * The HTTP headers you want in updown requests
	 */
	custom_headers ?: Record<string, string>;
}

export interface Check extends CheckOptions {
	/**
	 * The check's unique token
	 */
	token : string;

	last_status : number;
	uptime : number;
	down : boolean;
	down_since ?: any;
	error ?: any;
	last_check_at ?: string;
	next_check_at : string;
	favicon_url ?: any;
}
