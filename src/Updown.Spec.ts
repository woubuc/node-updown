/* This test file contains mostly overarching tests (i.e. integration tests)
 * that test the actual API interactions as a user of the library would. See
 * the CONTRIBUTING.md file for more information about how to add your API keys
 * and what data the tests expect in the connected account.
 */

require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports

import Check from './Check';
import Updown from './Updown';
import Downtime from './Downtime';


const API_KEY = process.env.UPDOWN_API_KEY;
if (!API_KEY) throw new Error('Cannot run integration tests without API key');

const READONLY_API_KEY = process.env.UPDOWN_READONLY_API_KEY;
if (!READONLY_API_KEY) throw new Error('Cannot run integration tests without readonly API key');


describe('Methods', () => {
	const ud = new Updown('');

	test('Get checks', () => expect(ud).toHaveProperty('getAllChecks'));

	test('Add check', () => expect(ud).toHaveProperty('addCheck'));
	test('Modify check', () => expect(ud).toHaveProperty('modifyCheck'));
	test('Delete check', () => expect(ud).toHaveProperty('deleteCheck'));

	test('Get downtime', () => expect(ud).toHaveProperty('getDowntime'));
	test('Get metrics', () => expect(ud).toHaveProperty('getMetrics'));
});


describe('Read check data (readonly API key)', () => {
	const ud = new Updown(READONLY_API_KEY);
	let allChecks : Check[] = [];

	test('Get checks', async () => {
		const checks = await ud.getAllChecks();

		expect(Array.isArray(checks)).toBe(true);
		expect(checks.length).toBeGreaterThan(0);
		expect(checks[0]).toBeInstanceOf(Check);

		allChecks = checks;
	});

	test('Get check by token', async () => {
		await expect(ud.getCheck(allChecks[0].token)).resolves.toBeInstanceOf(Check);
	});

	test('Get nonexistent check', async () => {
		await expect(ud.getCheck('a')).rejects.toBeTruthy();
	});

	test('Get downtime by token', async () => {
		const downtime = await ud.getDowntime(allChecks[0].token);

		expect(Array.isArray(downtime)).toBe(true);
		expect(downtime[0]).toBeInstanceOf(Downtime);
	});

	test('Get downtime by check', async () => {
		const downtime = await ud.getDowntime(allChecks[0]);

		expect(Array.isArray(downtime)).toBe(true);
		expect(downtime[0]).toBeInstanceOf(Downtime);
	});

	test('Get downtime by invalid token', async () => {
		await expect(ud.getDowntime('a')).rejects.toThrow();
	});
});


describe('Create and modify checks (full access API key)', () => {
	const ud = new Updown(API_KEY);
	let token = '';

	test('Create check', async () => {
		const addCheck = ud.addCheck(`https://www.woubuc.be?t=${ Date.now() }`, 3600);
		await expect(addCheck).resolves.toBeTruthy();

		const check : any = await addCheck;
		expect(check).toHaveProperty('token');

		token = check.token;
	});

	test('Modify check', async () => {
		expect(token).toBeTruthy();

		const modifyCheck = ud.modifyCheck(token, `https://www.woubuc.be?t=${ Date.now() }`);
		await expect(modifyCheck).resolves.toBeTruthy();
	});

	test('Delete check', async () => {
		expect(token).toBeTruthy();

		const deleteCheck = ud.deleteCheck(token);
		await expect(deleteCheck).resolves.toBeTruthy();
	});

});
