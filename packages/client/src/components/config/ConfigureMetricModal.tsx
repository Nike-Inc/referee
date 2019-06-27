import * as React from 'react';
import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import TitledSection from '../../layout/titledSection';
import { CanaryMetricConfig, SignalFxCanaryMetricSetQueryConfig } from '../../domain/Kayenta';
import './ConfigureMetricModal.scss';
import { validateCanaryMetricConfig } from '../../validation/configValidators';
import { FormGroup } from '../../layout/FormGroup';
import { boundMethod } from 'autobind-decorator';
import { InlineTextGroup } from '../../layout/InlineTextGroup';

const initialState = {
  errors: {},
  touched: {
    groups: false,
    name: false,
    direction: false,
    criticality: false,
    nanStrategy: false,
    scopeName: false,
    metricName: false,
    aggregationMethod: false,
    dimensions: false
  },
  isValid: true,
  existingMetric: undefined,
  metric: {
    name: '',
    query: {
      type: 'signalfx',
      metricName: '',
      aggregationMethod: 'mean',
      queryPairs: []
    },
    groups: [],
    analysisConfigurations: {
      canary: {
        direction: 'either',
        nanStrategy: 'remove'
      }
    },
    scopeName: 'default'
  }
};

interface ConfigureMetricModelProps {
  existingMetric?: CanaryMetricConfig;
  groups: string[];
  cancel: () => void;
  submit: (metric: CanaryMetricConfig, existingMetric: CanaryMetricConfig | undefined) => void;
}

interface ConfigureMetricModelState {
  errors: KvMap<string>;
  touched: KvMap<boolean>;
  existingMetric?: CanaryMetricConfig<SignalFxCanaryMetricSetQueryConfig>;
  isValid: boolean;
  metric: CanaryMetricConfig<SignalFxCanaryMetricSetQueryConfig>;
}

/**
 * HARD CODED TO WORK WITH SIGNAL FX, TODO Make generic to at least support New Relic Insights
 */
export default class ConfigureMetricModal extends React.Component<
  ConfigureMetricModelProps,
  ConfigureMetricModelState
