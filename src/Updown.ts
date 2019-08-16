import { format } from 'date-fns';
import fetch from 'node-fetch';
import * as qs from 'querystring';

/**
 * Options object used when creating a new Updown API client
 */
export interface Options {
	readOnly ?: boolean;
}

/** An object with primitive values (i.e. no arrays/objects) */
interface PrimitiveObject {
	[key : string] : string | number;
}

/** An HTTP method */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** The interval for checks */
export type CheckInterval = 15 | 30 | 60 | 120 | 300 | 600 | 1800 | 3600;

/**
 * API client for the updown.io service
 */
export default class Updown {

	private readonly apiKey : string;
	private readonly isReadOnly : boolean;

	/**
	 * Initialises the API client
	 *
	 * @param apiKey  Your Updown API key
	 * @param config  A configuration object
	 */
	constructor(apiKey : string, config : Options = {}) {
		this.apiKey = apiKey;
		this.isReadOnly = config.readOnly || false;
	}

	/**
	 * Gets all checks for the user
	 */
	public async getChecks() {
		return this.get('https://updown.io/api/checks');
	}

	/**
	 * Gets downtime information about a specific check
	 *
	 * @param token   The token for a check
	 * @param [page]  Page number (results are paginated per 100)
	 */
	public async getDowntime(token : string, page : number = 1) {
		return this.get(`https://updown.io/api/checks/${token}/downtimes`, { page });
	}

	/**
	 * Gets metrics for a specific check
	 *
	 * @param token    The token for a check
	 * @param [from]   Start date of the metrics
	 * @param [to]     End date of the metrics
	 * @param [group]  Grouping to use, either 'time' or 'host'
	 */
	public async getMetrics(token : string, from ?: Date, to ?: Date, group : 'time' | 'host' = 'host') {
		const query : PrimitiveObject = { group };

		if (from) query.from = format(from);
		if (to) query.to = format(to);

		return this.get(`https://updown.io/api/checks/${token}/metrics`, query);
	}

	/**
	 * Adds new check
	 *
	 * @param url       The URL to check
	 * @param interval  The interval in seconds (15, 30, 60, 120, 300, 600, 1800 or 3600)
	 * @param [name]    An alias to recognise this url by
	 */
	public async addCheck(url : string, interval : CheckInterval, name ?: string) {
		if (this.isReadOnly) {
			throw new Error('Updown is set to read-only mode');
		}

		const params : PrimitiveObject = {
			url,
			period: interval,
		};
		if (name) params.name = name;

		return this.req('https://updown.io/api/checks/', 'POST', params);
	}

	/**
	 * Modifies a check
	 *
	 * @param token       The token
	 * @param [url]       The new URL
	 * @param [interval]  The new interval in seconds (15, 30, 60, 120, 300, 600, 1800 or 3600)
	 * @param [name]      A new alias for the check
	 */
	public async modifyCheck(token : string, url ?: string, interval ?: CheckInterval, name ?: string) {
		if (this.isReadOnly) {
			throw new Error('Updown is set to read-only mode');
		}

		const params : PrimitiveObject = {};
		if (url) params.url = url;
		if (interval) params.period = interval;
		if (name) params.name = name;

		return this.req(`https://updown.io/api/checks/${token}`, 'PUT', params);
	}

	/**
	 * Deletes a check
	 *
	 * @param {string} token - Token of the check to delete
	 */
	public async deleteCheck(token : string) {
		if (this.isReadOnly) {
			throw new Error('Updown is set to read-only mode');
		}

		return this.req(`https://updown.io/api/checks/${token}`, 'DELETE');
	}
	/**
	 * Loads an URL with the Updown API key header
	 *
	 * @param url      The API URL to call
	 * @param [query]  Parameters to be added to the querystring
	 */
	private async get(url : string, query : PrimitiveObject = {}) {

		// Add timestamp to query to prevent caching
		query._t = new Date().getTime();

		const res = await fetch([url, qs.stringify(query)].join('?'), {
			headers: { 'X-API-KEY': this.apiKey },
		});
		return res.json();
	}

	/**
	 *  Posts data to an URL with the Updown API key header
	 *
	 *  @param url       The API URL to post to
	 *  @param [method]  Method for the HTTP request
	 *  @param [params]  Parameters to be sent in the POST body
	 */
	private async req(url : string, method : HttpMethod = 'POST', params : PrimitiveObject = {}) {
		const res = await fetch(url, {
			method,
			body: qs.stringify(params),
			headers: { 'X-API-KEY': this.apiKey },
		});
		return res.json();
	}

}

module.exports = Updown;
