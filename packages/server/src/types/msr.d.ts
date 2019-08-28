declare module 'measured-signalfx-reporter' {
  import { Counter } from 'measured-core';

  export class SignalFxSelfReportingMetricsRegistry {
    constructor(reporter: any);
    getOrCreateCounter(name: string, dimensions?: Dimensions, publishingIntervalInSeconds?: number): Counter;
  }

  export interface Dimensions {
    [key: string]: string;
  }
  export class SignalFxMetricsReporter {
    constructor(args: any);
  }
}