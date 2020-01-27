import * as React from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import TitledSection from '../../layout/titledSection';
import { CanaryMetricConfig, CanaryMetricSetQueryConfig } from '../../domain/Kayenta';
import './AbstractMetricModal.scss';
import { FormGroup } from '../../layout/FormGroup';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { boundMethod } from 'autobind-decorator';
import { ValidationResultsWrapper } from '../../domain/Referee';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';
import { faChevronCircleRight, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { safeGet } from '../../util/OptionalUtils';

export const SUPPORTED_OUTLIER_STRATEGIES = ['keep', 'remove'];

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
    dimensions: false,
    outlierStrategy: false
  },
  isValid: true,
  existingMetric: undefined,
  isQueryTypeSimple: true,
  showAdvancedConfiguration: false
};

const initialMetricState = {
  name: '',
  groups: [],
  analysisConfigurations: {
    canary: {
      direction: 'either',
      nanStrategy: 'remove'
    }
  },
  scopeName: 'default'
};

export interface MetricModalProps {
  type: string;
  existingMetric?: CanaryMetricConfig;
  groups: string[];
  cancel: () => void;
  submit: (metric: CanaryMetricConfig, existingMetric: CanaryMetricConfig | undefined) => void;
  isQueryTypeSimple: boolean;
}

export interface MetricModalState<T extends CanaryMetricSetQueryConfig> {
  errors: KvMap<string>;
  touched: KvMap<boolean>;
  existingMetric?: CanaryMetricConfig<T>;
  isValid: boolean;
  metric: CanaryMetricConfig<T>;
  showAdvancedConfiguration: boolean;
  isQueryTypeSimple: boolean;
}

export abstract class AbstractMetricModal<T extends CanaryMetricSetQueryConfig> extends React.Component<
  MetricModalProps,
  MetricModalState<T>
