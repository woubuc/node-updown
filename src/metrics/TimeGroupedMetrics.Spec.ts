import TimeGroupedMetrics from './TimeGroupedMetrics';
import { metricsData } from './Metrics.Spec';

describe('TimeGroupedMetrics initialisation', () => {

	test('Valid data', () => {
		expect(new TimeGroupedMetrics('2019-08-17 12:00:00 UTC', metricsData)).toBeInstanceOf(TimeGroupedMetrics);
	});

});
