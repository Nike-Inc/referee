import { observer } from 'mobx-react';
import TitledSection from '../../layout/titledSection';
import * as React from 'react';
import { FormGroup } from '../../layout/FormGroup';
import { Form } from 'react-bootstrap';

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
        <FormGroup id="testing-type" label="Testing Type">
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

          <Form.Text className="text-muted">
            In A-A testing, the experiment is the exact same as the baseline. A-A testing is helpful to confirm that
            your metrics and execution configurations are working. <br />
            In A-B testing, the experiment is different from the baseline to simulate the way canary would be used in
            production.
          </Form.Text>
        </FormGroup>
      </TitledSection>
    );
  }
}
