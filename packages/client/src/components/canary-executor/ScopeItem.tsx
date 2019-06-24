import { observer } from 'mobx-react';
import { KvMap } from '../../domain/CustomTypes';
import * as React from 'react';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import { CanaryScope } from '../../domain/CanaryExecutionRequestTypes';
import Flatpickr from 'react-flatpickr';
import './ScopeItem.scss';
import 'flatpickr/dist/themes/airbnb.css';
import { Button, FormControl, FormLabel } from 'react-bootstrap';
import { FormGroup } from '../../layout/FormGroup';
import { KvPair } from '../../domain/CanaryConfigTypes';
import InputGroup from 'react-bootstrap/InputGroup';
import { action, computed, observable } from 'mobx';

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

const KEY = 0;
const VALUE = 1;
let extendedParamsMap: KvMap<string> = {
  testkey: 'testvalue',
  testkey2: 'testvalue2'
  // "": ""
};
//
// let extendedParamsArray: KvPair[] = [{
//   "key" : "testvalue1",
//   "value" : "testvalue2",
//   // "": ""
// }];

@observer
export default class ScopeItem extends React.Component<ScopeProps> {
  // private convertArrayToMap(extendedParamsArray: KvPair[]): KvMap<string> {
  //   let map: KvMap<string> = {};
  //   extendedParamsArray.map((kvPair: KvPair, i: number) => {
  //     map[kvPair.key] = kvPair.value;
  //   });
  //   return map;
  // }

  private handleNameChange(value: string, scope: CanaryScope): CanaryScope {
    scope.scope = value;
    return scope;
  }

  private handleLocationChange(value: string, scope: CanaryScope): CanaryScope {
    scope.location = value;
    return scope;
  }

  private handleStepChange(value: number, scope: CanaryScope): CanaryScope {
    scope.step = value;
    return scope;
  }

  private handleStartChange(value: string, scope: CanaryScope): CanaryScope {
    scope.start = value;
    return scope;
  }

  private handleEndChange(value: string, scope: CanaryScope): CanaryScope {
    scope.end = value;
    return scope;
  }

  private handleAddExtendedScopeParam(scope: CanaryScope): CanaryScope {
    extendedParamsMap[''] = '';
    scope.extendedScopeParams = extendedParamsMap;

    // const newParams = this.extendedParamsArray ? this.extendedParamsArray.slice() : [];
    // newParams.push({ key: '', value: '' });
    // this.extendedParamsArray = newParams;

    return scope;
  }

  private handleExtendedScopeParamKeyChange(index: number, newKey: string, kvPair: [string, string]): void {
    // console.log(JSON.stringify(this.extendedParamsArray))
    //
    // if (this.extendedParamsArray === undefined) {
    //   return;
    // }
    // const newParams = [
    //   ...this.extendedParamsArray.slice(0, index),
    //   Object.assign({}, this.extendedParamsArray[index], { key: value }),
    //   ...this.extendedParamsArray.slice(index + 1)
    // ];

    kvPair[KEY] = newKey;
    Object.entries(extendedParamsMap)[index] = kvPair;
    extendedParamsMap[kvPair[KEY]] = kvPair[VALUE];
  }
  private handleExtendedScopeParamValueChange() {}
  private handleDeleteExtendedScopeParam() {}

