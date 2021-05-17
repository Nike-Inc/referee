import { CanaryMetricSetQueryConfig } from '../../domain/Kayenta';

/**
 * {@see: https://github.com/spinnaker/kayenta/blob/master/kayenta-datadog/src/main/java/com/netflix/kayenta/canary/providers/metrics/DatadogCanaryMetricSetQueryConfig.java}
 */
export default interface DatadogCanaryMetricSetQueryConfig extends CanaryMetricSetQueryConfig {
  customInlineTemplate: string;
}
