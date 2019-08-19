/**
 * An object containing the total amount of requests made for a set of metrics,
 * grouped by their response times
 */
export default interface ResponseTimes {

	/**
	 * The number of requests that completed in less than 125 milliseconds
	 */
	readonly under125 : number;

	/**
	 * The number of requests that completed in less than 250 milliseconds
	 */
	readonly under250 : number;

	/**
	 * The number of requests that completed in less than 500 milliseconds
	 */
	readonly under500 : number;

	/**
	 * The number of requests that completed in less than 1 second
	 */
	readonly under1000 : number;

	/**
	 * The number of requests that completed in less than 2 seconds
	 */
	readonly under2000 : number;

	/**
	 * The number of requests that completed in less than 4 second
	 *
	 * 4 seconds seems to be the cutoff, after this a request will be marked as
	 * failed due to timeout.
	 */
	readonly under4000 : number;

}
