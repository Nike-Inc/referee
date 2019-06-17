import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { version } from '../../package.json';

import './Footer.scss';

export default class Footer extends React.Component {
  render(): React.ReactNode {
    return (
      <Container fluid={true} id="footer">
        <Row>
          <Col />
          <Col>
            <div className="footer-label" id="about">
              About
            </div>
            <div>Version: {version}</div>
          </Col>
          <Col>
            <div className="footer-label" id="help">
              Help
            </div>
          </Col>
          <Col />
        </Row>
      </Container>
    );
  }
}
