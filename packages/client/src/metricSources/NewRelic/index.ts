import * as React from 'react';
import { MetricSourceIntegration } from '../MetricSourceIntegration';
import NewRelicCanaryMetricSetQueryConfig from './NewRelicCanaryMetricSetQueryConfig';
import { MetricModalProps } from '../../components/config/AbstractMetricModal';
import NewRelicMetricModal from './NewRelicMetricModal';
import { string } from 'yup';

export const NEW_RELIC_SERVICE_TYPE: string = 'newrelic';

const schema = {
  select: string()
    .trim()
    .required(),
  q: string().trim()
};

const modalFactory = (props: MetricModalProps) => React.createElement(NewRelicMetricModal, props);

const NewRelic: MetricSourceIntegration<NewRelicCanaryMetricSetQueryConfig> = {
  type: NEW_RELIC_SERVICE_TYPE,
  createMetricsModal: modalFactory,
  canaryMetricSetQueryConfigSchema: schema
};

export default NewRelic;
