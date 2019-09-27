import * as React from 'react';
import SignalFxMetricModal from './SignalFxMetricModal';
import SignalFxCanaryMetricSetQueryConfig from './SignalFxCanaryMetricSetQueryConfig';
import {MetricModalProps} from '../../components/config/AbstractMetricModal';
import {array, mixed, object, string, ValidationError} from 'yup';
import {MetricSourceIntegration} from '../MetricSourceIntegration';
import {MetricSetPairAttributes} from '../../domain/Kayenta';
import Optional from "optional-js";
import {safeGet} from "../../util/OptionalUtils";

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

const MILLISECOND_CONVERSION = 1000;
const SEC_TO_MIN_CONVERSION = 60;

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
const signalFxQueryMapper = (
  attributes: MetricSetPairAttributes
): { control: string; experiment: string; displayLanguage?: string } => {
  return {
    control: attributes!.control!['signal-flow-program'],
    experiment: attributes!.experiment!['signal-flow-program'],
    displayLanguage: 'python'
  };
};


// https://github.com/spinnaker/kayenta/blob/master/kayenta-signalfx/src/main/java/com/netflix/kayenta/signalfx/metrics/SignalFxMetricsService.java#L153
const graphValueMapper = (
  attributes: MetricSetPairAttributes
): {
  controlTimeLabels: string[];
  experimentTimeLabels: string[];
} => {

  const controlActualStartTs = Optional.ofNullable(attributes!.control!['actual-start-ts']).orElse("0");
  const experimentActualStartTs = attributes!.experiment!['actual-start-ts'];
  const controlActualEndTs = attributes!.control!['actual-end-ts'];
  const experimentActualEndTs = attributes!.experiment!['actual-end-ts'];
  const controlRequestedStartTs = attributes!.control!['requested-start'];
  const experimentRequestedStartTs = attributes!.experiment!['requested-start'];
  const controlRequestedEndTs = attributes!.control!['requested-end'];
  const experimentRequestedEndTs = attributes!.experiment!['requested-end'];
  const controlDataPointCount = attributes!.control!['actual-data-point-count'];
  const experimentDataPointCount = attributes!.experiment!['actual-data-point-count'];
  const controlRequestedStep = Number(attributes!.control!['requested-step-milli']);

  const controlTimeLabels: string[] = [];
  const experimentTimeLabels: string[] = [];

  const startDate = new Date(Number(controlActualStartTs));
  const endDate = new Date(Number(controlActualEndTs));
  const lifetimeMillis = Number(controlActualEndTs) - Number(controlActualStartTs);
  const scale = Math.round(lifetimeMillis / controlDataPointCount.length);

  console.log("raw: " + controlActualStartTs);
  console.log("valueOf(): " + controlActualStartTs.valueOf());
  console.log("toString(): " + controlActualStartTs.toString());
  console.log("parseInt(): " + parseInt(controlActualStartTs));
  console.log("Number: " + Number(controlActualStartTs));
  console.log("type of: " + typeof  controlActualStartTs);

  for (let i = 0, j = controlActualStartTs; i < controlDataPointCount.length; i++, j += scale) {
    controlTimeLabels.push(j);
  }

  return {controlTimeLabels, experimentTimeLabels};
};

const signalFxMetricModalFactory = (props: MetricModalProps) => React.createElement(SignalFxMetricModal, props);

const SignalFx: MetricSourceIntegration<SignalFxCanaryMetricSetQueryConfig> = {
  type: SIGNAL_FX_SERVICE_TYPE,
  createMetricsModal: signalFxMetricModalFactory,
  canaryMetricSetQueryConfigSchema: signalFxQuerySchema,
  schemaValidationErrorMapper: validationErrorMapper,
  queryMapper: signalFxQueryMapper,
  graphData: graphValueMapper
};

export default SignalFx;
