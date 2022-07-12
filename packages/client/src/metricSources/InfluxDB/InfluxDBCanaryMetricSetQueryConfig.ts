import { CanaryMetricSetQueryConfig } from '../../domain/Kayenta';

/**
 * {@see: https://github.com/spinnaker/kayenta/blob/master/kayenta-influxdb/src/main/java/com/netflix/kayenta/canary/providers/metrics/InfluxdbCanaryMetricSetQueryConfig.java}
 */
export default interface InfluxDBCanaryMetricSetQueryConfig extends CanaryMetricSetQueryConfig {
  customInlineTemplate: string;
}
