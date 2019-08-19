import qs from 'querystring';
import fetch from 'node-fetch';
import UpdownConfig from './UpdownConfig';

/**
 * The API client handles the actual communication with the Updown API. It
 * will execute requests to the API endpoints and return the response data.
 *
 * @internal
 */
export default class ApiClient {

	private readonly apiKey : string;
	private readonly readonly : boolean;
	private readonly verbose : boolean;

	public constructor(apiKey : string, config : UpdownConfig) {
		this.apiKey = apiKey;
		this.readonly = config.readonly;
		this.verbose = config.verbose;
	}

	/**
	 * Executes a GET request to the given API endpoint
	 *
	 * @param endpoint  The API endpoint
	 * @param data      Query parameters to include in the request URL
	 */
	public get<T>(endpoint : string, data : Record<string, any> = {}) : Promise<T> {
		// Add timestamp to query to prevent caching
		const query = Object.assign({ _t: new Date().getTime() }, data);

		return this.request('GET', getUrl(endpoint, query));
	}

	/**
	 * Executes a POST request to the given API endpoint
	 *
	 * @param endpoint  The API endpoint
	 * @param data      Data object to be sent along as the request body (will be serialised as a querystring)
	 */
	public post<T>(endpoint : string, data : Record<string, any>) : Promise<T> {
		if (this.readonly) {
			throw new Error('Updown is set to read-only mode');
		}

		return this.request('POST', getUrl(endpoint), data);
	}

	/**
	 * Executes a PUT request to the given API endpoint
	 *
	 * @param endpoint  The API endpoint
	 * @param data      Data object to be sent along as the request body (will be serialised as a querystring)
	 */
	public put<T>(endpoint : string, data : Record<string, any>) : Promise<T> {
		if (this.readonly) {
			throw new Error('Updown is set to read-only mode');
		}

		return this.request('PUT', getUrl(endpoint), data);
	}

	/**
	 * Executes a DELETE request to the given API endpoint
	 *
	 * @param endpoint  The API endpoint
	 */
	public delete<T>(endpoint : string) : Promise<T> {
		if (this.readonly) {
			throw new Error('Updown is set to read-only mode');
		}

		return this.request('DELETE', getUrl(endpoint));
	}

	/**
	 * Executes an HTTP request
	 *
	 * @param method  HTTP method to use ('GET', 'POST', ...)
	 * @param url     The URL
	 * @param [data]  Data object to be sent along as the request body (will be serialised as a querystring)
	 */
	private async request<T>(method : string, url : string, data ?: Record<string, any>) : Promise<T> {
		// TODO add error handling in case requests fail

		if (this.verbose) {
			console.log('[Updown/ApiClient] Executing %s request to %s', method, url);
			if (data) console.log('[Updown/ApiClient] Body data:', data);
		}

		const response = await fetch(url, {
			method: method.toString(),
			body: data ? JSON.stringify(data) : undefined,
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': this.apiKey,
			},
		});

		const responseData : any = await response.json();

		if (response.status >= 400 && responseData.error) {
			throw new Error(`Updown API error: ${ responseData.error }`);
		}

		return responseData;
	}
}

/**
 * Formats the URL for an API endpoint
 *
 * @param endpoint  The API endpoint (e.g. 'checks')
 * @param [query]   Query parameters to include in the URL
 */
function getUrl(endpoint : string, query : Record<string, any> = {}) : string {
	if (endpoint.startsWith('/')) endpoint = endpoint.slice(1);

	if (!query) {
		return `https://updown.io/api/${ endpoint }?${ qs.stringify(query) }`;
	} else {
		return `https://updown.io/api/${ endpoint }`;
	}
}
