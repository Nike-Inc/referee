import { Alert, Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import * as React from 'react';

export const TextInputGroup = ({
  name,
  label,
  value,
  onChange,
  area = false,
  rows = '1',
  onBlur,
  touched,
  error
}: {
  name: string;
  label: string;
  value?: string;
  onChange?: any;
  area?: boolean;
  rows?: string;
  onBlur: () => void;
  touched: boolean;
  error: undefined | string;
}): JSX.Element => {
  return (
    <FormGroup as={'div'} controlId={`${name}`}>
      <Row>
        <FormLabel>{label}</FormLabel>
      </Row>
      <Col>
        <div className={touched && error ? 'input-error-wrapper' : ''}>
          <FormControl
            autoComplete="off"
            onBlur={() => {
              onBlur();
            }}
            type="text"
            as={area ? 'textarea' : 'input'}
            rows={rows}
            value={value}
            onChange={onChange}
          />
          {touched && error && <Alert variant="danger">{error}</Alert>}
        </div>
      </Col>
    </FormGroup>
  );
};
