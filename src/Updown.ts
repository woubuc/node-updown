import ApiClient from './ApiClient';
import Check from './Check';
import Downtime from './Downtime';
import Metrics from './Metrics';
import UpdownConfig, { parseConfig } from './UpdownConfig';

/** The interval for checks */
type CheckInterval = 15 | 30 | 60 | 120 | 300 | 600 | 1800 | 3600;

/**
 * Defines how metrics data is grouped when calling {@link Updown.getMetrics}
 */
export enum MetricsGrouping {
	/** No grouping, all metrics data will be in a single object */
	None = 'none',

	/** Group results per hour */
	Time = 'time',

	/** Group results per monitoring location */
	Host = 'host',
}

/**
 * # Updown API Client
 * Create a new client instance with your API key:
 * ```typescript
 * import Updown from 'node-updown';
 * const updown = new Updown('API_KEY');
 * ```
 *
 * To use a readonly key, add a config object with `readonly: true`:
 * ```typescript
 * const updown = new Updown('READONLY_API_KEY', { readonly: true });
 * ```
 *
 * See {@link UpdownConfig} for all options of the config object.
 *
 * ### Async
 * The API client is asynchronous and all methods will return promises.
 *
 * The documentation will assume use of `async/await`, but you can of course
 * also use the classic Promise API:
 *
 * ```typescript
 * updown.getAllChecks().then(checks => {
 *     console.log(checks);
 * });
 * ```
 *
 * ### API endpoints
 * All API endpoints should be supported in this module. If not, please [open an issue](https://github.com/woubuc/node-updown).
 *
 * For more information on the various API endpoints, see the [Updown API documentation](https://updown.io/api)
 */
export default class Updown {

	private readonly client : ApiClient;

	/**
	 * Initialises the API client
	 *
	 * @param apiKey    Your Updown API key
	 * @param config    Config object, see {@link UpdownConfig} for the options
	 */
	constructor(apiKey : string, config : Partial<UpdownConfig>);

	/**
	 * Initialises the API client
	 *
	 * @param apiKey    Your Updown API key
	 */
	constructor(apiKey : string);

	constructor(apiKey : string, userConfig : Partial<UpdownConfig> = {}) {
		const config = parseConfig(userConfig);

		this.client = new ApiClient(apiKey, config);
	}



	/**
	 * Gets all checks for the user
	 *
	 * @category Readonly
	 *
	 * ```typescript
	 * const checks = await updown.getAllChecks();
	 * ```
	 */
	public async getAllChecks() : Promise<Check[]> {
		const checksData = await this.client.get('checks');

		if (!Array.isArray(checksData)) {
			throw new TypeError(`Received invalid data from API. Expected array, got ${ typeof checksData }`);
		}

		return checksData.map(data => new Check(data));
	}



	/**
	 * Gets a single check
	 *
	 * @category Readonly
	 *
	 * ```typescript
	 * const check = await updown.getCheck('MY_TOKEN');
	 * ```
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
	 * @category Readonly
	 *
	 * ```typescript
	 * const page1 = await updown.getDowntime('MY_TOKEN');
	 * const page2 = await updown.getDowntime('MY_TOKEN', 2);
	 * ```
	 *
	 * @param token   Token identifier of the check
	 * @param [page]  Page number (results are paginated per 100)
	 */
	public async getDowntime(token : string, page ?: number) : Promise<Downtime[]>;

	/**
	 * Gets the downtime information for a check
	 *
	 * ```typescript
	 * const check = await updown.getCheck('MY_TOKEN');
	 *
	 * const page1 = await updown.getDowntime(check);
	 * const page2 = await updown.getDowntime(check, 2);
	 * ```
	 *
	 * @param check   The check
	 * @param [page]  Page number (results are paginated per 100)
	 */
	public async getDowntime(check : Check, page ?: number) : Promise<Downtime[]>;

