/**
 * Everything in this file is sourced from the [measured readme]{@link https://github.com/felixge/node-measured}
 */
declare module 'measured-core' {
  /**
   * Values that can be read instantly.
   *
   * Gauges take a function as parameter which needs to return their current value.
   */
  export class Gauge {
    constructor(callBack: () => number);

    /**
     * Gauges directly return their currently value.
     */
    public toJSON(): JSON;
  }

  /**
   * Things that increment or decrement.
   */
  export class Counter implements IMetric {
    /**
     * @param {CounterProperties} properties
     */
    constructor(properties?: CounterProperties);

    /**
     * Increment the counter by n. Defaults to 1.
     * @param {number} n
     */
    public inc(n?: number): void;

    /**
     * Decrement the counter by n. Defaults to 1.
     * @param {number} n
     */
    public dec(n?: number): void;

    /**
     * Resets the counter back to count Defaults to 0.
     * @param {number} count
     */
    public reset(count?: number): void;

    /**
     * Counters directly return their currently value.
     */
    public toJSON(): JSON;
  }

  /**
   * Properties to create a [Counter]{@see Counter} with.
   */
  export class CounterProperties {
    /**
     * count An initial count for the counter. Defaults to 0.
     */
    public count: number;
  }

  /**
   * Things that are measured as events / interval. Example:
   */
  export class Meter implements IMetric {
    /**
     * rateUnit The rate unit. Defaults to 1000 (1 sec).
     * tickInterval The interval in which the averages are updated. Defaults to 5000 (5 sec).
     * @param {MeterProperties} properties
     */
    constructor(properties?: MeterProperties);

    /**
     * Register n events as having just occured. Defaults to 1.
     * @param {number} n
     */
    public mark(n: number);

    /**
     * Resets all values. Meters initialized with custom options will be reset to the default settings (patch welcome).
     */
    public reset(): void;

    /**
     * Unrefs the backing timer. The meter will not keep the event loop alive. Idempotent.
     */
    public unref(): void;

    /**
     * Refs the backing timer again. Idempotent.
     */
    public ref(): void;

    /**
     * toJSON Output
     *
     * <li> mean: The average rate since the meter was started.
     * <li> count: The total of all values added to the meter.
     * <li> currentRate: The rate of the meter since the last toJSON() call.
     * <li> 1MinuteRate: The rate of the meter biased towards the last 1 minute.
     * <li> 5MinuteRate: The rate of the meter biased towards the last 5 minutes.
     * <li> 15MinuteRate: The rate of the meter biased towards the last 15 minutes.
     *
     * @return {JSON}
     */
    public toJSON(): JSON;
  }

  /**
   * Properties to create a [Meter]{@see Meter} with.
   */
  export class MeterProperties {
    /**
     * The rate unit. Defaults to 1000 (1 sec).
     */
    public rateUnit: number;

    /**
     * The interval in which the averages are updated. Defaults to 5000 (5 sec).
     */
    public tickInterval: number;
  }

  /**
   * Keeps a resevoir of statistically relevant values biased towards the last 5 minutes to explore their distribution.
   *
   * {@link https://github.com/felixge/node-measured#histogram}
   */
  export class Histogram implements IMetric {
    /**
     * @param {HistogramProperties} properties
     */
    constructor(properties?: HistogramProperties);

    /**
     * Pushes value into the sample. timestamp defaults to Date.now().
     * @param {number} value
     * @param {Date} timestamp
     */
    public update(value: number, timestamp?: Date): void;

    /**
     * Whether the histogram contains values.
     * @return {boolean}
     */
    public hasValues(): boolean;

    /**
     * Resets all values. Histograms initialized with custom options will be reset to the default settings (patch welcome).
     */
    public reset(): void;

    /**
     * toJSON output:
     *
     * <li> min: The lowest observed value.
     * <li> max: The highest observed value.
     * <li> sum: The sum of all observed values.
     * <li> variance: The variance of all observed values.
     * <li> mean: The average of all observed values.
     * <li> stddev: The stddev of all observed values.
     * <li> count: The number of observed values.
     * <li> median: 50% of all values in the resevoir are at or below this value.
     * <li> p75: See median, 75% percentile.
     * <li> p95: See median, 95% percentile.
     * <li> p99: See median, 99% percentile.
     * <li> p999: See median, 99.9% percentile.
     *
     * @return {JSON}
     */
    public toJSON(): JSON;
  }

