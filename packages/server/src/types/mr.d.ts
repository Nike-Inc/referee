declare module 'measured-reporting' {
  import { Counter } from 'measured-core';

  export class SelfReportingMetricsRegistry {
    constructor(reporter: any);
    getOrCreateCounter(name: string, dimensions?: Dimensions, publishingIntervalInSeconds?: number): Counter;
  }

  export interface Dimensions {
    [key: string]: string;
  }
  export class LoggingReporter {
    constructor(args: any);
  }
}
