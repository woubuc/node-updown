import fetch from 'cross-fetch';

import { Check } from '../types/Check';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export function getChecks(
	apiKey : string,
) : Promise<Check[]> {
	return fetch(formatUrl(apiKey, ['checks'])).then(handleResponse);
}
