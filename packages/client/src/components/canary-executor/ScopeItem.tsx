import { observer } from 'mobx-react';
import * as React from 'react';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { CanaryScope } from '../../domain/Kayenta';
import Flatpickr from 'react-flatpickr';
import './ScopeItem.scss';
import 'flatpickr/dist/themes/airbnb.css';
import { Button, FormLabel } from 'react-bootstrap';
import { boundMethod } from 'autobind-decorator';
import { FormGroup } from '../../layout/FormGroup';
import KeyValuePair from '../../layout/KeyValuePair';
import { Popover } from '../../layout/Popover';

interface ScopeProps {
  scopeType: string;
  scope: CanaryScope;
  updateCanaryScope: (newScope: CanaryScope, type: string) => void;
  disabled?: boolean;
  touch: (name: string) => void;
  touched: KvMap<boolean>;
  errors: KvMap<string>;
  hasTheRunButtonBeenClicked: boolean;
  handleAddNewExtendedScopeParam: (type: string) => void;
  handleExtendedScopeParamKeyChange: (index: number, value: string, type: string) => void;
  handleExtendedScopeParamValueChange: (index: number, value: string, type: string) => void;
  handleExtendedScopeParamDelete: (index: number, type: string) => void;
  extendedScopeParameters: KvPair[];
}

@observer
export default class ScopeItem extends React.Component<ScopeProps> {
  @boundMethod
  private handleNameChange(value: string, scope: CanaryScope): void {
    scope.scope = value;
    this.props.updateCanaryScope(scope, this.props.scopeType);
  }

  @boundMethod
  private handleLocationChange(value: string, scope: CanaryScope): void {
    scope.location = value;
    this.props.updateCanaryScope(scope, this.props.scopeType);
  }

  @boundMethod
  private handleStepChange(value: number, scope: CanaryScope): void {
    scope.step = value;
    this.props.updateCanaryScope(scope, this.props.scopeType);
  }

  @boundMethod
  private handleStartChange(value: string, scope: CanaryScope): void {
    scope.start = value;
    this.props.updateCanaryScope(scope, this.props.scopeType);
  }

  @boundMethod
  private handleEndChange(value: string, scope: CanaryScope): void {
    scope.end = value;
    this.props.updateCanaryScope(scope, this.props.scopeType);
  }

  @boundMethod
  private handleAddNewExtendedScopeParam(): void {
    this.props.handleAddNewExtendedScopeParam(this.props.scopeType);
  }

  @boundMethod
  private handleExtendedScopeParamKeyChange(index: number, value: string): void {
    this.props.handleExtendedScopeParamKeyChange(index, value, this.props.scopeType);
  }

  @boundMethod
  private handleExtendedScopeParamValueChange(index: number, value: string): void {
    this.props.handleExtendedScopeParamValueChange(index, value, this.props.scopeType);
  }

  @boundMethod
  private handleExtendedScopeParamDelete(index: number): void {
    this.props.handleExtendedScopeParamDelete(index, this.props.scopeType);
  }

  render(): React.ReactNode {
    const {
      scopeType,
      scope,
      disabled,
      touch,
      touched,
      errors,
      hasTheRunButtonBeenClicked,
      extendedScopeParameters
    } = this.props;
    const localTimeZone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];

