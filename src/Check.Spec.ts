import Check from './Check';

describe('Check initialisation', () => {

	test('Empty data', () => {
		expect(() => new Check({ })).toThrow();
	});

	test('Invalid data', () => {
		expect(() => new Check({ foo: 'bar' })).toThrow();
	});

	test('Incomplete data', () => {
		expect(() => new Check({ token: 'foo', url: 'bar' })).toThrow();
	});

	test('Valid data', () => {
		expect(new Check({
			/* eslint-disable @typescript-eslint/camelcase */
			token: 'ngg8',
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
			/* eslint-enable @typescript-eslint/camelcase */
		})).toBeInstanceOf(Check);
	})
});
