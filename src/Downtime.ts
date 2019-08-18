import Validator from './util/Validator';

/**
 * Represents a single downtime instance for a check
 *
 * @remarks The naming remarks in {@link Check} apply here as well
 */
export default class Downtime {

	/**
	 * The token of the corresponding check
	 */
	public readonly checkToken : string;

	/**
	 * The error that caused the downtime
	 */
	public readonly error : string;

	/**
	 * When the downtime started
	 *
	 * @remarks Corresponds to the `started_at` field of the API
	 */
	public readonly started : Date;

	/**
	 * When the downtime ended
	 *
	 * Not set if the downtime is still ongoing
	 *
	 * @remarks Corresponds to the `ended_at` field of the API
	 */
	public readonly ended ?: Date;

	/**
	 * The duration of the downtime
	 *
	 * Not set if the downtime is still ongoing
	 */
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
