import Timings from './Timings';
import Requests from './Requests';
import Validator from '../util/Validator';
import ResponseTimes from './ResponseTimes';

export default class Metrics {

	/**
	 * The average apdex score for these metrics
	 */
	public readonly apdex : number;

	/**
	 * The average request timings, for each part of a request
	 */
	public readonly timings : Timings;

	/**
	 * The total amount of requests made for these metrics
	 */
	public readonly requests : Requests;

	/** @internal */
	public constructor(metricsData : any) {
		const v = new Validator(metricsData);

		this.apdex = v.getNumber('apdex');

		this.timings = validateTimings(v.getObject('timings'));
		this.requests = validateRequests(v.getObject('requests'));
	}

}

/** @internal */
function validateTimings(timingsData : any) : Timings {
	const v = new Validator(timingsData);

	return {
		redirect: v.getNumber('redirect'),
		nameLookup: v.getNumber('namelookup'),
		connection: v.getNumber('connection'),
		handshake: v.getNumber('handshake'),
		response: v.getNumber('response'),
		total: v.getNumber('total'),
	};
}

/** @internal */
function validateRequests(requestsData : any) : Requests {
	const v = new Validator(requestsData);

	return {
		samples: v.getNumber('samples'),
		failures: v.getNumber('failures'),
		satisfied: v.getNumber('satisfied'),
		tolerated: v.getNumber('tolerated'),
		byResponseTimes: validateByResponseTimes(v.getObject('by_response_time')),
	}
}

/** @internal */
function validateByResponseTimes(responseTimeData : any) : ResponseTimes {
	const v = new Validator(responseTimeData);

	return {
		under125: v.getNumber('under125'),
		under250: v.getNumber('under250'),
		under500: v.getNumber('under500'),
		under1000: v.getNumber('under1000'),
		under2000: v.getNumber('under2000'),
		under4000: v.getNumber('under4000'),
	};
}
