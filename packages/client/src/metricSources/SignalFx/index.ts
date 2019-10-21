import * as React from 'react';
import SignalFxMetricModal from './SignalFxMetricModal';
import SignalFxCanaryMetricSetQueryConfig from './SignalFxCanaryMetricSetQueryConfig';
import { MetricModalProps } from '../../components/config/AbstractMetricModal';
import { array, mixed, object, string, ValidationError } from 'yup';
import { MetricSourceIntegration } from '../MetricSourceIntegration';
import { MetricSetPairAttributes } from '../../domain/Kayenta';
import Optional from 'optional-js';

export const SIGNAL_FX_SERVICE_TYPE: string = 'signalfx';

export const SUPPORTED_AGGREGATION_METHODS = [
  'bottom',
  'count',
  'max',
  'mean',
  'mean_plus_stddev',
  'median',
  'min',
  'random',
  'sample_stddev',
  'sample_variance',
  'size',
  'stddev',
  'sum',
  'top',
  'variance'
];

const signalFxQuerySchema = {
  metricName: string()
    .trim()
    .required(),
  aggregationMethod: mixed()
    .oneOf(SUPPORTED_AGGREGATION_METHODS)
    .required(),
  queryPairs: array().of(
    object().shape({
      key: string()
        .trim()
        .required(),
      value: string()
        .trim()
        .required()
    })
  )
};

/**
 * Calculate time labels for metric graphs based on start, end, and number of data points
 */
export const timeLabels = (startTs: number, endTs: number, dataPointCount: number, step: number) => {
  const startDate = new Date(startTs);
  const endDate = new Date(endTs);
  const lifetimeMillis = endDate.getTime() - startDate.getTime();

  let scale: number;
  if (lifetimeMillis > 0 && dataPointCount > 0) {
    scale = Math.round(lifetimeMillis / dataPointCount);
  } else {
    scale = step;
  }

  const timeLabels: number[] = [];
  for (let i = 0, j = startTs; i < dataPointCount; i++, j += scale) {
    timeLabels.push(j);
  }

  return timeLabels;
};

/**
 * We want to map all the query pair errors to the dimensions form group / key
 */
const validationErrorMapper = (errors: KvMap<string>, validationError: ValidationError) => {
  if (/query.queryPairs.*?/.test(validationError.errors.join(', '))) {
    errors['dimensions'] = validationError.errors.join(', ');
  }

  if (/query.queryPairs.*?required/.test(validationError.errors.join(', '))) {
    errors['dimensions'] = 'All key value pairs must be non-empty.';
  }
};

const signalFxQueryMapper = (
  attributes: MetricSetPairAttributes
): { control: string; experiment: string; displayLanguage?: string } => {
  return {
    control: attributes!.control!['signal-flow-program'],
    experiment: attributes!.experiment!['signal-flow-program'],
    displayLanguage: 'python'
  };
};

const graphDataMapper = (
  attributes: MetricSetPairAttributes
): {
  controlTimeLabels: number[];
  experimentTimeLabels: number[];
} => {
  const controlStartTs = Number(
    Optional.ofNullable(attributes!.control!['actual-start-ts']).orElse(attributes!.control!['requested-start'])
  );
  const controlEndTs = Number(
    Optional.ofNullable(attributes!.control!['actual-end-ts']).orElse(attributes!.control!['requested-end'])
  );
  const controlDataPointCount = Number(attributes!.control!['actual-data-point-count']);
  const controlRequestedStep = Number(attributes!.control!['requested-step-milli']);

  const experimentStartTs = Number(
    Optional.ofNullable(attributes!.experiment!['actual-start-ts']).orElse(attributes!.experiment!['requested-start'])
  );
  const experimentEndTs = Number(
    Optional.ofNullable(attributes!.experiment!['actual-end-ts']).orElse(attributes!.experiment!['requested-end'])
  );
  const experimentDataPointCount = Number(attributes!.experiment!['actual-data-point-count']);
  const experimentRequestedStep = Number(attributes!.experiment!['requested-step-milli']);

  const controlTimeLabels: number[] = timeLabels(
    controlStartTs,
    controlEndTs,
    controlDataPointCount,
    controlRequestedStep
  );
  const experimentTimeLabels: number[] = timeLabels(
    experimentStartTs,
    experimentEndTs,
    experimentDataPointCount,
    experimentRequestedStep
  );

  return { controlTimeLabels, experimentTimeLabels };
};

const signalFxMetricModalFactory = (props: MetricModalProps) => React.createElement(SignalFxMetricModal, props);

const SignalFx: MetricSourceIntegration<SignalFxCanaryMetricSetQueryConfig> = {
  type: SIGNAL_FX_SERVICE_TYPE,
  createMetricsModal: signalFxMetricModalFactory,
  canaryMetricSetQueryConfigSchema: signalFxQuerySchema,
  schemaValidationErrorMapper: validationErrorMapper,
  queryMapper: signalFxQueryMapper,
  graphData: graphDataMapper
};

export default SignalFx;
