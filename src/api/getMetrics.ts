import fetch from 'cross-fetch';

import { GroupedMetrics, Metrics } from '../types/Metrics';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export interface GetMetricsOptions {
	/**
	 * Start time, defaults to 1 month ago
	 */
	from ?: string;

	/**
	 * End time, defaults to now
	 */
	to ?: string;
}

export interface GetGroupedMetricsOptions extends GetMetricsOptions {
	/**
	 * Group data by hour ('time') or monitoring location ('host')
	 */
	group ?: 'time' | 'host';
}


export function getMetrics(
	apiKey : string,
	token : string,
	options ?: GetMetricsOptions,
) : Promise<Metrics>;

export function getMetrics(
	apiKey : string,
	token : string,
	options : GetGroupedMetricsOptions
) : Promise<GroupedMetrics>;

export function getMetrics(
	apiKey : string,
	token : string,
	options : GetGroupedMetricsOptions = {}
) : Promise<Metrics | GroupedMetrics> {
	return fetch(formatUrl(apiKey, ['checks', token, 'metrics'], options)).then(handleResponse);
}
