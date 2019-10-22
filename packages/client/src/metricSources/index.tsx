import { CanaryMetricSetQueryConfig } from '../domain/Kayenta';
import { MetricSourceIntegration } from './MetricSourceIntegration';
import NewRelic from './NewRelic';
import SignalFx from './SignalFx';

/**
 * The list of enabled metric source integrations
 */
// prettier-ignore
const enabledMetricSources: MetricSourceIntegration<CanaryMetricSetQueryConfig>[] = [
  NewRelic,
  SignalFx
];

/**
 * A Map of metric source integration types to metric source integrations
 */
// prettier-ignore
export const metricSourceIntegrations: () => KvMap<MetricSourceIntegration<CanaryMetricSetQueryConfig>> = () => {
  return enabledMetricSources.reduce((result, metricsSource) => {
      result[metricsSource.type] = metricsSource;
      return result;
    },
    {} as KvMap<MetricSourceIntegration<CanaryMetricSetQueryConfig>>
  );
};

/**
 * The list of metric source types
 */
export const metricSourceTypes: () => string[] = () => {
  return enabledMetricSources.map(
    metricSourceIntegration => metricSourceIntegration.type
  );
};
