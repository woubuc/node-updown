/**
 * The API client handles the actual communication with the Updown API. It
 * will execute requests to the API endpoints and return the response data.
 *
 * @internal
 */
export default interface IApiClient {

	/**
	 * Executes a GET request to the given API endpoint
	 *
	 * @param endpoint - The API endpoint
	 * @param query    - Query parameters to include in the request URL
	 */
	get(endpoint : string, query ?: Record<string, any>) : Promise<Record<string, any>>;

	/**
	 * Executes a POST request to the given API endpoint
	 *
	 * @param endpoint - The API endpoint
	 * @param data     - Data object to be sent along as the request body (will be serialised as a querystring)
	 */
	post(endpoint : string, data : Record<string, any>) : Promise<Record<string, any>>;

	/**
	 * Executes a PUT request to the given API endpoint
	 *
	 * @see IApiClient.post
	 */
	put(endpoint : string, data : Record<string, any>) : Promise<Record<string, any>>;

	/**
	 * Executes a DELETE request to the given API endpoint
	 *
	 * @param endpoint - The API endpoint
	 */
	delete(endpoint : string) : Promise<Record<string, any>>;
}
