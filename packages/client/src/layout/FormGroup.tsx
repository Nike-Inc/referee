import * as React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const FormGroup = ({
  children,
  id,
  label,
  touched = false,
  error = undefined
}: {
  children: any;
  id: string;
  label: string;
  touched?: boolean;
  error?: undefined | string;
}): JSX.Element => {
  return (
    <Form.Group as={Row} controlId={id}>
      <Form.Label column={true}>{label}</Form.Label>
      <Col sm={10}>
        <div className={touched && error ? 'configure-metric-form-error-wrapper' : ''}>
          {children}
          {touched && error && <Alert variant="danger">{error}</Alert>}
        </div>
      </Col>
    </Form.Group>
  );
};
