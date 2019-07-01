import { string, object, number } from 'yup';
import { CanaryExecutionRequest } from '../domain/kayenta';
import { ValidationResultsWrapper } from '../domain/referee';

const canaryScopeSchema = object().shape({
  scope: string()
    .trim()
    .required('Name of scope is a required property'),
  location: string()
    .trim()
    .required('Location is a required property'),
  step: number().test({
    name: 'Step should be greater than 0',
    message: 'Step should be greater than 0',
    test: sut => sut > 0
  }),
  start: string().test({
    name: 'Start should be a time stamp',
    message: 'Start should be a time stamp',
    test: sut => {
      const date = new Date(sut);
      try {
        date.toISOString();
        return true;
      } catch (e) {
        return false;
      }
    }
  }),
  end: string().test({
    name: 'End should be a time stamp',
    message: 'End should be a time stamp',
    test: sut => {
      const date = new Date(sut);
      try {
        date.toISOString();
        return true;
      } catch (e) {
        return false;
      }
    }
  }),
  extendedScopeParams: object()
});

const canaryExecutionSchema = object().shape({
  scopes: object().shape({
    default: object().shape({
      controlScope: canaryScopeSchema,
      experimentScope: canaryScopeSchema
    })
  }),
  thresholds: object().shape({
    marginal: number().test({
      name: 'Marginal threshold should be less than 100',
      message: 'Marginal threshold should be less than 100',
      test: sut => sut <= 100
    }),
    pass: number().test({
      name: 'Pass threshold should be less than 100',
      message: 'Pass threshold should be less than 100',
      test: sut => sut <= 100
    })
  })
});

export const validateCanaryExecution = (
  canaryExecutionRequestObject: CanaryExecutionRequest
): ValidationResultsWrapper => {
  let error;
  const errors: KvMap<string> = {};
  try {
    canaryExecutionSchema.validateSync(canaryExecutionRequestObject, { abortEarly: false, strict: true });
  } catch (e) {
    error = e;
  }

  if (error) {
    if (error.metricGroupName !== 'ValidationError') {
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
