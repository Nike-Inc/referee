import * as React from 'react';
import { observer } from 'mobx-react';
import { GroupWeights } from '../../domain/Kayenta';
import { Alert, Col, Form, FormControl, InputGroup } from 'react-bootstrap';
import { add } from '../../validation/configValidators';
import TitledSection from '../../layout/titledSection';

import './ScoringSection.scss';

export const ScoringSection = observer(
  ({
    computedGroupWeights,
    updateGroupWeight,
    touched,
    error
  }: {
    computedGroupWeights: GroupWeights;
    updateGroupWeight: (group: string, weight: number) => void;
    touched: boolean;
    error: string;
  }): JSX.Element => {
    return (
      <TitledSection title="Scoring" additionalClassname="scoring-section">
        <div id="group-weights-wrapper">
          <Form.Group controlId="group-weights">
            <Form.Label>Group Weights</Form.Label>
            <div className="gw-wrapper">
              {Object.keys(computedGroupWeights).length === 0 && (
                <div className="no-metrics-label">
                  There are no groups associated with metrics. Click the add metric button to create a new metric
                  configuration.
                </div>
              )}
              <Col sm={10}>
                <div>
                  {Object.keys(computedGroupWeights).map(key => {
                    return (
                      <InputGroup key={key}>
                        <InputGroup.Prepend>
                          <InputGroup.Text>{key}: </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                          onChange={(e: React.SyntheticEvent<Event>) => {
                            updateGroupWeight(
                              key,
                              parseInt((e.target as HTMLInputElement).value, 10)
                                ? parseInt((e.target as HTMLInputElement).value, 10)
                                : 0
                            );
                          }}
                          value={
                            computedGroupWeights[key].toString() === '0' ? '' : computedGroupWeights[key].toString()
                          }
                        />
                      </InputGroup>
                    );
                  })}
                </div>
              </Col>
            </div>
            <div className="weight-total">Weight Total: {Object.values(computedGroupWeights).reduce(add, 0)} / 100</div>
          </Form.Group>
        </div>
        {touched && error && <Alert variant="danger">{error}</Alert>}
      </TitledSection>
    );
  }
);
