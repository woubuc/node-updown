import { CheckLocation } from './Check';

export type Nodes = Record<CheckLocation, Node>;

export interface Node {
	ip : string;
	ip6 : string;
	city : string;
	country : string;
	country_code : string;
	lat : number;
	lng : number;
}
