require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports

import Updown from './Updown';

const API_KEY = process.env.UPDOWN_API_KEY;
if (!API_KEY) throw new Error('Cannot run integration tests without API key');

test('Invalid API key', async () => {
	const ud = new Updown('');
	await expect(ud.getChecks()).rejects.toThrow();
});

test('Get checks', async () => {
	const ud = new Updown(API_KEY);
	await expect(ud.getChecks()).resolves.toBeTruthy();
});
