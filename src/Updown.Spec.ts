/* This test file contains mostly overarching tests (i.e. integration tests)
 * that test the actual API interactions as a user of the library would. See
 * the CONTRIBUTING.md file for more information about how to add your API keys
 * and what data the tests expect in the connected account.
 */

// Since these are integration tests, only import from the index just as a
// user of the module would
import Updown, { Check, Downtime, HostGroupedMetrics, Metrics, MetricsGrouping, TimeGroupedMetrics } from '.';

require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports


const API_KEY = process.env.UPDOWN_API_KEY;
if (!API_KEY) throw new Error('Cannot run integration tests without API key');

const READONLY_API_KEY = process.env.UPDOWN_READONLY_API_KEY;
if (!READONLY_API_KEY) throw new Error('Cannot run integration tests without readonly API key');


describe('Methods', () => {
	const updown = new Updown('');

	test('Get checks', () => expect(updown).toHaveProperty('getAllChecks'));

	test('Add check', () => expect(updown).toHaveProperty('addCheck'));
	test('Modify check', () => expect(updown).toHaveProperty('modifyCheck'));
	test('Delete check', () => expect(updown).toHaveProperty('deleteCheck'));

	test('Get downtime', () => expect(updown).toHaveProperty('getDowntime'));
	test('Get metrics', () => expect(updown).toHaveProperty('getMetrics'));
});


describe('Read check data (readonly API key)', () => {
	const updown = new Updown(READONLY_API_KEY, { readonly: true });
	let allChecks : Check[] = [];

	test('Get all checks', async () => {
		const checks = await updown.getAllChecks();

		expect(Array.isArray(checks)).toBe(true);
		expect(checks.length).toBeGreaterThan(0);
		expect(checks[0]).toBeInstanceOf(Check);

		allChecks = checks;
	});


	describe('Get check', () => {
		test('By token', async () => {
			await expect(updown.getCheck(allChecks[0].token)).resolves.toBeInstanceOf(Check);
		});

		test('By invalid token', async () => {
			await expect(updown.getCheck('a')).rejects.toBeTruthy();
		});
	});

	describe('Get downtime', () => {
		test('By token', async () => {
			const downtime = await updown.getDowntime(allChecks[0].token);

			expect(Array.isArray(downtime)).toBe(true);
			expect(downtime[0]).toBeInstanceOf(Downtime);
		});

		test('By invalid token', async () => {
			await expect(updown.getDowntime('a')).rejects.toThrow();
		});
	});


	describe('Get metrics', () => {

		describe('No grouping', () => {
			const FROM = new Date('2019/01/01');
			const TO = new Date();

			test('Token', async () => {
				const metrics = await updown.getMetrics(allChecks[0].token);
				expect(metrics).toBeInstanceOf(Metrics);
			});

			test('Explicit grouping', async () => {
				const metrics = await updown.getMetrics(allChecks[0].token, MetricsGrouping.None);
				expect(metrics).toBeInstanceOf(Metrics);
			});

			test('With from argument', async () => {
				const metrics = await updown.getMetrics(allChecks[0].token, FROM);
				expect(metrics).toBeInstanceOf(Metrics);
			});

			test('With to argument', async () => {
				const metrics = await updown.getMetrics(allChecks[0].token, FROM, TO);
				expect(metrics).toBeInstanceOf(Metrics);
			});

			test('Explicit grouping + from argument', async () => {
				const metrics = await updown.getMetrics(allChecks[0].token, MetricsGrouping.None, FROM);
				expect(metrics).toBeInstanceOf(Metrics);
			});

			test('Explicit grouping + to argument', async () => {
				const metrics = await updown.getMetrics(allChecks[0].token, MetricsGrouping.None, FROM, TO);
				expect(metrics).toBeInstanceOf(Metrics);
			});

			test('Invalid token', async () => {
				await expect(updown.getMetrics('a')).rejects.toThrow();
			});

			test('Invalid date range', async () => {
				await expect(updown.getMetrics('a', new Date(), new Date())).rejects.toThrow();
			});
		});

		test('Group by host', async () => {
			const metrics = await updown.getMetrics(allChecks[0].token, MetricsGrouping.Host);
			expect(Array.isArray(metrics)).toBe(true);
			expect(metrics[0]).toBeInstanceOf(HostGroupedMetrics);
		});

		test('Group by time', async () => {
			const metrics = await updown.getMetrics(allChecks[0].token, MetricsGrouping.Time);
			expect(Array.isArray(metrics)).toBe(true);
			expect(metrics[0]).toBeInstanceOf(TimeGroupedMetrics);
		});
	});
});


describe('Create and modify checks (full access API key)', () => {
	const updown = new Updown(API_KEY);
	let token = '';

	test('Create check', async () => {
		const addCheck = updown.addCheck(`https://www.woubuc.be?t=${ Date.now() }`, 3600);
		await expect(addCheck).resolves.toBeTruthy();

		const check : any = await addCheck;
		expect(check).toHaveProperty('token');

		token = check.token;
	});

	test('Modify check', async () => {
		expect(token).toBeTruthy();

		const modifyCheck = updown.modifyCheck(token, `https://www.woubuc.be?t=${ Date.now() }`);
		await expect(modifyCheck).resolves.toBeTruthy();
	});

	test('Delete check', async () => {
		expect(token).toBeTruthy();

		const deleteCheck = updown.deleteCheck(token);
		await expect(deleteCheck).resolves.toBeTruthy();
	});

});
