import Validator from './util/Validator';

/**
 * An object containing the SSL status of a check, if an SSL certificate was
 * detected at the given URL.
 *
 * @see {@link Check.ssl}
 */
export interface CheckSslStatus {
	readonly tested : Date;
	readonly valid : boolean;
	readonly error ?: string;
}

/**
 * The possible locations of a check
 */
export type CheckLocation = 'lan' | 'mia' | 'bhs' | 'rbx' | 'fra' | 'sin' | 'tok' | 'syd'; // TODO make this an enum

/**
 * Represents an Updown check
 *
 * ### Naming
 * The properties of the Check class are mapped directly onto the fields
 * returned by the API. However, the naming is changed slightly from
 * `snake_case` to `camelCase` because it is the standard in Javascript.
 *
 * Additionally, some properties have been renamed for clarity according to my
 * personal preference.
 *
 * The original field names are listed in the description of each property if
 * they are different.
 */
export default class Check {

	/**
	 * The check's unique identifier token
	 */
	readonly token : string;

	/**
	 * The URL to check
	 */
	readonly url : string;

	/**
	 * Custom alias of this check
	 */
	readonly alias ?: string;

	/**
	 * True if this check is enabled
	 */
	readonly enabled : boolean;

	/**
	 * True if this check's status page is publicly available
	 */
	readonly published : boolean;

	/**
	 * The interval between checks
	 *
	 * @remarks Corresponds to the `period` field of the API
	 */
	readonly interval : number;

	/**
	 * String that should exist on the page for a successful check
	 *
	 * @remarks Corresponds to the `string_match` field of the API
	 */
	readonly stringMatch ?: string;

	/**
	 * The HTTP method to use for check requests
	 *
	 * @remarks Corresponds to the `http_verb` field of the API
	 */
	readonly httpMethod : string;

	/**
	 * Body data to send with check requests
	 *
	 * Not applicable for checks with GET/HEAD method
	 *
	 * @remarks Corresponds to the `http_body` field of the API
	 */
	readonly httpBody ?: string;

	/**
	 * Custom headers to send with check requests
	 *
	 * @remarks Corresponds to the `custom_headers` field of the API
	 */
	readonly customHeaders : Record<string, string>;

	/**
	 * Contains the identifiers of the disabled monitoring locations
	 *
	 * @see {@link CheckLocation}
	 *
	 * @remarks Corresponds to the `disabled_locations` field of the API
	 */
	readonly disabledLocations : CheckLocation[];

	/**
	 * URL to the site's favicon, if one was found
	 *
	 * @remarks Corresponds to the `favicon_url` field of the API
	 */
	readonly favicon ?: string;

	/**
	 * Last received HTTP status
	 *
	 * @remarks Corresponds to the `last_status` field of the API
	 */
	readonly lastStatus ?: number;

	/**
	 * Uptime percentage as a number between 0-100
	 */
	readonly uptime : number;

	/**
	 * Apdex target in seconds
	 *
	 * @remarks Corresponds to the `apdex_t` field of the API
	 */
	readonly apdexTarget : number;

	/**
	 * When the last check was executed
	 *
	 * @remarks Corresponds to the `last_check` field of the API
	 */
	readonly lastCheck ?: Date;

	/**
	 * When the next check is scheduled
	 *
	 * @remarks Corresponds to the `next_check` field of the API
	 */
	readonly nextCheck : Date;

	/**
	 * If set, notifications about this check are muted until this date
	 *
	 * @remarks Corresponds to the `mute_until` field of the API
	 */
	readonly muteUntil ?: Date;

	/**
	 * Will be true if this URL is down
	 *
	 * @remarks If true, {@link downSince} and {@link error} should be set
	 */
	readonly down : boolean;

	/**
	 * The time when the URL went down, if {@link down} is true
	 *
	 * @remarks Corresponds to the `down_since` field of the API
	 */
	readonly downSince ?: Date;

	/**
	 * The corresponding error message if {@link down} is true
	 */
	readonly error ?: string;

	/**
	 * The SSL status of the URL, if an SSL certificate was found on the URL
	 */
	readonly ssl ?: CheckSslStatus;

	/** @internal */
	public constructor(checkData : any) {
		const v = new Validator(checkData);

		this.token = v.getString('token');
		this.url = v.getString('url');
		this.alias = v.getString('alias', true);
		this.enabled = v.getBoolean('enabled');
		this.published = v.getBoolean('published');

		this.interval = v.getNumber('period');
		this.stringMatch = v.getString('string_match', true);

		this.httpMethod = v.getString('http_verb');
		this.httpBody = v.getString('http_body', true);
		this.customHeaders = v.getObject('custom_headers');

		this.disabledLocations = v.getArray('disabled_locations', 'string');

		this.favicon = v.getString('favicon_url', true);

		this.lastStatus = v.getNumber('last_status', true);
		this.uptime = v.getNumber('uptime');
		this.apdexTarget = v.getNumber('apdex_t');

		this.lastCheck = v.getDate('last_check_at', true);
		this.nextCheck = v.getDate('next_check_at');
		this.muteUntil = v.getDate('mute_until', true);

		this.down = v.getBoolean('down');
		this.downSince = v.getDate('down_since', true);
		this.error = v.getString('error', true);

		this.ssl = validateSsl(v.getObject('ssl', true));
	}
}

/**
 * Validates the nested SSL object of check data
 *
 * @param data  The SSL object of the original data, or undefined if no SSL object exists
 */
function validateSsl(data : any) : CheckSslStatus | undefined {
	if (!data) return undefined;

	const v = new Validator(data);

	return {
		tested: v.getDate('tested_at'),
		valid: v.getBoolean('valid'),
		error: v.getString('error', true),
	};
}