> {
  constructor(props: ConfigureMetricModelProps) {
    super(props);

    if (props.existingMetric) {
      const vErrors = validateCanaryMetricConfig(props.existingMetric);
      this.state = Object.assign({}, initialState, {
        existingMetric: props.existingMetric,
        metric: props.existingMetric,
        isValid: vErrors.isValid,
        errors: vErrors.errors,
        touched: {
          groups: true,
          name: true,
          direction: true,
          criticality: true,
          nanStrategy: true,
          scopeName: true,
          metricName: true,
          aggregationMethod: true,
          dimensions: true
        }
      });
    } else {
      this.state = initialState;
    }
  }

  private validate(): void {
    this.setState(validateCanaryMetricConfig(this.state.metric));
  }

  private handleMetricNameChange(value: string): void {
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          name: value
        })
      },
      this.validate
    );
  }

  private handleFailOnChange(option: string): void {
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          analysisConfigurations: Object.assign({}, this.state.metric.analysisConfigurations, {
            canary: Object.assign({}, this.state.metric.analysisConfigurations.canary, {
              direction: option
            })
          })
        })
      },
      this.validate
    );
  }

  private handleNanStrategyChange(option: string): void {
    const canaryAnalysisConfigurationCopy = Object.assign({}, this.state.metric.analysisConfigurations.canary);

    if (option === 'default') {
      delete canaryAnalysisConfigurationCopy['nanStrategy'];
    } else {
      canaryAnalysisConfigurationCopy.nanStrategy = option;
    }

    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          analysisConfigurations: Object.assign({}, this.state.metric.analysisConfigurations, {
            canary: canaryAnalysisConfigurationCopy
          })
        })
      },
      this.validate
    );
  }

  private getNanStrategy(): string {
    const strategy = this.state.metric.analysisConfigurations.canary.nanStrategy;
    return strategy ? strategy : 'default';
  }

  private handleGroupSelect(value: any): void {
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          groups: value.map((group: { value: string }) => group.value)
        })
      },
      this.validate
    );
  }

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

  private handleScopeNameChange(value: string): void {
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          scopeName: value
        })
      },
      this.validate
    );
  }

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

  private handleCriticalityChange(criticality: string): void {
    const canaryAnalysisConfigurationCopy = Object.assign({}, this.state.metric.analysisConfigurations.canary);

    if (criticality === 'critical') {
      delete canaryAnalysisConfigurationCopy['mustHaveData'];
      canaryAnalysisConfigurationCopy['critical'] = true;
    }

    if (criticality === 'mustHaveData') {
      delete canaryAnalysisConfigurationCopy['critical'];
      canaryAnalysisConfigurationCopy['mustHaveData'] = true;
    }

    if (criticality === 'normal') {
      delete canaryAnalysisConfigurationCopy['critical'];
      delete canaryAnalysisConfigurationCopy['mustHaveData'];
    }

    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          analysisConfigurations: Object.assign({}, this.state.metric.analysisConfigurations, {
            canary: canaryAnalysisConfigurationCopy
          })
        })
      },
      this.validate
    );
  }

  private getCriticalityFromState(): string {
    if (this.state.metric.analysisConfigurations.canary.critical === true) {
      return 'critical';
    }

    if (this.state.metric.analysisConfigurations.canary.mustHaveData === true) {
      return 'mustHaveData';
    }

    return 'normal';
  }

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

  private touch(id: string): void {
    const touched: KvMap<boolean> = {};
    touched[id] = true;
    this.setState({
      touched: Object.assign({}, this.state.touched, touched)
    });
    this.validate();
  }

  render(): React.ReactNode {
    return (
      <div className="configure-metric-modal">
        <Modal size="lg" centered={false} show={true} id="configure-metric-modal" onHide={() => {}}>
          <Modal.Body>
            <TitledSection title="Configure Metric">
              <Form>
                <FormGroup
                  id="groups"
                  label="Groups"
                  touched={this.state.touched.groups}
                  error={this.state.errors.groups}
                >
                  <CreatableSelect
                    formatCreateLabel={() => {
                      return 'Create new group';
                    }}
                    onBlur={() => {
                      this.touch('groups');
                    }}
                    placeholder="Select an existing group or type to create a new group."
                    noOptionsMessage={() => 'No existing groups, start typing to create a new group.'}
                    isMulti={true}
                    value={this.state.metric.groups.map(g => ({ value: g, label: g }))}
                    onChange={v => {
                      this.handleGroupSelect(v);
                    }}
                    options={this.props.groups.filter(group => group !== 'all').map(g => ({ value: g, label: g }))}
                  />
                </FormGroup>
                <InlineTextGroup
                  onBlur={() => {
                    this.touch('metricGroupName');
                  }}
                  touched={this.state.touched.metricGroupName}
                  error={this.state.errors.metricGroupName}
                  id="name"
                  label="Name"
                  placeHolderText="Metric Name"
                  value={this.state.metric.name}
                  onChange={e => {
                    this.handleMetricNameChange(e.target.value);
                  }}
                />
                <FormGroup
                  id="fail-on"
                  label="Fail On"
                  touched={this.state.touched.direction}
                  error={this.state.errors['analysisConfigurations.canary.direction']}
                >
                  <Form.Check
                    onChange={() => {
                      this.handleFailOnChange('increase');
                    }}
                    checked={this.state.metric.analysisConfigurations.canary.direction === 'increase'}
                    inline={true}
                    label="Increase"
                    type="radio"
                    id="fail-on-increase"
                  />

                  <Form.Check
                    onChange={() => {
                      this.handleFailOnChange('decrease');
                    }}
                    checked={this.state.metric.analysisConfigurations.canary.direction === 'decrease'}
                    inline={true}
                    label="Decrease"
                    type="radio"
                    id="fail-on-decrease"
                  />

                  <Form.Check
                    onChange={() => {
                      this.handleFailOnChange('either');
                    }}
                    checked={this.state.metric.analysisConfigurations.canary.direction === 'either'}
                    inline={true}
                    label="Either"
                    type="radio"
                    id="fail-on-either"
                  />

                  <Form.Text className="text-muted">
                    The direction of the statistical change in that triggers the metric to fail.
                  </Form.Text>
                </FormGroup>

                <FormGroup
                  id="criticality"
                  label="Criticality"
                  touched={this.state.touched.criticality}
                  error={this.state.errors['criticality']}
                >
                  <Form.Check
                    onChange={() => {
                      this.handleCriticalityChange('normal');
                    }}
                    checked={this.getCriticalityFromState() === 'normal'}
                    inline={false}
                    label="Normal"
                    type="radio"
                    id="criticality"
                  />
                  <Form.Text className="text-muted">
                    Removes the metric from the metric group when it has no data and the NaN strategy is 'Remove'.
                  </Form.Text>

                  <Form.Check
                    onChange={() => {
                      this.handleCriticalityChange('critical');
                    }}
                    checked={this.getCriticalityFromState() === 'critical'}
                    inline={false}
                    label="Critical / Must Have Data"
                    type="radio"
                    id="criticality"
                  />
                  <Form.Text className="text-muted">
                    Fails the entire canary when this metric fails. Also fails the entire canary if there are no data
                    points for this metric. Unlocks extra advanced controls.
                  </Form.Text>

                  <Form.Check
                    onChange={() => {
                      this.handleCriticalityChange('mustHaveData');
                    }}
                    checked={this.getCriticalityFromState() === 'mustHaveData'}
                    inline={false}
                    label="Must Have Data"
                    type="radio"
                    id="criticality"
                  />
                  <Form.Text className="text-muted">
                    Fails the individual metric if data is missing and the NaN strategy is 'Remove'.
                  </Form.Text>
                </FormGroup>

                <FormGroup
                  id="nan-strategy"
                  label="NaN Strategy"
                  touched={this.state.touched.nanStrategy}
                  error={this.state.errors['analysisConfigurations.canary.nanStrategy']}
                >
                  <Form.Check
                    onChange={() => {
                      this.handleNanStrategyChange('replace');
                    }}
                    checked={this.getNanStrategy() === 'replace'}
                    inline={true}
                    label="Replace with zero"
                    type="radio"
                    id="nan-strategy-replace"
                  />

                  <Form.Check
                    onChange={() => {
                      this.handleNanStrategyChange('remove');
                    }}
                    checked={['remove', 'default'].includes(this.getNanStrategy())}
                    inline={true}
                    label="Remove"
                    type="radio"
                    id="nan-strategy-remove"
                  />

                  <Form.Text className="text-muted">
                    What to do when the the metric store, doesn't return data for a given interval of time.
                  </Form.Text>
                </FormGroup>

                <InlineTextGroup
                  onBlur={() => {
                    this.touch('scopeName');
                  }}
                  touched={this.state.touched.scopeName}
                  error={this.state.errors.scopeName}
                  id="scope-name"
                  label="Scope Name"
                  value={this.state.metric.scopeName}
                  onChange={e => this.handleScopeNameChange(e.target.value)}
                  disabled={false}
                />

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
                    {[
                      'bottom',
                      'count',
                      'max',
                      'mean',
                      'mean_plus_stddev',
                      'median',
                      'min',
                      'random',
                      'sample_stddev',
                      'sample_variance',
                      'size',
                      'stddev',
                      'sum',
                      'top',
                      'variance'
                    ].map(method => (
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
              </Form>
            </TitledSection>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                this.props.cancel();
              }}
              size="sm"
              variant="outline-warning"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const valErrors = validateCanaryMetricConfig(this.state.metric);
                if (!valErrors.isValid) {
                  this.setState(valErrors);
                  this.setState({
                    touched: {
                      groups: true,
                      name: true,
                      direction: true,
                      criticality: true,
                      nanStrategy: true,
                      scopeName: true,
                      metricName: true,
                      aggregationMethod: true,
                      dimensions: true
                    }
                  });
                  return;
                }
                this.props.submit(this.state.metric, this.state.existingMetric);
              }}
              // disabled={! this.state.isValid}
              size="sm"
              variant="dark"
            >
              Save Metric
            </Button>
          </Modal.Footer>
        </Modal>
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
