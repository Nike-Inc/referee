declare module 'measured-node-metrics' {
  import { SelfReportingMetricsRegistry } from 'measured-reporting';

  export function createExpressMiddleware(metricsRegistry: SelfReportingMetricsRegistry);

  export function createOSMetrics(metricsRegistry: SelfReportingMetricsRegistry);

  export function createProcessMetrics(metricsRegistry: SelfReportingMetricsRegistry);
}
