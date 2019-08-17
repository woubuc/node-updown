import Validator from './util/Validator';

interface CheckSslStatus {
	readonly tested : Date;
	readonly valid : boolean;
	readonly error ?: string;
}

// TODO make this an enum
export type CheckLocation = 'lan' | 'mia' | 'bhs' | 'rbx' | 'fra' | 'sin' | 'tok' | 'syd';

/**
 * A single Updown check
 */
export default class Check {

	/** The check's unique identifier token */
	readonly token : string;

	/** The URL to check */
	readonly url : string;

	/** Alias of this check */
	readonly alias : string;

	/** True if this check is enabled */
	readonly enabled : boolean;

	/** True if this check's status page is publicly available */
	readonly published : boolean;

	/** The interval between checks (`period` in the API) */
	readonly interval : number;

	/** String that should exist on the page for a successful check */
	readonly stringMatch : string;

	/** The HTTP method to use (`http_verb` in the API) */
	readonly httpMethod : string;

	/** Body to send with check requests (not applicable for checks with GET/HEAD method) */
	readonly httpBody ?: string;

	/** Custom headers to send with check requests */
	readonly customHeaders : Record<string, string>;

	/** Disabled monitoring locations */
	readonly disabledLocations : CheckLocation[];

	/** URL to the site's favicon, if one was found */
	readonly favicon ?: string;

	/** Last received status */
	readonly lastStatus ?: number;

	/** Uptime percentage between 0-100 */
	readonly uptime : number;

	/** Apdex target, in seconds */
	readonly apdexTarget : number;

	/** When the last check was executed */
	readonly lastCheck ?: Date;

	/** When the next check is scheduled */
	readonly nextCheck : Date;

	/** If set, notifications about the current status are muted until this date */
	readonly muteUntil ?: Date;

	/** True if the URL is down */
	readonly down : boolean;

	/** If down is true, will contain the time when the URL went down */
	readonly downSince ?: Date;

	/** If down is true, the corresponding error message */
	readonly error ?: string;

	/** The SSL status of the URL */
	readonly ssl ?: CheckSslStatus;

	/** @internal */
	public constructor(checkData : any) {
		const v = new Validator(checkData);

		this.token = v.getString('token');
		this.url = v.getString('url');
		this.alias = v.getString('alias');
		this.enabled = v.getBoolean('enabled');
		this.published = v.getBoolean('published');

		this.interval = v.getNumber('period');
		this.stringMatch = v.getString('string_match');

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
