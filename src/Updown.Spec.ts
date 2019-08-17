import Check from './Check';

require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports

import Updown from './Updown';

const API_KEY = process.env.UPDOWN_API_KEY;
if (!API_KEY) throw new Error('Cannot run integration tests without API key');

const READONLY_API_KEY = process.env.UPDOWN_READONLY_API_KEY;
if (!READONLY_API_KEY) throw new Error('Cannot run integration tests without readonly API key');


describe('Methods', () => {
	const ud = new Updown('');

	test('Get checks', () => expect(ud).toHaveProperty('getChecks'));

	test('Add check', () => expect(ud).toHaveProperty('addCheck'));
	test('Modify check', () => expect(ud).toHaveProperty('modifyCheck'));
	test('Delete check', () => expect(ud).toHaveProperty('deleteCheck'));

	test('Get downtime', () => expect(ud).toHaveProperty('getDowntime'));
	test('Get metrics', () => expect(ud).toHaveProperty('getMetrics'));
});


describe('Readonly', () => {
	const ud = new Updown(READONLY_API_KEY);
	let allChecks : Check[] = [];

	test('Get checks', async () => {
		const checks = await ud.getChecks();

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
});


describe('Modify checks', () => {
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
