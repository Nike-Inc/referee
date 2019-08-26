import { string, object, number, array } from 'yup';
import { CanaryExecutionRequest } from '../domain/Kayenta';
import { ValidationResultsWrapper } from '../domain/Referee';

export const DUPLICATE_SCOPE_KEYS_ERROR_MESSAGE = 'All extended query scope parameters keys must be unique.';
export const ALL_KVS_MUST_BE_NON_EMPTY_STRINGS =
  'All extended query scope param keys and values must be non-empty trimmed strings';

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
    name: 'Start should be an ISO 8061 time stamp',
    message: 'Start should be an ISO 8061 time stamp',
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
    name: 'End should be an ISO 8061 time stamp',
    message: 'End should be an ISO 8061 time stamp',
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

const extendedScopeParametersSchema = array()
  .of(
    object().shape({
      key: string()
        .trim(ALL_KVS_MUST_BE_NON_EMPTY_STRINGS)
        .required(ALL_KVS_MUST_BE_NON_EMPTY_STRINGS),
      value: string()
        .trim(ALL_KVS_MUST_BE_NON_EMPTY_STRINGS)
        .required(ALL_KVS_MUST_BE_NON_EMPTY_STRINGS)
    })
  )
  .test({
    name: 'test that all kv pair keys are unique so that we can convert the list to a map',
    message: DUPLICATE_SCOPE_KEYS_ERROR_MESSAGE,
    test: (sut: KvPair[]) => {
      const keyToCountMap = sut.reduce(
        (accumulator: KvMap<number>, currentKvPair) => {
          // Reduce the list of pairs to a key to count map
          accumulator[currentKvPair.key] = accumulator[currentKvPair.key] ? accumulator[currentKvPair.key] + 1 : 1;
          return accumulator;
        },
        {} as KvMap<number>
      );

      // Return false if any keys have have a count > 1
      return !Object.keys(keyToCountMap).find(key => keyToCountMap[key] > 1);
    }
  });

export const validateExtendedScopeParams = (type: string, params: KvPair[]): ValidationResultsWrapper => {
  let error;
  const errors: KvMap<string> = {};
  try {
    extendedScopeParametersSchema.validateSync(params, { abortEarly: false, strict: true });
  } catch (e) {
    error = e;
  }

  if (error) {
    if (error.name !== 'ValidationError') {
      throw error;
    }
    // Flatten all errors for extended scope parameters into a single error message for the UI.
    errors[`${type}-extended-scope-params`] = Array.from(
      error.errors.reduce((uniqueErrors: Set<string>, error: string) => {
        uniqueErrors.add(error);
        return uniqueErrors;
      }, new Set())
    ).join(', ');
  }

  return {
    errors: errors,
    isValid: Object.keys(errors).length === 0
  };
};

const additionalParametersSchema = object().shape({
  application: string().trim(),
  metricsAccountName: string()
    .trim()
    .required('Metrics account is a required property'),
  storageAccountName: string()
    .trim()
    .required('Storage account is a required property')
});

export const validateAdditionalParameters = (
  application: string,
  metricsAccountName: string,
  storageAccountName: string
): ValidationResultsWrapper => {
  let error;
  const errors: KvMap<string> = {};
  const additionalParameters = {
    application: application,
    metricsAccountName: metricsAccountName,
    storageAccountName: storageAccountName
  };

  try {
    additionalParametersSchema.validateSync(additionalParameters, { abortEarly: false, strict: true });
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
