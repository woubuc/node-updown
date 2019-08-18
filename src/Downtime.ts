import Validator from './util/Validator';

export default class Downtime {

	public readonly checkToken : string;

	public readonly error : string;
	public readonly started : Date;
	public readonly ended ?: Date;
	public readonly duration ?: number;

	/** @internal */
	public constructor(checkToken : string, downtimeData : any) {
		this.checkToken = checkToken;

		const v = new Validator(downtimeData);

		this.error = v.getString('error');
		this.started = v.getDate('started_at');
		this.ended = v.getDate('ended_at', true);
		this.duration = v.getNumber('duration', true);
	}
}
