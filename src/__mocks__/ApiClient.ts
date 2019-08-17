/* eslint-disable @typescript-eslint/camelcase */

import IApiClient from '../IApiClient';

/** @internal */
export const MOCK_CHECK_ID = 'ngg8';

const CHECK_DATA = {
	token: MOCK_CHECK_ID,
	url: 'https://updown.io',
	alias: '',
	last_status: 200,
	uptime: 100,
	down: false,
	down_since: null,
	error: null,
	period: 30,
	apdex_t: 0.5,
	string_match: '',
	enabled: true,
	published: true,
	disabled_locations: [],
	last_check_at: '2016-02-07T13:59:51Z',
	next_check_at: '2016-02-07T14:00:21Z',
	mute_until: null,
	favicon_url: 'https://updown.io/favicon.png',
	custom_headers: {},
	http_verb: 'GET/HEAD',
	http_body: null,
	ssl: {
		tested_at: '2016-02-07T13:30:08Z',
		valid: true,
		error: null
	}
};

/**
 * This mock returns dummy data for each known endpoint, instead of performing
 * an actual API request. The data is copied directly from the example
 * responses in the Updown API docs.
 *
 * @internal
 */
export default class ApiClient implements IApiClient {

	private readonly readonly : boolean;

	public constructor(_apiKey : string, readonly : boolean) {
		this.readonly = readonly;
	}

	public async get(endpoint : string, _data : Record<string, any> = {}) : Promise<Record<string, any>> {
		switch (endpoint) {
			case 'checks':
				return [CHECK_DATA];

			case 'check':
				return CHECK_DATA;

			case `checks/${ MOCK_CHECK_ID }/downtimes`:
				return [{
					error: 'Timeout was reached',
					started_at: '2015-12-03T09:08:34Z',
					ended_at: '2015-12-03T09:14:19Z',
					duration: 346
				}, {
					error: 'Timeout was reached',
					started_at: '2015-12-01T15:25:58Z',
					ended_at: '2015-12-01T15:28:40Z',
					duration: 163
				}];

			case `checks/${ MOCK_CHECK_ID }/metrics`:
				return {
					apdex: 0.999,
					requests: {
						samples: 87441,
						failures: 2,
						satisfied: 87357,
						tolerated: 77,
						by_response_time: {
							under125: 70521,
							under250: 71126,
							under500: 87357,
							under1000: 87422,
							under2000: 87434,
							under4000: 87438
						}
					},
					timings: {
						redirect: 0,
						namelookup: 9,
						connection: 88,
						handshake: 183,
						response: 90,
						total: 370
					}
				};
		}

		throw new Error('Unknown endpoint');
	}

	public async post(endpoint : string, _data : Record<string, any>) : Promise<Record<string, any>> {
		if (this.readonly) {
			throw new Error('Updown is set to read-only mode');
		}

		switch (endpoint) {
			case 'checks':
				return CHECK_DATA;
		}

		throw new Error('Unknown endpoint');
	}

	public async put(endpoint : string, _data : Record<string, any>) : Promise<Record<string, any>> {
		if (this.readonly) {
			throw new Error('Updown is set to read-only mode');
		}

		switch (endpoint) {
			case `checks/${ MOCK_CHECK_ID }`:
				return CHECK_DATA;
		}

		throw new Error('Unknown endpoint');
	}

	public async delete(endpoint : string) : Promise<Record<string, any>> {
		if (this.readonly) {
			throw new Error('Updown is set to read-only mode');
		}

		switch (endpoint) {
			case `checks/${ MOCK_CHECK_ID }`:
				return { deleted: true };
		}

		throw new Error('Unknown endpoint');
	}
}
