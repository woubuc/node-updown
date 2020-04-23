import fetch from 'cross-fetch';

import { APIKey } from '../types';
import { GroupedMetrics, Metrics, MetricsGroup } from '../types/Metrics';
import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export type GetMetricsOptions<Group extends MetricsGroup> = {
	/**
	 * Start time, defaults to 1 month ago
	 */
	from ?: string;

	/**
	 * End time, defaults to now
	 */
	to ?: string;

	/**
	 * Group data by hour ('time') or monitoring location ('host')
	 */
	group ?: Group;
};

export const getMetrics = async <
	Group extends MetricsGroup,
	Options extends GetMetricsOptions<Group>
	>(
	apiKey : APIKey,
	token : string,
	options ?: Options
) : Promise<Options extends undefined ? Metrics : GroupedMetrics<Group>> =>
	fetch(formatUrl(apiKey, ['checks', token, 'metrics'], options)).then(
		handleResponse
	);
