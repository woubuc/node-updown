import Updown from './Updown';
import { MOCK_CHECK_ID } from './__mocks__/ApiClient';

jest.mock('./ApiClient');

test('Updown constructor', () => {
	const ud = new Updown('');
	expect(ud).toBeTruthy();
});

test('Get checks', async () => {
	const ud = new Updown('');
	await expect(ud.getChecks()).resolves.toBeTruthy();
});

test('Get downtime', async () => {
	const ud = new Updown('');
	await expect(ud.getDowntime(MOCK_CHECK_ID)).resolves.toBeTruthy();
});

test('Get metrics', async () => {
	const ud = new Updown('');
	await expect(ud.getMetrics(MOCK_CHECK_ID)).resolves.toBeTruthy();
});

test('Add check', async () => {
	const ud = new Updown('');
	await expect(ud.addCheck('', 120)).resolves.toBeTruthy();
});

test('Modify check', async () => {
	const ud = new Updown('');
	await expect(ud.modifyCheck(MOCK_CHECK_ID, '')).resolves.toBeTruthy();
});

test('Delete check', async () => {
	const ud = new Updown('');
	await expect(ud.deleteCheck(MOCK_CHECK_ID)).resolves.toBeTruthy();
});