  /**
   * Properties to create a [Histogram]{@see Histogram} with.
   */
  export class HistogramProperties {
    /**
     * The sample resevoir to use. Defaults to an ExponentiallyDecayingSample.
     */
    public sample: object;
  }

  /**
   * Timers are a combination of Meters and Histograms. They measure the rate as well as distribution of scalar events.
   * Since they are frequently used for tracking how long certain things take, they expose an API for that:
   *
   * {@see https://github.com/felixge/node-measured#timers}
   */
  export class Timer implements IMetric {
    /**
     * @param {TimerProperties} properties
     */
    constructor(properties?: TimerProperties);

    /**
     * @return {StopWatch} Returns a Stopwatch that has been started.
     */
    public start(): StopWatch;

    /**
     *  Updates the internal histogram with value and marks one event on the internal meter.
     * @param {number} value
     */
    public update(value: number);

    /**
     * Resets all values. Timers initialized with custom options will be reset to the default settings.
     */
    public reset(): void;

    /**
     * Unrefs the backing timer. The meter will not keep the event loop alive. Idempotent.
     */
    public unref(): void;

    /**
     * Refs the backing timer again. Idempotent.
     */
    public ref(): void;

    /**
     * toJSON output:
     *
     * <li> meter: {@see Meter} toJSON output docs above.
     * <li> histogram: {@see Histogram} toJSON output docs above.
     *
     * @return {JSON}
     */
    public toJSON(): JSON;
  }

  /**
   * Properties to create a [Timer]{@see Timer} with.
   */
  export class TimerProperties {
    /**
     * The internal meter to use. Defaults to a new Meter.
     * {@see Meter}
     */
    public meter: Meter;

    /**
     * The internal histogram to use. Defaults to a new Histogram.
     * {@see Histogram}
     */
    public histogram: Histogram;
  }

  /**
   * Created by the Timer Metric when start() is called
   */
  export class StopWatch {
    /**
     * Called to mark the end of the timer task
     * @return {number} the total execution time
     */
    public end(): number;
  }

  /**
   * Creates a collection that can create and keep track of metrics
   */
  export const createCollection: (name?: string) => Collection;

  /**
   * Collection class that keeps track of Metrics that it has created
   *
   * @param {string} name Optional name to use for the collection
   */
  export class Collection {
    constructor(name: string);

    /**
     * {@see https://github.com/felixge/node-measured/blob/master/lib/Collection.js}
     * @return {JSON} JSON object with all the metrics in the collection
     */
    public toJSON(): JSON;

    /**
     * Iterates through the metrics in the collection and
     * calls end() in the metric, if the metric has an end() method.
     */
    public end(): void;

    /**
     * Creates a new Gauge and registers it with the metrics collection
     *
     * {@see Gauge}
     *
     * @param {() => number} callBack
     * @return {Gauge}
     */
    public guage(callBack: () => number): Gauge;

    /**
     * Creates a new Counter and registers it with the metrics collection
     *
     * {@see Counter}
     *
     * @param {CounterProperties} properties optional counter properties.
     * @return {Counter}
     */
    public counter(properties?: CounterProperties): Counter;

    /**
     * Creates a new Meter and registers it with the metrics collection
     *
     * {@see Meter}
     *
     * @param {MeterProperties} properties
     * @return {Meter}
     */
    public meter(properties?: MeterProperties): Meter;

    /**
     * Creates a new Histogram and registers it with the metrics collection
     *
     * {@see Histogram}
     *
     * @param {HistogramProperties} properties
     * @return {Histogram}
     */
    public histogram(properties?: HistogramProperties): Histogram;

    /**
     * Creates a new Timer and registers it with the metrics collection
     *
     * {@see Timer}
     *
     * @param {TimerProperties} properties
     * @return {Timer}
     */
    public timer(properties?: TimerProperties): Timer;
  }

  /**
   * All metrics implement toJSON()
   */
  export interface IMetric {
    /**
     * See the toJSON metric of the implementing classes
     * @return {JSON}
     */
    toJSON(): JSON;
  }
}
