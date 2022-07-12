import * as React from 'react';
import { MetricSourceIntegration } from '../MetricSourceIntegration';
import { MetricModalProps } from '../../components/config/AbstractMetricModal';
import InfluxDBMetricModal from './InfluxDBMetricModal';
import InfluxDBCanaryMetricSetQueryConfig from './InfluxDBCanaryMetricSetQueryConfig';
import { string } from 'yup';

export const INFLUXDB_SERVICE_TYPE: string = 'influxdb';

const schema = {
  customInlineTemplate: string()
    .trim()
};

const modalFactory = (props: MetricModalProps) => React.createElement(InfluxDBMetricModal, props);

const InfluxDB: MetricSourceIntegration<InfluxDBCanaryMetricSetQueryConfig> = {
  type: INFLUXDB_SERVICE_TYPE,
  createMetricsModal: modalFactory,
  canaryMetricSetQueryConfigSchema: schema
};

export default InfluxDB;
