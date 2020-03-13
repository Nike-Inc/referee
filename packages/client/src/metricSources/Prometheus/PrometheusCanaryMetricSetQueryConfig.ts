import { CanaryMetricSetQueryConfig } from '../../domain/Kayenta';

/**
 * {@see: https://github.com/spinnaker/kayenta/blob/master/kayenta-prometheus/src/main/java/com/netflix/kayenta/canary/providers/metrics/PrometheusCanaryMetricSetQueryConfig.java}
 */
export default interface PrometheusCanaryMetricSetQueryConfig extends CanaryMetricSetQueryConfig {
  customInlineTemplate: string
}