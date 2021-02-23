import * as React from 'react';
import { AbstractMetricModal } from '../../components/config/AbstractMetricModal';
import { DATADOG_SERVICE_TYPE } from './index';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { validateCanaryMetricConfig } from '../../validation/configValidators';
import { CanaryMetricConfig } from '../../domain/Kayenta';
import { ValidationResultsWrapper } from '../../domain/Referee';
import DatadogCanaryMetricSetQueryConfig from './DatadogCanaryMetricSetQueryConfig';

export default class DatadogMetricModal extends AbstractMetricModal<DatadogCanaryMetricSetQueryConfig> {
  validateCanaryMetricConfig(existingMetric: CanaryMetricConfig, type: string): ValidationResultsWrapper {
    return validateCanaryMetricConfig(existingMetric, type, true);
  }

  getQueryInitialState(): DatadogCanaryMetricSetQueryConfig {
    return {
        type: DATADOG_SERVICE_TYPE,
        customInlineTemplate: '',
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
          label="Datadog Query"
          value={this.state.metric.query.customInlineTemplate}
          onChange={e => this.updateQueryObject('customInlineTemplate', e.target.value)}
          placeHolderText="sum:requests.error{${scope}}.as_count() / sum:requests.total{${scope}}.as_count()"
          subText="Custom datadog query; use ${scope} as a placeholder for your tags."
        />
      </div>
    );
  }
}
