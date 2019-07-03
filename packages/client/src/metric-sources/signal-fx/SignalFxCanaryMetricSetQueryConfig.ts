import { CanaryMetricSetQueryConfig } from '../../domain/Kayenta';

export default interface SignalFxCanaryMetricSetQueryConfig extends CanaryMetricSetQueryConfig {
  metricName: string;
  aggregationMethod: string;
  queryPairs?: KvPair[];
}
