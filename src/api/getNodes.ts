import fetch from 'cross-fetch';

import { Nodes } from '../types/Node';

import { formatUrl } from '../utils/url';
import { handleResponse } from '../utils/handleResponse';


export function getNodes() : Promise<Nodes> {
	return fetch(formatUrl('', ['nodes'])).then(handleResponse);
}

export function getIpv4Nodes() : Promise<string[]> {
	return fetch(formatUrl('', ['nodes', 'ipv4'])).then(handleResponse);
}

export function getIpv6Nodes() : Promise<string[]> {
	return fetch(formatUrl('', ['nodes', 'ipv6'])).then(handleResponse);
}
