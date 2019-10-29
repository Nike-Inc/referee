import { CanaryMetricSetQueryConfig, MetricSetPairAttributes } from '../domain/Kayenta';
import { MetricSourceIntegration } from './MetricSourceIntegration';
import NewRelic from './NewRelic';
import SignalFx from './SignalFx';

const MIN_TO_MS_CONVERSION: number = 60000;
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
  return enabledMetricSources.map(metricSourceIntegration => metricSourceIntegration.type);
};

/**
 * Calculates time labels for metric graphs based on start, length of canary, and number of data points
 */
export const defaultGraphDataMapper = (
  lifetime: number,
  dataPointCount: number,
  startTimeMillis: number,
  stepMillis: number
): {
  controlTimeLabels: number[];
  experimentTimeLabels?: number[];
} => {
  let controlTimeLabels: number[] = [];
  let scale: number;
  if (lifetime > 0 && dataPointCount > 0) {
    const lifetimeMillis: number = lifetime * MIN_TO_MS_CONVERSION;
    scale = Math.round(lifetimeMillis / dataPointCount);
  } else {
    scale = stepMillis;
  }
  for (let i = 0, j = startTimeMillis; i < dataPointCount; i++, j += scale) {
    controlTimeLabels.push(j);
  }
  return { controlTimeLabels };
};