	public async getDowntime(tokenOrCheck : Check | string, page : number = 1) : Promise<Downtime[]> {
		const token = getToken(tokenOrCheck);

		const downtimes : any[] = await this.client.get(`checks/${ token }/downtimes`, { page });

		return downtimes.map(data => new Downtime(token, data));
	}



	/**
	 * Gets the metrics information for a check during a given time period
	 *
	 * @remarks As noted in the Updown API documentation, statistic are
	 * aggregated per hour. Requesting any time interval smaller than one hour
	 * may not return any values.
	 *
	 * @category Readonly
	 *
	 * ```typescript
	 * const year = await updown.getMetrics('MY_TOKEN', new Date('2018/01/01'), new Date('2018/12/31'));
	 * const groupedByHost = await updown.getMetrics('MY_TOKEN', new Date('2018/01/01'), new Date('2018/12/31'), MetricsGrouping.Host);
	 * ```
	 *
	 * @param token    Token identifier of the check
	 * @param from     Request metrics starting from this date
	 * @param to       Request methods up until this date
	 * @param [group]  How to group the returned metrics (defaults to no grouping)
	 */
	public async getMetrics(token : string, from : Date, to : Date, group ?: MetricsGrouping) : Promise<any>;

	/**
	 * Gets the metrics information for a check during a given time period
	 *
	 * @remarks As noted in the Updown API documentation, statistic are
	 * aggregated per hour. Requesting any time interval smaller than one hour
	 * may not return any values.
	 *
	 * ```typescript
	 * const check = await updown.getCheck('MY_TOKEN');
	 *
	 * const year = await updown.getMetrics(check, new Date('2018/01/01'), new Date('2018/12/31'));
	 * const groupedByTime = await updown.getMetrics(check, new Date('2018/01/01'), new Date('2018/12/31'), MetricsGrouping.Time);
	 * ```
	 *
	 * @param check    The check
	 * @param from     Request metrics starting from this date
	 * @param to       Request methods up until this date
	 * @param [group]  How to group the returned metrics (defaults to no grouping)
	 */
	public async getMetrics(check : Check, from : Date, to : Date, group ?: MetricsGrouping) : Promise<any>;

	/**
	 * Gets the metrics information for a check in the last month
	 *
	 * ```typescript
	 * const metrics = await updown.getMetrics('MY_TOKEN');
	 * const groupedByHost = await updown.getMetrics('MY_TOKEN', MetricsGrouping.Host);
	 * ```
	 *
	 * @param token    Token identifier of the check
	 * @param [group]  How to group the returned metrics (defaults to no grouping)
	 */
	public async getMetrics(token : string, group ?: MetricsGrouping) : Promise<any>;

	/**
	 * Gets the metrics information for a check in the last month
	 *
	 * ```typescript
	 * const check = await updown.getCheck('MY_TOKEN');
	 *
	 * const metrics = await updown.getMetrics(check);
	 * const groupedByHost = await updown.getMetrics(check, MetricsGrouping.Host);
	 * ```
	 *
	 * @param check    The check
	 * @param [group]  How to group the returned metrics (defaults to no grouping)
	 */
	public async getMetrics(check : Check, group ?: MetricsGrouping) : Promise<any>;

	public async getMetrics(tokenOrCheck : string | Check, fromOrGroup ?: Date | MetricsGrouping, to ?: Date, group ?: MetricsGrouping) : Promise<any> {
		let from : Date | undefined = undefined;
		if (fromOrGroup instanceof Date) {
			from = fromOrGroup;
		} else {
			group = fromOrGroup;
		}

		const token = getToken(tokenOrCheck);

		const query : Record<string, any> = {};
		if (group && group !== MetricsGrouping.None) query.group = group.toString();
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

/**
 * Takes a token or check parameter and returns the token
 *
 * @param tokenOrCheck - String token or Check instance
 */
function getToken(tokenOrCheck : string | Check) : string {
	if (tokenOrCheck instanceof Check) return tokenOrCheck.token;
	return tokenOrCheck;
}
