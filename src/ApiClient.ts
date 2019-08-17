import qs from 'querystring';
import fetch from 'node-fetch';
import IApiClient from './IApiClient';

/** @internal */
export default class ApiClient implements IApiClient {

	private readonly apiKey : string;
	private readonly readonly : boolean;

	public constructor(apiKey : string, readonly : boolean) {
		this.apiKey = apiKey;
		this.readonly = readonly;
	}

	public get(endpoint : string, data : Record<string, any> = {}) : Promise<Record<string, any>> {
		// Add timestamp to query to prevent caching
		const query = Object.assign({ _t: new Date().getTime() }, data);

		return this.request('GET', getUrl(endpoint, query));
	}

	public post(endpoint : string, data : Record<string, any>) : Promise<Record<string, any>> {
		if (this.readonly) {
			throw new Error('Updown is set to read-only mode');
		}

		return this.request('POST', getUrl(endpoint), data);
	}

	public put(endpoint : string, data : Record<string, any>) : Promise<Record<string, any>> {
		if (this.readonly) {
			throw new Error('Updown is set to read-only mode');
		}

		return this.request('PUT', getUrl(endpoint), data);
	}

	public delete(endpoint : string) : Promise<Record<string, any>> {
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
	private async request(method : string, url : string, data ?: Record<string, any>) : Promise<Record<string, any>> {
		// TODO add error handling in case requests fail
		const response = await fetch(url, {
			method: method.toString(),
			body: data ? qs.stringify(data) : undefined,
			headers: { 'X-API-KEY': this.apiKey },
		});

		if (response.status === 401) {
			throw new Error('Updown API returned Unauthorized error. Check your API key and try again.');
		}

		return response.json();
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