  render(): React.ReactNode {
    const {
      scopeType,
      scope,
      updateCanaryScope,
      disabled,
      touch,
      touched,
      errors,
      hasTheRunButtonBeenClicked
    } = this.props;

    const mapx: KvMap<string> = {
      testkey: 'testvalue',
      testkey2: 'testvalue2'
      // "": ""
    };

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
            const newScope = this.handleNameChange(e.target.value, scope);
            updateCanaryScope(newScope, scopeType);
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
            const newScope = this.handleLocationChange(e.target.value, scope);
            updateCanaryScope(newScope, scopeType);
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
            const newScope = this.handleStepChange(
              parseInt((e.target as HTMLInputElement).value, 10)
                ? parseInt((e.target as HTMLInputElement).value, 10)
                : 0,
              scope
            );
            updateCanaryScope(newScope, scopeType);
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
                    const newScope = this.handleStartChange(date[0].toISOString(), scope);
                    updateCanaryScope(newScope, scopeType);
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
            const newScope = this.handleStartChange(e.target.value, scope);
            updateCanaryScope(newScope, scopeType);
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
                    const newScope = this.handleEndChange(date[0].toISOString(), scope);
                    updateCanaryScope(newScope, scopeType);
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
            const newScope = this.handleEndChange(e.target.value, scope);
            updateCanaryScope(newScope, scopeType);
          }}
          onBlur={() => {
            touch(scopeType + '-end');
          }}
          touched={touched[scopeType + '-end'] || hasTheRunButtonBeenClicked}
          error={errors['scopes.default.' + scopeType + 'Scope.end']}
        />
        {!disabled && (
          <FormGroup
            id="kv-pairs"
            label="Extended Params"
            // touched={this.state.touched.dimensions}
            // error={this.state.errors['dimensions']}
          >
            {/*{this.extendedParamsArray &&*/}
            {/*this.extendedParamsArray.map((kvPair, i) => (*/}
            {/*<KeyValuePair*/}
            {/*key={i}*/}
            {/*index={i}*/}
            {/*kvPair={kvPair}*/}
            {/*onKeyChange={this.handleExtendedScopeParamKeyChange}*/}
            {/*extendedScopeArray={this.extendedParamsArray}*/}
            {/*// onValueChange={this.handleDimensionValueChange}*/}
            {/*// handleDelete={this.handleDimensionDelete}*/}
            {/*/>*/}
            {/*))}*/}
            {/*<Button*/}
            {/*onClick={() => {*/}
            {/*this.handleAddExtendedScopeParam(scope);*/}
            {/*}}*/}
            {/*size="sm"*/}
            {/*id="add-dimension-btn"*/}
            {/*variant="outline-dark"*/}
            {/*>*/}
            {/*Add Dimension*/}
            {/*</Button>*/}

            {extendedParamsMap &&
              Object.entries(scope.extendedScopeParams).map((kvPair: [string, string], i: number) => (
                <KeyValuePair
                  key={i}
                  index={i}
                  kvPair={kvPair}
                  onKeyChange={this.handleExtendedScopeParamKeyChange}
                  // onValueChange={this.handleDimensionValueChange}
                  // handleDelete={this.handleDimensionDelete}
                />
              ))}
            <Button
              onClick={() => {
                this.handleAddExtendedScopeParam(scope);
              }}
              size="sm"
              id="add-dimension-btn"
              variant="outline-dark"
            >
              Add Extended Param
            </Button>
          </FormGroup>
        )}
      </div>
    );
  }
}

// const KeyValuePair = ({
//                         // handleDelete,
//                         index,
//                         onKeyChange,
//                         // onValueChange,
//                         kvPair,
//   extendedScopeArray
//                       }: {
//   // handleDelete: (i: number) => void;
//   index: number;
//   onKeyChange: (i: number, v: any) => void;
//   // onValueChange: (i: number, v: any) => void;
//   kvPair: KvPair;
//   extendedScopeArray: KvPair[]
// }): JSX.Element => {
//   return (
//     <InputGroup>
//       <InputGroup.Prepend>
//         <InputGroup.Text>Key: </InputGroup.Text>
//       </InputGroup.Prepend>
//       <FormControl
//         onChange={(e: any) => {
//           // console.log(JSON.stringify())
//
//           onKeyChange(index, e.target.value);
//         }}
//         value={kvPair.key}
//       />
//       <InputGroup.Prepend>
//         <InputGroup.Text>Value: </InputGroup.Text>
//       </InputGroup.Prepend>
//       <FormControl
//         // onChange={(e: any) => {
//         //   onValueChange(index, e.target.value);
//         // }}
//         value={kvPair.value}
//       />
//       <InputGroup.Append>
//         <Button variant="outline-danger"
//                 // onMouseDown={() => handleDelete(index)}
//         >
//           Delete
//         </Button>
//       </InputGroup.Append>
//     </InputGroup>
//   );
// };
//

const KeyValuePair = ({
  // handleDelete,
  index,
  onKeyChange,
  // onValueChange,
  kvPair
}: {
  // handleDelete: (i: number) => void;
  index: number;
  onKeyChange: (i: number, v: any, kvPair: [string, string]) => void;
  // onValueChange: (i: number, v: any) => void;
  kvPair: [string, string];
}): JSX.Element => {
  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>Key: </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        onChange={(e: any) => {
          console.log('changed value: ' + e.target.value);
          console.log('displayed value: ' + Object.keys(extendedParamsMap)[index]);
          onKeyChange(index, e.target.value, kvPair);
        }}
        value={kvPair[KEY]}
      />
      <InputGroup.Prepend>
        <InputGroup.Text>Value: </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        onChange={(e: any) => {
          console.log(e);
          // onValueChange(index, e.target.value);
        }}
        value={kvPair[VALUE]}
      />
      <InputGroup.Append>
        <Button
          variant="outline-danger"
          // onMouseDown={() => handleDelete(index)}
        >
          Delete
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};
