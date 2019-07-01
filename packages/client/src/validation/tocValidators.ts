import { string, object, array } from 'yup';
import { ValidationResultsWrapper } from '../domain/referee';

const tocSchema = object().shape({
  home: string()
    .trim()
    .required(),
  table_of_contents: array()
    .of(
      object().shape({
        directory: string()
          .trim()
          .required(),
        pages: array().of(
          object().shape({
            filename: string()
              .trim()
              .required(),
            display_name: string().trim()
          })
        )
      })
    )
    .required(),
  faq: string().trim()
});

export const validateToc = (toc: any): ValidationResultsWrapper => {
  let error;
  const errors: KvMap<string> = {};
  try {
    tocSchema.validateSync(toc, { abortEarly: false, strict: true });
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
