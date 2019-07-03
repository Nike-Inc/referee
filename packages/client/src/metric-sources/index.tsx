import SignalFx from './signal-fx';
import { CanaryMetricSetQueryConfig } from '../domain/Kayenta';
import { MetricSourceIntegration } from './MetricSourceIntegration';

export const metricSourceIntegrations: KvMap<MetricSourceIntegration<CanaryMetricSetQueryConfig>> = {
  [SignalFx.type]: SignalFx
};

export const metricSourceTypes: string[] = Object.keys(metricSourceIntegrations);
