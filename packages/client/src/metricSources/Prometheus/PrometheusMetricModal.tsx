import * as React from 'react';
import { AbstractMetricModal } from '../../components/config/AbstractMetricModal';
import { PROMETHEUS_SERVICE_TYPE } from './index';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { validateCanaryMetricConfig } from '../../validation/configValidators';
import { CanaryMetricConfig } from '../../domain/Kayenta';
import { ValidationResultsWrapper } from '../../domain/Referee';
import PrometheusCanaryMetricSetQueryConfig from './PrometheusCanaryMetricSetQueryConfig';

export default class PrometheusMetricModal extends AbstractMetricModal<PrometheusCanaryMetricSetQueryConfig> {
  validateCanaryMetricConfig(existingMetric: CanaryMetricConfig, type: string): ValidationResultsWrapper {
    return validateCanaryMetricConfig(existingMetric, type, false);
  }

  getQueryInitialState(): PrometheusCanaryMetricSetQueryConfig {
    return {
      type: PROMETHEUS_SERVICE_TYPE,
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
          label="Custom Inline Template"
          value={this.state.metric.query.customInlineTemplate}
          onChange={e => this.updateQueryObject('customInlineTemplate', e.target.value)}
          placeHolderText={`PromQL:histogram_quantile(0.5, prometheus_http_response_size_bytes_bucket{instance="localhost:9090",handler="scope"})`}
          subText="Custom template which enables metric-specific PromQL queries."
        />
      </div>
    );
  }
}
