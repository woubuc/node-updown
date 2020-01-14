export interface Metrics {
	apdex : number;

	requests : {
		samples : number;
		failures : number;
		satisfied : number;
		tolerated : number;
		by_response_time : {
			under125 : number;
			under250 : number;
			under500 : number;
			under1000 : number;
			under2000 : number;
			under4000 : number;
		};
	};

	timings : {
		redirect : number;
		namelookup : number;
		connection : number;
		handshake : number;
		response : number;
		total : number;
	};
}

export type GroupedMetrics = Record<string, Metrics>;
