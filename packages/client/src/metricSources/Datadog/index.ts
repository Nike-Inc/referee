import * as React from 'react';
import { MetricSourceIntegration } from '../MetricSourceIntegration';
import { MetricModalProps } from '../../components/config/AbstractMetricModal';
import DatadogMetricModal from './DatadogMetricModal';
import DatadogCanaryMetricSetQueryConfig from './DatadogCanaryMetricSetQueryConfig';
import { string } from 'yup';

export const DATADOG_SERVICE_TYPE: string = 'datadog';

const schema = {
  customInlineTemplate: string()
      .trim()
      .required()
};

const modalFactory = (props: MetricModalProps) => React.createElement(DatadogMetricModal, props);

const Datadog: MetricSourceIntegration<DatadogCanaryMetricSetQueryConfig> = {
  type: DATADOG_SERVICE_TYPE,
  createMetricsModal: modalFactory,
  canaryMetricSetQueryConfigSchema: schema
};

export default Datadog;
