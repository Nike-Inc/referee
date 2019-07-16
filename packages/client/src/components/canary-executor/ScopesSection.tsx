import { observer } from 'mobx-react';
import TitledSection from '../../layout/titledSection';
import * as React from 'react';
import ScopeItem from './ScopeItem';
import { CanaryScope } from '../../domain/Kayenta';
import Row from 'react-bootstrap/Row';

export const ScopesSection = observer(
  ({
    controlScope,
    experimentScope,
    updateCanaryScope,
    testingType,
    touch,
    touched,
    errors,
    hasTheRunButtonBeenClicked,
    handleAddNewExtendedScopeParam,
    handleExtendedScopeParamKeyChange,
    handleExtendedScopeParamValueChange,
    handleExtendedScopeParamDelete,
    controlExtendedScopes,
    experimentExtendedScopes
  }: {
    controlScope: CanaryScope;
    experimentScope: CanaryScope;
    updateCanaryScope: (newScope: CanaryScope, type: string) => void;
    testingType: string;
    touch: (name: string) => void;
    touched: KvMap<boolean>;
    errors: KvMap<string>;
    hasTheRunButtonBeenClicked: boolean;
    handleAddNewExtendedScopeParam: (type: string) => void;
    handleExtendedScopeParamKeyChange: (index: number, value: string, type: string) => void;
    handleExtendedScopeParamValueChange: (index: number, value: string, type: string) => void;
    handleExtendedScopeParamDelete: (index: number, type: string) => void;
    controlExtendedScopes: KvPair[];
    experimentExtendedScopes: KvPair[];
  }): JSX.Element => {
    return (
      <TitledSection title="Scopes" additionalClassname="scopes">
        <Row>
          <ScopeItem
            scopeType="control"
            scope={controlScope}
            updateCanaryScope={updateCanaryScope}
            touch={touch}
            errors={errors}
            touched={touched}
            hasTheRunButtonBeenClicked={hasTheRunButtonBeenClicked}
            handleAddNewExtendedScopeParam={handleAddNewExtendedScopeParam}
            handleExtendedScopeParamKeyChange={handleExtendedScopeParamKeyChange}
            handleExtendedScopeParamValueChange={handleExtendedScopeParamValueChange}
            handleExtendedScopeParamDelete={handleExtendedScopeParamDelete}
            extendedScopeParameters={controlExtendedScopes}
          />
          <ScopeItem
            scopeType="experiment"
            scope={experimentScope}
            updateCanaryScope={updateCanaryScope}
            disabled={testingType === 'AA'}
            touch={touch}
            errors={errors}
            touched={touched}
            hasTheRunButtonBeenClicked={hasTheRunButtonBeenClicked}
            handleAddNewExtendedScopeParam={handleAddNewExtendedScopeParam}
            handleExtendedScopeParamKeyChange={handleExtendedScopeParamKeyChange}
            handleExtendedScopeParamValueChange={handleExtendedScopeParamValueChange}
            handleExtendedScopeParamDelete={handleExtendedScopeParamDelete}
            extendedScopeParameters={experimentExtendedScopes}
          />
        </Row>
      </TitledSection>
    );
  }
);
