import { AbstractMetricModal } from '../../components/config/AbstractMetricModal';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { FormGroup } from '../../layout/FormGroup';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import * as React from 'react';
import { boundMethod } from 'autobind-decorator';
import SignalFxCanaryMetricSetQueryConfig from './SignalFxCanaryMetricSetQueryConfig';
import { METRIC_TYPE, SUPPORTED_AGGREGATION_METHODS } from './index';

export default class SignalFxMetricModal extends AbstractMetricModal<SignalFxCanaryMetricSetQueryConfig> {
  getQueryInitialState(): SignalFxCanaryMetricSetQueryConfig {
    return {
      type: METRIC_TYPE,
      metricName: '',
      aggregationMethod: 'mean',
      queryPairs: []
    };
  }

  @boundMethod
  private handleAddNewDimension(): void {
    const newQueryPairs = this.state.metric.query.queryPairs ? this.state.metric.query.queryPairs.slice() : [];
    newQueryPairs.push({ key: '', value: '' });
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          query: Object.assign({}, this.state.metric.query, {
            queryPairs: newQueryPairs
          })
        })
      },
      this.validate
    );
  }

  @boundMethod
  private handleDimensionKeyChange(index: number, value: string): void {
    console.log(this.state);
    if (this.state.metric.query.queryPairs === undefined) {
      return;
    }
    const newQueryPairs = [
      ...this.state.metric.query.queryPairs.slice(0, index),
      Object.assign({}, this.state.metric.query.queryPairs[index], { key: value }),
      ...this.state.metric.query.queryPairs.slice(index + 1)
    ];
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          query: Object.assign({}, this.state.metric.query, {
            queryPairs: newQueryPairs
          })
        })
      },
      this.validate
    );
  }

  @boundMethod
  private handleSignalFxMetricNameChange(value: string): void {
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          query: Object.assign({}, this.state.metric.query, {
            metricName: value
          })
        })
      },
      this.validate
    );
  }

  @boundMethod
  private handleAggregationMethodChange(value: string): void {
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          query: Object.assign({}, this.state.metric.query, {
            aggregationMethod: value
          })
        })
      },
      this.validate
    );
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
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          query: Object.assign({}, this.state.metric.query, {
            queryPairs: newQueryPairs
          })
        })
      },
      this.validate
    );
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
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          query: Object.assign({}, this.state.metric.query, {
            queryPairs: newQueryPairs
          })
        })
      },
      this.validate
    );
  }

  getMetricSourceSpecificJsx(): JSX.Element {
    return (
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
          onChange={e => this.handleSignalFxMetricNameChange(e.target.value)}
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
              this.handleAggregationMethodChange(e.target.value);
            }}
          >
            {SUPPORTED_AGGREGATION_METHODS.map(method => (
              <option key={method}>{method}</option>
            ))}
          </Form.Control>
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
        </FormGroup>
      </div>
    );
  }
}

const KeyValuePair = ({
  handleDelete,
  index,
  onKeyChange,
  onValueChange,
  kvPair
}: {
  handleDelete: (i: number) => void;
  index: number;
  onKeyChange: (i: number, v: any) => void;
  onValueChange: (i: number, v: any) => void;
  kvPair: KvPair;
}): JSX.Element => {
  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>Key: </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        onChange={(e: any) => {
          onKeyChange(index, e.target.value);
        }}
        value={kvPair.key}
      />
      <InputGroup.Prepend>
        <InputGroup.Text>Value: </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        onChange={(e: any) => {
          onValueChange(index, e.target.value);
        }}
        value={kvPair.value}
      />
      <InputGroup.Append>
        <Button variant="outline-danger" onMouseDown={() => handleDelete(index)}>
          Delete
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};
