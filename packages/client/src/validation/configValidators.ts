import { mixed, string, object, boolean, array, number } from 'yup';
import { CanaryConfig, CanaryMetricConfig, SignalFxCanaryMetricSetQueryConfig } from '../domain/Kayenta';
import { ValidationResultsWrapper } from '../domain/Referee';

const canaryMetricConfigSchema = object().shape({
  scopeName: string()
    .trim()
    .required(),
  name: string()
    .trim()
    .required(),
  query: object().shape({
    type: mixed()
      .oneOf(['signalfx'])
      .required(),
    metricName: string()
      .trim()
      .required(),
    aggregationMethod: mixed()
      .oneOf([
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
      ])
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
  }),
  groups: array()
    .of(
      string()
        .min(1)
        .required()
    )
    .required(),
  analysisConfigurations: object()
    .shape({
      canary: object()
        .shape({
          direction: mixed()
            .oneOf(['increase', 'decrease', 'either'])
            .required(),
          nanStrategy: mixed().oneOf(['remove', 'replace']),
          critical: boolean(),
          mustHaveData: boolean()
        })
        .required()
    })
    .required()
});

export const add = (a: number, b: number): number => a + b;

const groupWeightSchema = object()
  .test({
    name: 'FormGroup weight values should be numbers',
    message: 'FormGroup weight values should be numbers',
    test: sut => Object.values(sut).filter(value => typeof value !== 'number').length === 0
  })
  .test({
    name: 'FormGroup weights should add up to 100',
    message: 'FormGroup weights should add up to 100',
    test: sut => {
      try {
        return (Object.values(sut) as number[]).reduce(add) === 100;
      } catch (e) {
        return false;
      }
    }
  })
  .required();

const classifierSchema = object()
  .shape({
    groupWeights: groupWeightSchema
  })
  .required();

const judgeSchema = object().required();

const canaryConfigSchema = object().shape({
  applications: array()
    .of(string().required())
    .min(1),
  id: string(),
  createdTimestamp: number(),
  updatedTimestamp: number(),
  createdTimestampIso: string(),
  updatedTimestampIso: string(),
  name: string().required(),
  description: string().required(),
  configVersion: string(),
  metrics: array()
    .of(canaryMetricConfigSchema)
    .required('metrics is a required property and must contain at least one valid metric configuration'),
  classifier: classifierSchema,
  judge: judgeSchema
});

export const validateCanaryMetricConfig = (
  metric: CanaryMetricConfig<SignalFxCanaryMetricSetQueryConfig>
): ValidationResultsWrapper => {
  let error;
  const errors: KvMap<string> = {};
  try {
    canaryMetricConfigSchema.validateSync(metric, { abortEarly: false, strict: true });
  } catch (e) {
    error = e;
  }

  if (error) {
    if (error.name !== 'ValidationError') {
      throw error;
    }
    const inner: [{ path: string; errors: string[] }] = error.inner;
    if (inner) {
      inner.forEach(validationError => {
        if (/query.queryPairs.*?/.test(validationError.errors.join(', '))) {
          errors['dimensions'] = validationError.errors.join(', ');
        }

        if (/query.queryPairs.*?required/.test(validationError.errors.join(', '))) {
          errors['dimensions'] = 'All key value pairs must be non-empty.';
        }

        if (
          ['analysisConfigurations.canary.critical', 'analysisConfigurations.canary.mustHaveData'].includes(
            validationError.path
          )
        ) {
          errors['criticality'] = errors['criticality']
            ? errors['criticality'] + ', ' + validationError.errors.join(', ')
            : validationError.errors.join(', ');
        }
        errors[validationError.path] = validationError.errors.join(', ');
      });
    }
  }

  return {
    errors: errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const validateCanaryConfig = (canaryConfig: CanaryConfig): ValidationResultsWrapper => {
  let error;
  const errors: KvMap<string> = {};
  try {
    canaryConfigSchema.validateSync(canaryConfig, { abortEarly: false, strict: true });
  } catch (e) {
    error = e;
  }

  if (error) {
    if (error.name !== 'ValidationError') {
      throw error;
    }
    const inner: [{ path: string; errors: string[] }] = error.inner;
    if (inner) {
      inner.forEach(validationError => {
        errors[validationError.path] = validationError.errors.join(', ');
      });
    }
  }

  return {
    errors: errors,
    isValid: Object.keys(errors).length === 0
  };
};
