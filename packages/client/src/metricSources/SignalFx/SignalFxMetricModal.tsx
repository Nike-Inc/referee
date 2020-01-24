import * as React from 'react';
import { AbstractMetricModal } from '../../components/config/AbstractMetricModal';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { FormGroup } from '../../layout/FormGroup';
import { Button, Form } from 'react-bootstrap';
import { boundMethod } from 'autobind-decorator';
import SignalFxCanaryMetricSetQueryConfig from './SignalFxCanaryMetricSetQueryConfig';
import { SIGNAL_FX_SERVICE_TYPE, SUPPORTED_AGGREGATION_METHODS } from './index';
import KeyValuePair from '../../layout/KeyValuePair';
import { validateCanaryMetricConfig } from '../../validation/configValidators';
import { CanaryMetricConfig } from '../../domain/Kayenta';
import { ValidationResultsWrapper } from '../../domain/Referee';

export default class SignalFxMetricModal extends AbstractMetricModal<SignalFxCanaryMetricSetQueryConfig> {
  validateCanaryMetricConfig(
    existingMetric: CanaryMetricConfig,
    type: string,
    isQueryTypeSimple: boolean
  ): ValidationResultsWrapper {
    return validateCanaryMetricConfig(existingMetric, type, isQueryTypeSimple);
  }

  getQueryInitialState(): SignalFxCanaryMetricSetQueryConfig {
    return {
      type: SIGNAL_FX_SERVICE_TYPE,
      metricName: '',
      aggregationMethod: 'mean',
      queryPairs: []
    };
  }

  @boundMethod
  private handleAddNewDimension(): void {
    const newQueryPairs = this.state.metric.query.queryPairs ? this.state.metric.query.queryPairs.slice() : [];
    newQueryPairs.push({ key: '', value: '' });
    this.updateQueryObject('queryPairs', newQueryPairs);
  }

  @boundMethod
  private handleDimensionKeyChange(index: number, value: string): void {
    if (this.state.metric.query.queryPairs === undefined) {
      return;
    }
    const newQueryPairs = [
      ...this.state.metric.query.queryPairs.slice(0, index),
      Object.assign({}, this.state.metric.query.queryPairs[index], { key: value }),
      ...this.state.metric.query.queryPairs.slice(index + 1)
    ];
    this.updateQueryObject('queryPairs', newQueryPairs);
  }

  @boundMethod
  private handleDimensionValueChange(index: number, value: string): void {
    if (this.state.metric.query.queryPairs === undefined) {
      return;
    }
    const newQueryPairs = [
      ...this.state.metric.query.queryPairs.slice(0, index),
      Object.assign({}, this.state.metric.query.queryPairs[index], { value }),
      ...this.state.metric.query.queryPairs.slice(index + 1)
    ];
    this.updateQueryObject('queryPairs', newQueryPairs);
  }

  @boundMethod
  private handleDimensionDelete(index: number): void {
    if (this.state.metric.query.queryPairs === undefined) {
      return;
    }
    const newQueryPairs = [
      ...this.state.metric.query.queryPairs.slice(0, index),
      ...this.state.metric.query.queryPairs.slice(index + 1)
    ];
    this.updateQueryObject('queryPairs', newQueryPairs);
  }

  getMetricSourceSpecificJsx(): JSX.Element {
    return (
      <div>
        <FormGroup id="query-type" label="Query Type">
          <Form.Check
            onChange={() => {
              this.handleQueryTypeSimple(true);
            }}
            checked={this.state.isQueryTypeSimple}
            inline={true}
            label="Simple"
            type="radio"
            id="query-type-simple"
          />
          <Form.Check
            onChange={() => {
              this.handleQueryTypeInline(false);
            }}
            checked={!this.state.isQueryTypeSimple}
            inline={true}
            label="Inline Template"
            type="radio"
            id="query-type-inline"
          />
          <Form.Text className="text-muted">
            Select <code>Simple</code> for default query behavior and select <code>Inline Template</code> to write your
            own SignalFlow query.
          </Form.Text>
        </FormGroup>
        {this.state.isQueryTypeSimple ? (
          <div>
            <InlineTextGroup
              onBlur={() => {
                this.touch('metricName');
              }}
              touched={this.state.touched.metricName}
              error={this.state.errors['query.metricName']}
              id="signalfx-metric"
              label="SignalFx Metric"
              value={this.state.metric.query.metricName}
              onChange={e => this.updateQueryObject('metricName', e.target.value)}
              placeHolderText="Metric name, as reported to SignalFx. ex: requests.count"
            />
            <FormGroup
              id="aggregation-method"
              label="Aggregation Method"
              touched={this.state.touched.aggregationMethod}
              error={this.state.errors['query.aggregationMethod']}
            >
              <Form.Control
                as="select"
                value={this.state.metric.query.aggregationMethod}
                onChange={(e: any) => {
                  this.updateQueryObject('aggregationMethod', e.target.value);
                }}
              >
                {SUPPORTED_AGGREGATION_METHODS.map(method => (
                  <option key={method}>{method}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-muted">
                The aggregation method to reduce multiple time series from multiple instances
              </Form.Text>
            </FormGroup>
            <FormGroup
              id="kv-pairs"
              label="Dimensions"
              touched={this.state.touched.dimensions}
              error={this.state.errors['dimensions']}
            >
              {this.state.metric.query &&
                this.state.metric.query.queryPairs &&
                this.state.metric.query.queryPairs.map((kvPair, i) => (
                  <KeyValuePair
                    key={i}
                    index={i}
                    kvPair={kvPair}
                    onKeyChange={this.handleDimensionKeyChange}
                    onValueChange={this.handleDimensionValueChange}
                    handleDelete={this.handleDimensionDelete}
                  />
                ))}
              <Button
                onClick={() => {
                  this.handleAddNewDimension();
                }}
                size="sm"
                id="add-dimension-btn"
                variant="outline-dark"
              >
                Add Dimension
              </Button>
              <Form.Text className="text-muted">Add additional filters to drill down to the metrics you want</Form.Text>
            </FormGroup>
          </div>
        ) : (
          <FormGroup
            id="signalfx-metric"
            label="Custom Inline Template"
            touched={this.state.touched.customInlineTemplate}
            error={this.state.errors['query.customInlineTemplate']}
          >
            <Form.Control
              onBlur={() => {
                this.touch('customInlineTemplate');
              }}
              type="text"
              value={this.state.metric.query.customInlineTemplate}
              placeholder="ex:
          data('requests.count', filter=filter('response_code', '5*') and
          filter('server_group', 'server_group_name') and filter('server_region', 'us-west-2'))
          .sum(by=['server_region', 'server_group']).publish()"
              onChange={(e: any) => {
                this.updateQueryObject('customInlineTemplate', e.target.value);
              }}
              as="textarea"
              rows="3"
            />
            <Form.Text className="text-muted">
              For advanced configuration only. See{' '}
              <a
                href="https://developers.signalfx.com/signalflow_analytics/signalflow_overview.html#_computation_behavior"
                target="_blank"
              >
                Using SignalFlow
              </a>{' '}
              for more information.
            </Form.Text>
          </FormGroup>
        )}
      </div>
    );
  }
}
