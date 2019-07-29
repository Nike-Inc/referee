import { CanaryMetricSetQueryConfig, MetricSetPairAttributes } from '../domain/Kayenta';
import { MetricModalProps } from '../components/config/AbstractMetricModal';
import { Schema, ValidationError } from 'yup';

/**
 * This is the interface that all metrics source integrations must implement.
 */
export interface MetricSourceIntegration<T extends CanaryMetricSetQueryConfig> {
  /**
   * This is the type for the metric integration and should be map to a Kayenta service type
   * {@see https://github.com/spinnaker/kayenta/blob/master/kayenta-signalfx/src/main/java/com/netflix/kayenta/canary/providers/metrics/SignalFxCanaryMetricSetQueryConfig.java#L38}
   */
  type: string;

  /**
   * This is a factory method that will produce a new Metric Modal for use in the config editor.
   *
   * @param props - the modal props
   * @returns An instance of a class that extends the {@link AbstractMetricModal} class.
   */
  createMetricsModal: (props: MetricModalProps) => JSX.Element;

  /**
   * @returns an object of Yup Schemas that describe and enforces the shape of the integrations implementation of {@link CanaryMetricSetQueryConfig}
   */
  canaryMetricSetQueryConfigSchema: KvMap<Schema<any>>;

  /**
   * Takes in the current error js map object that maps validation errors to the form keys and can map inner errors to outer level error if desired.
   * This method should mutate the error map to map any custom inner errors to a flat error
   *
   * You only need to implement this if you need to map an error/errors of some sub object to a flat object,
   * such as a set of filters to a generic error message to the filters group.
   *
   * @param errors - the current mutable js object map of form keys to errors for the UI to display
   * @param validationError - The inner yup validation error.
   */
  schemaValidationErrorMapper?: (errors: KvMap<string>, validationError: ValidationError) => void;

  /**
   * Implement this function if the integrations adds the query to the attributes object in the response,
   * so that it can be displayed to the users when they look at reports.
   *
   * @param attributes The attributes from the metric.
   */
  queryMapper?: (
    attributes: MetricSetPairAttributes
  ) => { control: string; experiment: string; displayLanguage?: string };
}
