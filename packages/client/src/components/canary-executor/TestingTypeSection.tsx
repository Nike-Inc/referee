import { observer } from 'mobx-react';
import TitledSection from '../../layout/titledSection';
import * as React from 'react';
import { Form, FormLabel } from 'react-bootstrap';
import './TestingTypeSection.scss';
import { Popover } from '../../layout/Popover';

interface TestingTypeProps {
  testingType: string;
  updateTestingType: (value: string) => void;
}

@observer
export default class ConfigureMetricModal extends React.Component<TestingTypeProps> {
  render(): React.ReactNode {
    const { testingType, updateTestingType } = this.props;

    return (
      <TitledSection title="Testing Type" additionalClassname="testing-type">
        <div className="testing-type">
          <div className="testing-type-row">
            <FormLabel className="testing-type-label">Type</FormLabel>
            <div className="testing-type-content">
              <div className="testing-type-item">
                <Form.Check
                  onChange={() => {
                    updateTestingType('AA');
                  }}
                  checked={testingType === 'AA'}
                  inline={true}
                  label="A-A"
                  type="radio"
                  id="testing-type-a-a"
                />
                <Popover
                  header="A-A Testing"
                  text="In A-A testing, the experiment is the exact same as the baseline. A-A testing is helpful to
                        confirm that your metrics and execution configurations are working."
                  color="black"
                />
              </div>
              <div className="testing-type-item">
                <Form.Check
                  onChange={() => {
                    updateTestingType('AB');
                  }}
                  checked={testingType === 'AB'}
                  inline={true}
                  label="A-B"
                  type="radio"
                  id="testing-type-a-b"
                />
                <Popover
                  header="A-B Testing"
                  text="In A-B testing, the experiment is different from the baseline to simulate the way canary
                    would be used in production."
                  color="black"
                />
              </div>
            </div>
          </div>
        </div>
      </TitledSection>
    );
  }
}
