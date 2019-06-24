import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { version } from '../../package.json';

import './Footer.scss';

export default class Footer extends React.Component {
  render(): React.ReactNode {
    return (
      <Container fluid={true} id="footer">
        <Row>
          <Col>
            <div className="footer-label" id="about">
              About
            </div>
            <div>Version: {version}</div>
          </Col>
          <Col>
            <div className="footer-label" id="about">
              Attributions
            </div>
            <div className="citations">
              This site makes use of icons from <a href="https://github.com/FortAwesome/Font-Awesome">FontAwesome</a> licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
            </div>
          </Col>
          <Col>
            <div className="footer-label" id="help">
              Help
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
