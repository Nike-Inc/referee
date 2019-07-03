import { Alert, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import * as React from 'react';
import Select from 'react-select';

export const SelectInputGroup = ({
  options,
  name,
  label,
  value,
  onChange,
  onBlur,
  touched,
  error,
  disabled = false,
  disabledMessage
}: {
  options: string[];
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  touched: boolean;
  error: undefined | string;
  disabled?: boolean;
  disabledMessage?: string;
}): JSX.Element => {
  return (
    <FormGroup as={'div'} controlId={`${name}`}>
      <Row>
        <FormLabel column={false}>{label}</FormLabel>
      </Row>
      <Col>
        <div className={touched && error ? 'input-error-wrapper' : ''}>
          <Select
            id="dropdown"
            lable={label}
            onBlur={onBlur}
            isDisabled={disabled}
            value={{ value: value, label: value }}
            options={options.map(o => ({ value: o, label: o }))}
            onChange={(selection: any) => {
              onChange(selection.value);
            }}
          />
          {disabled && <Form.Text className="text-muted">{disabledMessage}</Form.Text>}
          {touched && error && <Alert variant="danger">{error}</Alert>}
        </div>
      </Col>
    </FormGroup>
  );
};