    return (
      <div id="scope-item">
        <div id="scope-title">{scopeType}</div>
        <InlineTextGroup
          id={scopeType + '-scope-name'}
          label="Scope"
          tooltipText={
            <div>
              <p>
                The unique identifier for your deployed server group. <br />
                Refers to the group of instances running your software (autoscaling groups, etc.).
              </p>
            </div>
          }
          value={scope.scope}
          disabled={disabled}
          onChange={e => {
            this.handleNameChange(e.target.value, scope);
          }}
          onBlur={() => {
            touch(scopeType + '-scope-name');
          }}
          touched={touched[scopeType + '-scope-name'] || hasTheRunButtonBeenClicked}
          error={errors['scopes.default.' + scopeType + 'Scope.scope']}
        />
        <InlineTextGroup
          id={scopeType + '-location'}
          label="Location"
          placeHolderText="ex: us-east-1 (AWS region)"
          tooltipText="Location or region of your deployed service."
          value={scope.location}
          disabled={disabled}
          onChange={e => {
            this.handleLocationChange(e.target.value, scope);
          }}
          onBlur={() => {
            touch(scopeType + '-location');
          }}
          touched={touched[scopeType + '-location'] || hasTheRunButtonBeenClicked}
          error={errors['scopes.default.' + scopeType + 'Scope.location']}
        />
        <InlineTextGroup
          id={scopeType + '-step'}
          label="Step (s)"
          tooltipText="Frequency of data point requests to the metrics source when querying for metrics. Defaults to 60, meaning a data point will be requested every 60 seconds from the metrics source."
          value={scope.step.toString()}
          disabled={disabled}
          onChange={e => {
            this.handleStepChange(
              parseInt((e.target as HTMLInputElement).value, 10)
                ? parseInt((e.target as HTMLInputElement).value, 10)
                : 0,
              scope
            );
          }}
          onBlur={() => {
            touch(scopeType + '-step');
          }}
          touched={touched[scopeType + '-step'] || hasTheRunButtonBeenClicked}
          error={errors['scopes.default.' + scopeType + 'Scope.step']}
        />
        {!disabled && (
          <div id="scope-row">
            <FormLabel id="scope-item-label">Start Time ({localTimeZone})</FormLabel>
            <div className="scope-time-picker-container">
              <Flatpickr
                id="scope-time-picker"
                data-enable-time
                value={scope.start}
                onChange={date => {
                  if (date && date.length) {
                    this.handleStartChange(date[0].toISOString(), scope);
                  }
                }}
                options={{ enableTime: true, dateFormat: 'Y-m-d H:i', defaultDate: 'today' }}
              />
            </div>
          </div>
        )}
        <InlineTextGroup
          id={scopeType + '-start'}
          label="Start Time (ISO)"
          value={scope.start}
          disabled={disabled}
          tooltipText={
            'The starting timestamp of the period you are interested in seeing historical data for, must not exceed current time. Use the calendar dropdown for local time or directly supply the time in ISO format.'
          }
          placeHolderText="start time stamp"
          onChange={e => {
            this.handleStartChange(e.target.value, scope);
          }}
          onBlur={() => {
            touch(scopeType + '-start');
          }}
          touched={touched[scopeType + '-start'] || hasTheRunButtonBeenClicked}
          error={errors['scopes.default.' + scopeType + 'Scope.start']}
        />
        {!disabled && (
          <div id="scope-row">
            <FormLabel id="scope-item-label">End Time ({localTimeZone})</FormLabel>
            <div className="scope-time-picker-container">
              <Flatpickr
                id="scope-time-picker"
                data-enable-time
                value={scope.end}
                onChange={date => {
                  if (date && date.length) {
                    this.handleEndChange(date[0].toISOString(), scope);
                  }
                }}
                options={{ enableTime: true, dateFormat: 'Y-m-d H:i', defaultDate: 'today' }}
              />
            </div>
          </div>
        )}
        <InlineTextGroup
          id={scopeType + '-end'}
          label="End Time (ISO)"
          value={scope.end}
          disabled={disabled}
          tooltipText={
            'The end timestamp of the period you are interested in seeing historical data for, must not exceed current time. Use the calendar dropdown for local time or directly supply the time in ISO format.'
          }
          placeHolderText="end time stamp"
          onChange={e => {
            this.handleEndChange(e.target.value, scope);
          }}
          onBlur={() => {
            touch(scopeType + '-end');
          }}
          touched={touched[scopeType + '-end'] || hasTheRunButtonBeenClicked}
          error={errors['scopes.default.' + scopeType + 'Scope.end']}
        />
        {!disabled && (
          <FormGroup
            id={`${scopeType}-extended-scope-params`}
            label="Extended Scope Parameters"
            touched={touched[`${scopeType}-extended-scope-params`] || hasTheRunButtonBeenClicked}
            error={errors[`${scopeType}-extended-scope-params`]}
          >
            {extendedScopeParameters.length > 0 && (
              <div className="esp-kv-pairs">
                {extendedScopeParameters.map((kvPair, i) => {
                  return (
                    <KeyValuePair
                      key={i}
                      index={i}
                      kvPair={kvPair}
                      onKeyChange={this.handleExtendedScopeParamKeyChange}
                      onValueChange={this.handleExtendedScopeParamValueChange}
                      handleDelete={this.handleExtendedScopeParamDelete}
                    />
                  );
                })}
              </div>
            )}
            <div className="btn-container">
              <Button
                onClick={() => {
                  this.handleAddNewExtendedScopeParam();
                }}
                size="sm"
                className="add-esp-btn"
                variant="outline-dark"
              >
                Add New Parameter
              </Button>
              <Popover text="Add additional scope parameters if supported by the metric source." color="black" />
            </div>
          </FormGroup>
        )}
      </div>
    );
  }
}
