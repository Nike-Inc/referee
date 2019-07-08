import { CanaryMetricSetQueryConfig } from '../../domain/Kayenta';

/**
 * {@see: https://github.com/spinnaker/kayenta/blob/master/kayenta-newrelic-insights/src/main/java/com/netflix/kayenta/canary/providers/metrics/NewRelicCanaryMetricSetQueryConfig.java}
 */
export default interface NewRelicCanaryMetricSetQueryConfig extends CanaryMetricSetQueryConfig {
  select: string;
  q?: string;
}
