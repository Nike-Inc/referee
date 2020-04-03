import * as React from 'react';
import { MetricSourceIntegration } from '../MetricSourceIntegration';
import { MetricModalProps } from '../../components/config/AbstractMetricModal';
import PrometheusMetricModal from './PrometheusMetricModal';
import PrometheusCanaryMetricSetQueryConfig from './PrometheusCanaryMetricSetQueryConfig';
import { string } from 'yup';

export const PROMETHEUS_SERVICE_TYPE: string = 'prometheus';

const schema = {
  customInlineTemplate: string().trim()
};

const modalFactory = (props: MetricModalProps) => React.createElement(PrometheusMetricModal, props);

const Prometheus: MetricSourceIntegration<PrometheusCanaryMetricSetQueryConfig> = {
  type: PROMETHEUS_SERVICE_TYPE,
  createMetricsModal: modalFactory,
  canaryMetricSetQueryConfigSchema: schema
};

export default Prometheus;
