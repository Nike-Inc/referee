import * as React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Popover } from './Popover';
import { ofNullable } from '../util/OptionalUtils';

export const FormGroup = ({
  children,
  id,
  label,
  tooltipHeader,
  tooltipText,
  touched = false,
  error = undefined
}: {
  children: any;
  id: string;
  label: string;
  tooltipHeader?: string;
  tooltipText?: JSX.Element | string;
  touched?: boolean;
  error?: undefined | string;
}): JSX.Element => {
  return (
    <Form.Group as={Row} controlId={id}>
      <Form.Label column={true}>
        <div className="label-tooltip-container">
          {label}
          {tooltipText && <Popover header={ofNullable(tooltipHeader).orElse('')} text={tooltipText} color="black" />}
        </div>
      </Form.Label>
      <Col sm={10}>
        <div className={touched && error ? 'configure-metric-form-error-wrapper' : ''}>
          {children}
          {touched && error && <Alert variant="danger">{error}</Alert>}
        </div>
      </Col>
    </Form.Group>
  );
};
