import Metrics from './Metrics';
import Validator from '../util/Validator';

/**
 * A {@link Metrics} instance for metrics that are grouped by host. See
 * {@link Updown.getMetrics} for grouping options.
 */
export default class HostGroupedMetrics extends Metrics {

	/**
	 * ID of the host, aka the monitoring location from where these checks
	 * were executed
	 *
	 * @category Host
	 */
	public readonly host : string;

	/**
	 * IP address of the host
	 *
	 * @category Host
	 */
	public readonly ip : string;

	/**
	 * City where the host is located
	 *
	 * @category Host
	 */
	public readonly city : string;

	/**
	 * Full country name where the host is located
	 *
	 * @category Host
	 */
	public readonly country : string;

	/**
	 * Two-letter country code for the country where the host is located
	 *
	 * @category Host
	 */
	public readonly countryCode : string;

	/** @internal */
	public constructor(host : string, metricsData : any) {
		super(metricsData);

		this.host = host;

		const v = new Validator(metricsData.host);
		this.ip = v.getString('ip');
		this.city = v.getString('city');
		this.country = v.getString('country');
		this.countryCode = v.getString('country_code');
	}

}
