import Downtime from './Downtime';

describe('Downtime initialisation', () => {

	test('Empty data', () => {
		expect(() => new Downtime('', { })).toThrow();
	});

	test('Invalid data', () => {
		expect(() => new Downtime('', { foo: 'bar' })).toThrow();
	});

	test('Incomplete data', () => {
		expect(() => new Downtime('', { error: 'foo' })).toThrow();
	});

	test('Valid data', () => {
		expect(new Downtime('', {
			/* eslint-disable @typescript-eslint/camelcase */
			error: 'tls_timeout',
			started_at: '2018-03-07T18:24:24Z',
			ended_at: '2018-03-07T18:34:26Z',
			duration: 602,
			/* eslint-enable @typescript-eslint/camelcase */
		})).toBeInstanceOf(Downtime);

		expect(new Downtime('', {
			/* eslint-disable @typescript-eslint/camelcase */
			error: 'tls_timeout',
			started_at: '2018-03-07T18:24:24Z',
			ended_at: null,
			duration: null,
			/* eslint-enable @typescript-eslint/camelcase */
		})).toBeInstanceOf(Downtime);
	});

});
