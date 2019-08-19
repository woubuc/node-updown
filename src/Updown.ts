import ApiClient from './ApiClient';
import Check from './Check';
import Downtime from './Downtime';
import Metrics from './metrics/Metrics';
import TimeGroupedMetrics from './metrics/TimeGroupedMetrics';
import HostGroupedMetrics from './metrics/HostGroupedMetrics';
import UpdownConfig, { parseConfig } from './UpdownConfig';

/** The interval for checks */
type CheckInterval = 15 | 30 | 60 | 120 | 300 | 600 | 1800 | 3600;

export enum MetricsGrouping {
	None = 'none',
	Time = 'time',
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
	private readonly verbose : boolean;

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
		this.verbose = config.verbose;

		if (config.verbose) {
			if (config.readonly) {
				console.log('[Updown] Initialised in read-only mode');
			} else {
				console.log('[Updown] Initialised');
			}
		}
	}



	/**
	 * Gets all checks for the user
	 *
	 * ```typescript
	 * const checks = await updown.getAllChecks();
	 * ```
	 *
	 * @category Readonly
	 */
	public async getAllChecks() : Promise<Check[]> {
		if (this.verbose) {
			console.log('[Updown] Getting all checks');
		}

		const checksData = await this.client.get('checks');

		if (!Array.isArray(checksData)) {
			throw new TypeError(`Received invalid data from API. Expected array, got ${ typeof checksData }`);
		}

		return checksData.map(data => new Check(data));
	}



	/**
	 * Gets a single check
	 *
	 * ```typescript
	 * const check = await updown.getCheck('MY_TOKEN');
	 * ```
	 *
	 * @category Readonly
	 *
	 * @param token  The token of the check
	 */
	public async getCheck(token : string) : Promise<Check> {
		if (this.verbose) {
			console.log('[Updown] Getting check with token %s', token);
		}

		const checkData = await this.client.get(`checks/${ token }`);

		return new Check(checkData);
	}



	/**
	 * Gets the downtime information for a check
	 *
	 * ```typescript
	 * const page1 = await updown.getDowntime('MY_TOKEN');
	 * const page2 = await updown.getDowntime('MY_TOKEN', 2);
	 * ```
	 *
	 * @category Readonly
	 *
	 * @param token  Token identifier of the check
	 * @param page   Page number (results are paginated per 100)
	 */
	public async getDowntime(token : string, page : number = 1) : Promise<Downtime[]> {
		if (this.verbose) {
			console.log('[Updown] Getting downtime for check with token %s', token);
		}

		const downtimes : any[] = await this.client.get(`checks/${ token }/downtimes`, { page });

		return downtimes.map(data => new Downtime(token, data));
	}



	/**
	 * Gets the metrics information for a check during a given time period,
	 * grouped by host
	 *
	 * ```typescript
	 * const metrics = await updown.getMetrics('MY_TOKEN', MetricsGrouping.Host);
	 * const metricsLastYear = await updown.getMetrics('MY_TOKEN', MetricsGrouping.Host, new Date('2018/01/01'), new Date('2018/12/31'));
	 * ```
	 *
	 * @remarks As noted in the Updown API documentation, statistic are
	 * aggregated per hour. Requesting any time interval smaller than one hour
	 * may not return any values.
	 *
	 * @category Readonly
	 *
	 * @param token  Token identifier of the check
	 * @param group  How to group the results
	 * @param from   Request metrics starting from this date (defaults to 1 month ago)
	 * @param to     Request methods up until this date (defaults to now)
	 */
	public async getMetrics(token : string, group : MetricsGrouping.Host, from ?: Date, to ?: Date) : Promise<HostGroupedMetrics[]>;

	/**
	 * Gets the metrics information for a check during a given time period,
	 * grouped by time
	 *
	 * ```typescript
	 * const metrics = await updown.getMetrics('MY_TOKEN', MetricsGrouping.Time);
	 * const metricsLastYear = await updown.getMetrics('MY_TOKEN', MetricsGrouping.Time, new Date('2018/01/01'), new Date('2018/12/31'));
	 * ```
	 *
	 * @remarks As noted in the Updown API documentation, statistic are
	 * aggregated per hour. Requesting any time interval smaller than one hour
	 * may not return any values.
	 *
	 * @param token  Token identifier of the check, or the check instance
	 * @param group  How to group the results
	 * @param from   Request metrics starting from this date (defaults to 1 month ago)
	 * @param to     Request methods up until this date (defaults to now)
	 */
	public async getMetrics(token : string, group : MetricsGrouping.Time, from ?: Date, to ?: Date) : Promise<TimeGroupedMetrics[]>;

	/**
	 * Gets the metrics information for a check during a given time period
	 *
	 * ```typescript
	 * const metrics = await updown.getMetrics('MY_TOKEN', MetricsGrouping.None);
	 * const metricsLastYear = await updown.getMetrics('MY_TOKEN', MetricsGrouping.None, new Date('2018/01/01'), new Date('2018/12/31'));
	 * ```
	 *
	 * @remarks As noted in the Updown API documentation, statistic are
	 * aggregated per hour. Requesting any time interval smaller than one hour
	 * may not return any values.
	 *
	 * @param token  Token identifier of the check, or the check instance
	 * @param group  How to group the results
	 * @param from   Request metrics starting from this date (defaults to 1 month ago)
	 * @param to     Request methods up until this date (defaults to now)
	 *
	 * @returns Returns the Metrics instance, or undefined if no metrics were found
	 *          for the given check (e.g. when the check was not monitored during
	 *          the given time period)
	 */
	public async getMetrics(token : string, group : MetricsGrouping.None, from ?: Date, to ?: Date) : Promise<Metrics | undefined>;

	/**
	 * Gets the metrics information for a check during a given time period
	 *
	 * ```typescript
	 * const metrics = await updown.getMetrics('MY_TOKEN');
	 * const metricsLastYear = await updown.getMetrics('MY_TOKEN', new Date('2018/01/01'), new Date('2018/12/31'));
	 * ```
	 *
	 * @remarks As noted in the Updown API documentation, statistic are
	 * aggregated per hour. Requesting any time interval smaller than one hour
	 * may not return any values.
	 *
	 * @param token  Token identifier of the check, or the check instance
	 * @param from   Request metrics starting from this date (defaults to 1 month ago)
	 * @param to     Request methods up until this date (defaults to now)
	 *
	 * @returns Returns the Metrics instance, or undefined if no metrics were found
	 *          for the given check (e.g. when the check was not monitored during
	 *          the given time period)
	 */
	public async getMetrics(token : string, from ?: Date, to ?: Date) : Promise<Metrics | undefined>;

	public async getMetrics(token : string, group ?: MetricsGrouping | Date, from ?: Date, to ?: Date) : Promise<Metrics | HostGroupedMetrics[] | TimeGroupedMetrics[] | undefined> {
		if (group instanceof Date) {
			return this._getMetrics(token, MetricsGrouping.None, group, from);
		}

		if (!group) {
			return this._getMetrics(token, MetricsGrouping.None, from, to);
		}

		return this._getMetrics(token, group, from, to);
	}

	/** @internal */
	private async _getMetrics(token : string, group : MetricsGrouping, from ?: Date, to ?: Date) : Promise<Metrics | HostGroupedMetrics[] | TimeGroupedMetrics[] | undefined> {
		if (this.verbose) {
			if (group !== MetricsGrouping.None) {
				console.log('[Updown] Getting metrics for check with token %s, grouped by %s', token, group.toString());
			} else {
				console.log('[Updown] Getting metrics for check with token %s', token);
			}
		}

		const query : Record<string, any> = {};
		if (group !== MetricsGrouping.None) query.group = group.toString();
		if (from) query.from = from.toISOString();
		if (to) query.to = to.toISOString();

		const metricsData = await this.client.get<Record<string, any>>(`checks/${ token }/metrics`, query);

		switch (group) {
			case MetricsGrouping.Host:
				return Object.keys(metricsData).map(host => new HostGroupedMetrics(host, metricsData[host]));

			case MetricsGrouping.Time:
				return Object.keys(metricsData).map(time => new TimeGroupedMetrics(time, metricsData[time]));

			default:
				// An empty object means there is no metrics data yet for this check
				if (Object.keys(metricsData).length === 0) {
					return undefined;
				}

				return new Metrics(metricsData);

		}
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
