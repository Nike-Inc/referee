import * as React from 'react';
import SignalFxMetricModal from './SignalFxMetricModal';
import SignalFxCanaryMetricSetQueryConfig from './SignalFxCanaryMetricSetQueryConfig';
import { MetricModalProps } from '../../components/config/AbstractMetricModal';
import { array, mixed, object, string, ValidationError } from 'yup';
import { MetricSourceIntegration } from '../MetricSourceIntegration';
import { MetricSetPairAttributes } from '../../domain/Kayenta';

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

// https://github.com/spinnaker/kayenta/blob/master/kayenta-signalfx/src/main/java/com/netflix/kayenta/signalfx/metrics/SignalFxMetricsService.java#L153
const signalFxQueryMapper = (attributes: MetricSetPairAttributes): { control: string; experiment: string } => {
  return {
    control: attributes!.control!['signal-flow-program'],
    experiment: attributes!.experiment!['signal-flow-program']
  };
};

const signalFxMetricModalFactory = (props: MetricModalProps) => React.createElement(SignalFxMetricModal, props);

const SignalFx: MetricSourceIntegration<SignalFxCanaryMetricSetQueryConfig> = {
  type: SIGNAL_FX_SERVICE_TYPE,
  createMetricsModal: signalFxMetricModalFactory,
  canaryMetricSetQueryConfigSchema: signalFxQuerySchema,
  schemaValidationErrorMapper: validationErrorMapper,
  queryMapper: signalFxQueryMapper
};

export default SignalFx;
