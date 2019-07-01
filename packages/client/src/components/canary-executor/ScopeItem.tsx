import { observer } from 'mobx-react';
import * as React from 'react';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { CanaryScope } from '../../domain/kayenta';
import Flatpickr from 'react-flatpickr';
import './ScopeItem.scss';
import 'flatpickr/dist/themes/airbnb.css';
import { FormLabel } from 'react-bootstrap';
import { boundMethod } from 'autobind-decorator';

interface ScopeProps {
  scopeType: string;
  scope: CanaryScope;
  updateCanaryScope: (newScope: CanaryScope, type: string) => void;
  disabled?: boolean;
  touch: (name: string) => void;
  touched: KvMap<boolean>;
  errors: KvMap<string>;
  hasTheRunButtonBeenClicked: boolean;
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

  render(): React.ReactNode {
    const { scopeType, scope, disabled, touch, touched, errors, hasTheRunButtonBeenClicked } = this.props;

    return (
      <div id="scope-item">
        <div id="scope-title">{scopeType}</div>
        <InlineTextGroup
          id={scopeType + '-scope-name'}
          label="Scope"
          value={scope.scope}
          disabled={disabled}
          placeHolderText="stack name or server group"
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
          value={scope.location}
          disabled={disabled}
          placeHolderText="AWS region"
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
            <FormLabel id="scope-item-label">Start Time</FormLabel>
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
          label="Start Time ISO"
          value={scope.start}
          disabled={disabled}
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
            <FormLabel id="scope-item-label">End Time</FormLabel>
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
          label="End Time ISO"
          value={scope.end}
          disabled={disabled}
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
        {!disabled && <div></div>}
      </div>
    );
  }
}
