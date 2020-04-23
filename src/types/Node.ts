export type Location = 'lan' | 'mia' | 'bhs' | 'rbx' | 'fra' | 'sin' | 'tok' | 'syd';

export type Nodes = Record<Location, Node>;

export interface Node {
	ip : string;
	ip6 : string;
	city : string;
	country : string;
	country_code : string;
	lat : number;
	lng : number;
}
