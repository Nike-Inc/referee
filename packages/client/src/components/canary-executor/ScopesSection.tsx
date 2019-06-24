import { observer } from 'mobx-react';
import { KvMap } from '../../domain/CustomTypes';
import TitledSection from '../../layout/titledSection';
import * as React from 'react';
import ScopeItem from '../canary-executor/ScopeItem';
import { CanaryScope } from '../../domain/CanaryExecutionRequestTypes';
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
    hasTheRunButtonBeenClicked
  }: {
    controlScope: CanaryScope;
    experimentScope: CanaryScope;
    updateCanaryScope: (newScope: CanaryScope, type: string) => void;
    testingType: string;
    touch: (name: string) => void;
    touched: KvMap<boolean>;
    errors: KvMap<string>;
    hasTheRunButtonBeenClicked: boolean;
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
          />
        </Row>
      </TitledSection>
    );
  }
);
