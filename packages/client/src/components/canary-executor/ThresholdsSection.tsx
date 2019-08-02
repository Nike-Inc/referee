import { observer } from 'mobx-react';
import TitledSection from '../../layout/titledSection';
import * as React from 'react';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import Row from 'react-bootstrap/Row';
import './ThresholdsSection.scss';

export const ThresholdsSection = observer(
  ({
    marginalThreshold,
    passThreshold,
    updateMarginalThreshold,
    updatePassThreshold,
    touch,
    touched,
    errors,
    hasTheRunButtonBeenClicked
  }: {
    marginalThreshold: number;
    passThreshold: number;
    updateMarginalThreshold: (value: number) => void;
    updatePassThreshold: (value: number) => void;
    touch: (name: string) => void;
    touched: KvMap<boolean>;
    errors: KvMap<string>;
    hasTheRunButtonBeenClicked: boolean;
  }): JSX.Element => {
    return (
      <TitledSection title="Thresholds" additionalClassname="thresholds">
        <Row>
          <div id="thresholds-section">
            <InlineTextGroup
              id="marginal-threshold"
              label="Marginal Threshold"
              tooltipText="Score that a canary run must exceed for future runs to proceed."
              value={marginalThreshold.toString()}
              onChange={e => {
                updateMarginalThreshold(
                  parseInt((e.target as HTMLInputElement).value, 10)
                    ? parseInt((e.target as HTMLInputElement).value, 10)
                    : 0
                );
              }}
              onBlur={() => {
                touch('marginal-threshold');
              }}
              touched={touched['marginal-threshold'] || hasTheRunButtonBeenClicked}
              error={errors['thresholds.marginal']}
            />
          </div>
          <div id="thresholds-section">
            <InlineTextGroup
              id="pass-threshold"
              label="Pass Threshold"
              tooltipText="Score that the final canary run must meet or exceed for the canary to pass."
              value={passThreshold.toString()}
              onChange={e => {
                updatePassThreshold(
                  parseInt((e.target as HTMLInputElement).value, 10)
                    ? parseInt((e.target as HTMLInputElement).value, 10)
                    : 0
                );
              }}
              onBlur={() => {
                touch('pass-threshold');
              }}
              touched={touched['pass-threshold'] || hasTheRunButtonBeenClicked}
              error={errors['thresholds.pass']}
            />
          </div>
        </Row>
      </TitledSection>
    );
  }
);
