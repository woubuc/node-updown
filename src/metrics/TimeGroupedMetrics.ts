import Metrics from './Metrics';

/**
 * A {@link Metrics} instance for metrics that are grouped by time. See
 * {@link Updown.getMetrics} for grouping options.
 */
export default class TimeGroupedMetrics extends Metrics {

	/**
	 * The hour of this set of metrics
	 *
	 * As noted in the [official Updown API docs](https://updown.io/api),
	 * statistic are aggregated per hour. For example all checks performed
	 * between 5:00 and 5:59 will be reported at 5:00.
	 *
	 * @remarks This value is parsed from a timestring that doesn't follow
	 *          the ISO8601 standard. Preliminary testing shows that it should
	 *          return an accurate date, however this is not guaranteed because
	 *          date parsing in Javascript is implementation-dependant for
	 *          string formats that don't follow the standard. If you encounter
	 *          any inconsistencies or errors, please [create an issue](https://github.com/woubuc/node-updown).
	 *
	 * @category Time
	 */
	public readonly time : Date;

	/** @internal */
	public constructor(time : string, metricsData : any) {
		super(metricsData);

		// HACK This is a hackish solution to Updown's non-standard datetime
		//      notation in the keys of a time-grouped metrics object
		this.time = new Date(time.replace(' UTC', 'Z'));
	}

}