> {
  public constructor(props: MetricModalProps) {
    super(props);

    if (props.existingMetric) {
      const validationErrors = this.validateCanaryMetricConfig(
        props.existingMetric,
        props.type,
        props.isQueryTypeSimple
      );
      this.state = Object.assign({}, this.getInitialState(), {
        existingMetric: props.existingMetric,
        metric: props.existingMetric,
        isValid: validationErrors.isValid,
        isQueryTypeSimple: props.isQueryTypeSimple,
        errors: validationErrors.errors,
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
      this.state = this.getInitialState();
    }
  }

  abstract validateCanaryMetricConfig(
    existingMetric: CanaryMetricConfig,
    type: string,
    isQueryTypeSimple: boolean
  ): ValidationResultsWrapper;

  private getInitialState(): MetricModalState<T> {
    return Object.assign({}, initialState, {
      metric: Object.assign({}, initialMetricState, { query: this.getQueryInitialState() })
    });
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

  private getEffectSizeObject(key: string): string {
    const effectSizeObjectValue = safeGet(() => this.state.metric.analysisConfigurations.canary.effectSize![key]);
    return effectSizeObjectValue.isPresent() ? effectSizeObjectValue.get().toString() : '';
  }

  private handleEffectSizeObjectChange(key: string, value: string): void {
    if (value === '') {
      const effectSize = this.state.metric.analysisConfigurations.canary.effectSize;
      effectSize &&
        delete effectSize[key] &&
        this.setState(
          {
            metric: Object.assign({}, this.state.metric, {
              analysisConfigurations: Object.assign({}, this.state.metric.analysisConfigurations, {
                canary: Object.assign({}, this.state.metric.analysisConfigurations.canary, {
                  effectSize: Object.assign({}, effectSize)
                })
              })
            })
          },
          this.validate
        );
    } else {
      parseFloat(value) &&
        this.setState(
          {
            metric: Object.assign({}, this.state.metric, {
              analysisConfigurations: Object.assign({}, this.state.metric.analysisConfigurations, {
                canary: Object.assign({}, this.state.metric.analysisConfigurations.canary, {
                  effectSize: Object.assign({}, this.state.metric.analysisConfigurations.canary.effectSize, {
                    [key]: parseFloat(value)
                  })
                })
              })
            })
          },
          this.validate
        );
    }
  }

  private getOutlierFactor(): string {
    const outlierFactor = safeGet(() => this.state.metric.analysisConfigurations.canary.outliers!.outlierFactor);
    return outlierFactor.isPresent() ? outlierFactor.get().toString() : '';
  }

  private handleOutlierFactorChange(value: string): void {
    if (value === '') {
      const outliers = this.state.metric.analysisConfigurations.canary.outliers;
      outliers &&
        delete outliers.outlierFactor &&
        this.setState(
          {
            metric: Object.assign({}, this.state.metric, {
              analysisConfigurations: Object.assign({}, this.state.metric.analysisConfigurations, {
                canary: Object.assign({}, this.state.metric.analysisConfigurations.canary, {
                  outliers: Object.assign({}, outliers)
                })
              })
            })
          },
          this.validate
        );
    } else {
      parseFloat(value) &&
        this.setState(
          {
            metric: Object.assign({}, this.state.metric, {
              analysisConfigurations: Object.assign({}, this.state.metric.analysisConfigurations, {
                canary: Object.assign({}, this.state.metric.analysisConfigurations.canary, {
                  outliers: Object.assign({}, this.state.metric.analysisConfigurations.canary.outliers, {
                    outlierFactor: parseFloat(value)
                  })
                })
              })
            })
          },
          this.validate
        );
    }
  }

  private getOutlierStrategy(): string {
    const outlierStrategy = safeGet(() => this.state.metric.analysisConfigurations.canary.outliers!.strategy);
    return outlierStrategy.isPresent() ? outlierStrategy.get().toString() : 'keep';
  }

  private handleOutlierStrategyChange(value: string): void {
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          analysisConfigurations: Object.assign({}, this.state.metric.analysisConfigurations, {
            canary: Object.assign({}, this.state.metric.analysisConfigurations.canary, {
              outliers: Object.assign({}, this.state.metric.analysisConfigurations.canary.outliers, {
                strategy: value
              })
            })
          })
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

  @boundMethod
  protected handleQueryTypeSimple(isQueryTypeSimple: boolean): void {
    this.setState(
      {
        isQueryTypeSimple: isQueryTypeSimple,
        metric: Object.assign({}, this.state.metric, {
          query: this.getQueryInitialState()
        })
      },
      this.validate
    );
  }

  @boundMethod
  protected handleQueryTypeInline(isQueryTypeSimple: boolean): void {
    this.setState(
      {
        isQueryTypeSimple: isQueryTypeSimple,
        metric: Object.assign({}, this.state.metric, {
          query: Object.assign(
            {},
            ...Object.entries(this.state.metric.query)
              .filter(([k]) => k === 'customInlineTemplate' || k === 'type' || k === 'serviceType')
              .map(([k, v]) => ({ [k]: v }))
          )
        })
      },
      this.validate
    );
  }

  @boundMethod
  protected updateQueryObject(key: string, value: any) {
    this.setState(
      {
        metric: Object.assign({}, this.state.metric, {
          query: Object.assign({}, this.state.metric.query, {
            [key]: value
          })
        })
      },
      this.validate
    );
  }

  protected touch(id: string): void {
    const touched: KvMap<boolean> = {};
    touched[id] = true;
    this.setState({
      touched: Object.assign({}, this.state.touched, touched)
    });
    this.validate();
  }

  protected validate(): void {
    this.setState(this.validateCanaryMetricConfig(this.state.metric, this.props.type, this.props.isQueryTypeSimple));
  }

  abstract getQueryInitialState(): T;

  abstract getMetricSourceSpecificJsx(): JSX.Element;

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
                    placeholder="Select an existing group or type to create a new group"
                    noOptionsMessage={() => 'No existing groups, start typing to create a new group'}
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
                    this.touch('name');
                  }}
                  touched={this.state.touched.name}
                  error={this.state.errors.name}
                  id="name"
                  label="Name"
                  placeHolderText="Human readable string to describe the metric for the results"
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
                    Which direction of statistical change triggers the metric to fail. Use Increase for things like
                    error counts, memory usage, etc, where a decrease is not a failure. Use Decrease for things like
                    success counts, etc, where a larger number is not a failure. Use Either when any type of change from
                    the baseline is a failure.
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
                    Use to remove the metric from the metric group if it has no data so it will not be used for group
                    score calculation.
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
                    Use to fail the entire canary if this metric fails or has no data (recommended for important metrics
                    that signal service outages or severe problems).
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
                  <Form.Text className="text-muted">Use to fail a metric if data is missing.</Form.Text>
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
                    How to handle NaN values which can occur if the metric does not return data for a particular time
                    interval. NaN Strategy must be Remove for Criticality options to work as expected.
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
                  subText="default is the only accepted value here."
                />
                <div className="titled-section-break" />
                {/* Inject the metric source specific JSX here */}
                {this.getMetricSourceSpecificJsx()}
                <div className="titled-section-break" />
                <Accordion
                  allowZeroExpanded={true}
                  onChange={() => this.setState({ showAdvancedConfiguration: !this.state.showAdvancedConfiguration })}
                >
                  <AccordionItem>
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <div className="titled-section-title">
                          Advanced
                          <FontAwesomeIcon
                            className="img chevron"
                            size="sm"
                            color="black"
                            icon={this.state.showAdvancedConfiguration ? faChevronCircleDown : faChevronCircleRight}
                          />
                        </div>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <Alert variant="warning">
                        For advanced users only. The following advanced features are incubating changes and are subject
                        to breaking changes without notice in the future. Changing these values may affect your canary
                        result in unexpected ways.
                      </Alert>
                    </AccordionItemPanel>
                    <AccordionItemPanel>
                      <TitledSection
                        title="Effect Size"
                        additionalClassname="effect-size"
                        tooltipHeader="Effect Size"
                        tooltipText="Controls the degree of statistical significance the metric needs to fail or fail critically.
                            Metrics marked as critical can also define criticalIncrease and criticalDecrease."
                      />
                      {this.getCriticalityFromState() === 'critical' ? (
                        <>
                          <InlineTextGroup
                            id="criticalIncrease"
                            label="Critical Increase"
                            touched={this.state.touched['analysisConfigurations.canary.effectSize.criticalIncrease']}
                            error={this.state.errors['analysisConfigurations.canary.effectSize.criticalIncrease']}
                            value={this.getEffectSizeObject('criticalIncrease')}
                            onChange={e => this.handleEffectSizeObjectChange('criticalIncrease', e.target.value)}
                            onBlur={() => {
                              this.touch('analysisConfigurations.canary.effectSize.criticalIncrease');
                            }}
                            placeHolderText="5.0"
                            isNumber={true}
                            subText="The multiplier increase that must be met for the metric to be a critical failure and fail the entire analysis with a score of 0. This example value of 5.0 make the canary fail critically if there is a 5x increase."
                          />
                          <InlineTextGroup
                            id="criticalDecrease"
                            label="Critical Decrease"
                            touched={this.state.touched['analysisConfigurations.canary.effectSize.criticalDecrease']}
                            error={this.state.errors['analysisConfigurations.canary.effectSize.criticalDecrease']}
                            value={this.getEffectSizeObject('criticalDecrease')}
                            onChange={e => this.handleEffectSizeObjectChange('criticalDecrease', e.target.value)}
                            onBlur={() => {
                              this.touch('analysisConfigurations.canary.effectSize.criticalDecrease');
                            }}
                            placeHolderText="0.5"
                            isNumber={true}
                            subText="The multiplier decrease that must be met for the metric to be a critical failure and fail the entire analysis with a score of 0. This example value of 0.5 make the canary fail critically if there is a 50% decrease."
                          />
                        </>
                      ) : (
                        <>
                          <InlineTextGroup
                            id="allowedIncrease"
                            label="Allowed Increase"
                            touched={this.state.touched['analysisConfigurations.canary.effectSize.allowedIncrease']}
                            error={this.state.errors['analysisConfigurations.canary.effectSize.allowedIncrease']}
                            value={this.getEffectSizeObject('allowedIncrease')}
                            onChange={e => this.handleEffectSizeObjectChange('allowedIncrease', e.target.value)}
                            onBlur={() => {
                              this.touch('analysisConfigurations.canary.effectSize.allowedIncrease');
                            }}
                            placeHolderText="1.1"
                            isNumber={true}
                            subText="The multiplier increase that must be met for the metric to fail. This example value of 1.1 makes the metric fail when the metric has increased 10% from the baseline."
                          />
                          <InlineTextGroup
                            id="allowedDecrease"
                            label="Allowed Decrease"
                            touched={this.state.touched['analysisConfigurations.canary.effectSize.allowedDecrease']}
                            error={this.state.errors['analysisConfigurations.canary.effectSize.allowedDecrease']}
                            value={this.getEffectSizeObject('allowedDecrease')}
                            onChange={e => this.handleEffectSizeObjectChange('allowedDecrease', e.target.value)}
                            onBlur={() => {
                              this.touch('analysisConfigurations.canary.effectSize.allowedDecrease');
                            }}
                            placeHolderText="0.9"
                            isNumber={true}
                            subText="The multiplier decrease that must be met for the metric to fail. This example value of 0.9 makes the metric fail when the metric has decreased 10% from the baseline."
                          />
                        </>
                      )}
                    </AccordionItemPanel>
                    <AccordionItemPanel>
                      <TitledSection
                        title="Outliers"
                        additionalClassname="outliers"
                        tooltipHeader="Outliers"
                        tooltipText={'Controls how to classify and handle outliers.'}
                      />
                      <FormGroup
                        id="outlier-strategy"
                        label="Outlier Strategy"
                        touched={this.state.touched['analysisConfigurations.canary.outliers.strategy']}
                        error={this.state.errors['analysisConfigurations.canary.outliers.strategy']}
                      >
                        <Form.Control
                          as="select"
                          value={this.getOutlierStrategy()}
                          onChange={(e: any) => {
                            this.handleOutlierStrategyChange(e.target.value);
                          }}
                        >
                          {SUPPORTED_OUTLIER_STRATEGIES.map(strategy => (
                            <option key={strategy}>{strategy}</option>
                          ))}
                        </Form.Control>
                        <Form.Text className="text-muted">Keep or remove outliers</Form.Text>
                      </FormGroup>
                      <InlineTextGroup
                        onBlur={() => {
                          this.touch('analysisConfigurations.canary.outliers.outlierFactor');
                        }}
                        touched={this.state.touched['analysisConfigurations.canary.outliers.outlierFactor']}
                        error={this.state.errors['analysisConfigurations.canary.outliers.outlierFactor']}
                        id="outlierFactor"
                        label="Outlier Factor"
                        value={this.getOutlierFactor()}
                        onChange={e => this.handleOutlierFactorChange(e.target.value)}
                        placeHolderText="1.5"
                        isNumber={true}
                        subText={
                          <>
                            Values which fall below Q1-factor*(IQR) or above Q3+factor(IQR) are considered outliers. See{' '}
                            <a href={'https://github.com/spinnaker/kayenta/blob/master/docs/canary-config.md#outliers'}>
                              Outliers
                            </a>{' '}
                            for details.
                          </>
                        }
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                </Accordion>
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
                const valErrors = this.validateCanaryMetricConfig(
                  this.state.metric,
                  this.props.type,
                  this.state.isQueryTypeSimple
                );
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
