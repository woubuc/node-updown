import HostGroupedMetrics from './HostGroupedMetrics';
import { metricsData } from './Metrics.Spec';

describe('HostGroupedMetrics initialisation', () => {

	test('Valid data', () => {
		expect(new HostGroupedMetrics('tok', {
			...metricsData,
			host: {
				ip: '45.76.104.117',
				city: 'Tokyo',
				country: 'Japan',
				country_code: 'jp'
			}
		})).toBeInstanceOf(HostGroupedMetrics);
	});

});
