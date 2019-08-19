import ResponseTimes from './ResponseTimes';

/**
 * An object containing the total amount of requests made for a set of metrics
 */
export default interface Requests {

	/**
	 * The total number of requests made
	 */
	readonly samples : number;

	/**
	 * The number of failed requests
	 */
	readonly failures : number;

	/**
	 * The number of satisfied requests
	 *
	 * A satisfied request is a request that has completed in less time than
	 * the configured Apdex target (see {@link Check.apdexTarget}).
	 */
	readonly satisfied : number;

	/**
	 * The number of tolerated requests
	 *
	 * A tolerated request is a request that has not failed, but needed more
	 * time to complete than the Apdex target (see {@link Check.apdexTarget}).
	 */
	readonly tolerated : number;

	/**
	 * Lists the same requests, but grouped by their response times
	 */
	readonly byResponseTimes : ResponseTimes;

}
