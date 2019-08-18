import ApiClient from './ApiClient';
import Check from './Check';
import Downtime from './Downtime';

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
	 * @param apiKey    Your Updown API key
	 * @param readonly  True if the given API key is readonly
	 */
	constructor(apiKey : string, readonly : boolean = false) {
		this.client = new ApiClient(apiKey, readonly);
	}

	/**
	 * Gets all checks for the user
	 */
	public async getChecks() : Promise<Check[]> {
		const checksData = await this.client.get('checks');

		if (!Array.isArray(checksData)) {
			throw new TypeError(`Received invalid data from API. Expected array, got ${ typeof checksData }`);
		}

		return checksData.map(data => new Check(data));
	}

	/**
	 * Gets a single check
	 *
	 * @param token  The token of the check
	 */
	public async getCheck(token : string) : Promise<Check> {
		const checkData = await this.client.get(`checks/${ token }`);

		return new Check(checkData);
	}

	/**
	 * Gets the downtime information for a check
	 *
	 * @param check   The check
	 * @param [page]  Page number (results are paginated per 100)
	 */
	public async getDowntime(check : Check, page ?: number) : Promise<Downtime[]>;

	/**
	 * Gets the downtime information for a check
	 *
	 * @param token   Token identifier of the check
	 * @param [page]  Page number (results are paginated per 100)
	 */
	public async getDowntime(token : string, page ?: number) : Promise<Downtime[]>;

	/** @hidden */
	public async getDowntime(tokenOrCheck : Check | string, page : number = 1) : Promise<Downtime[]> {
		const token = getToken(tokenOrCheck);

		const downtimes : any[] = await this.client.get(`checks/${ token }/downtimes`, { page });

		return downtimes.map(data => new Downtime(token, data));
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

		if (from) query.from = from.toISOString();
		if (to) query.to = to.toISOString();

		return this.client.get(`checks/${ token }/metrics`, query);
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

		return this.client.post('checks', params);
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

		return this.client.put(`checks/${ token }`, params);
	}

	/**
	 * Deletes a check
	 *
	 * @param {string} token - Token of the check to delete
	 */
	public async deleteCheck(token : string) {
		return this.client.delete(`checks/${ token }`);
	}

}

module.exports = Updown;

/**
 * Takes a token or check parameter and returns the token
 *
 * @param tokenOrCheck - String token or Check instance
 */
function getToken(tokenOrCheck : string | Check) : string {
	if (tokenOrCheck instanceof Check) return tokenOrCheck.token;
	return tokenOrCheck;
}
