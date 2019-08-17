import { format } from 'date-fns';
import ApiClient from './ApiClient';

/**
 * Options object used when creating a new Updown API client
 */
export interface IOptions {
	readOnly ?: boolean;
}

/** The interval for checks */
export type CheckInterval = 15 | 30 | 60 | 120 | 300 | 600 | 1800 | 3600;

/**
 * API client for the updown.io service
 */
export default class Updown {

	private readonly client : ApiClient;

	/**
	 * Initialises the API client
	 *
	 * @param apiKey  Your Updown API key
	 * @param config  A configuration object
	 */
	constructor(apiKey : string, config : IOptions = {}) {
		this.client = new ApiClient(apiKey, !!config.readOnly);
	}

	/**
	 * Gets all checks for the user
	 */
	public async getChecks() {
		return this.client.get('https://updown.io/api/checks');
	}

	/**
	 * Gets downtime information about a specific check
	 *
	 * @param token   The token for a check
	 * @param [page]  Page number (results are paginated per 100)
	 */
	public async getDowntime(token : string, page : number = 1) {
		return this.client.get(`https://updown.io/api/checks/${token}/downtimes`, { page });
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
		const query : Record<string, any> = { group };

		if (from) query.from = format(from);
		if (to) query.to = format(to);

		return this.client.get(`https://updown.io/api/checks/${token}/metrics`, query);
	}

	/**
	 * Adds new check
	 *
	 * @param url       The URL to check
	 * @param interval  The interval in seconds (15, 30, 60, 120, 300, 600, 1800 or 3600)
	 * @param [name]    An alias to recognise this url by
	 */
	public async addCheck(url : string, interval : CheckInterval, name ?: string) {
		const params : Record<string, any> = {
			url,
			period: interval,
		};
		if (name) params.name = name;

		return this.client.post('https://updown.io/api/checks/', params);
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
		const params : Record<string, any> = {};
		if (url) params.url = url;
		if (interval) params.period = interval;
		if (name) params.name = name;

		return this.client.put(`https://updown.io/api/checks/${token}`, params);
	}

	/**
	 * Deletes a check
	 *
	 * @param {string} token - Token of the check to delete
	 */
	public async deleteCheck(token : string) {
		return this.client.delete(`https://updown.io/api/checks/${token}`);
	}

}

module.exports = Updown;
