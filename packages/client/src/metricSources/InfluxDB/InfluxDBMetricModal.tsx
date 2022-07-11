import * as React from 'react';
import { AbstractMetricModal } from '../../components/config/AbstractMetricModal';
import { INFLUXDB_SERVICE_TYPE } from '../InfluxDB/index';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { validateCanaryMetricConfig } from '../../validation/configValidators';
import { CanaryMetricConfig } from '../../domain/Kayenta';
import { ValidationResultsWrapper } from '../../domain/Referee';
import InfluxDBCanaryMetricSetQueryConfig from '../InfluxDB/InfluxDBCanaryMetricSetQueryConfig';

export default class InfluxDBMetricModal extends AbstractMetricModal<InfluxDBCanaryMetricSetQueryConfig> {
  validateCanaryMetricConfig(existingMetric: CanaryMetricConfig, type: string): ValidationResultsWrapper {
    return validateCanaryMetricConfig(existingMetric, type, true);
  }

  getQueryInitialState(): InfluxDBCanaryMetricSetQueryConfig {
    return {
      type: INFLUXDB_SERVICE_TYPE,
      customInlineTemplate: ''
    };
  }

  getMetricSourceSpecificJsx(): JSX.Element {
    return (
      <div>
        <InlineTextGroup
          onBlur={() => {
            this.touch('customInlineTemplate');
          }}
          touched={this.state.touched.customInlineTemplate}
          error={this.state.errors['query.customInlineTemplate']}
          id="customInlineTemplate"
          label="InfluxDB Query"
          value={this.state.metric.query.customInlineTemplate}
          onChange={e => this.updateQueryObject('customInlineTemplate', e.target.value)}
          placeHolderText="SELECT field FROM measurement"
          subText="Custom InfluxDB query"
        />
      </div>
    );
  }
}
