import Metrics from './Metrics';

describe('Metrics initialisation', () => {

	test('Empty data', () => {
		expect(() => new Metrics({ })).toThrow();
	});

	test('Invalid data', () => {
		expect(() => new Metrics({ foo: 'bar' })).toThrow();
	});

	test('Incomplete data', () => {
		expect(() => new Metrics({ apdex: 1 })).toThrow();
	});

	test('Valid data', () => {
		expect(new Metrics({
			/* eslint-disable @typescript-eslint/camelcase */
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
			/* eslint-enable @typescript-eslint/camelcase */
		})).toBeInstanceOf(Metrics);
	});

});
