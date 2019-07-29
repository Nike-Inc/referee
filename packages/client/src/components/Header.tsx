import * as React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import log from '../util/LoggerFactory';
import logo from '../assets/logo.svg';

import './Header.scss';
import { RouterProps } from 'react-router';
import { connect, ConnectedComponent } from './connectedComponent';
import ConfigEditorStore from '../stores/ConfigEditorStore';
import CanaryConfigFactory from '../util/CanaryConfigFactory';
import LoadCanaryConfigNavItem from './config/LoadCanaryConfigNavItem';
import { CanaryConfig } from '../domain/Kayenta';
import { boundMethod } from 'autobind-decorator';
import Optional from 'optional-js';
import { loadCanaryConfigService, docsService } from '../services';
import DocsStore from '../stores/DocsStore';
import { observer } from 'mobx-react';
import { safeGet } from '../util/OptionalUtils';
import { metricSourceTypes } from '../metricSources';

interface Props extends RouterProps {}
interface Stores {
  configEditorStore: ConfigEditorStore;
  docsStore: DocsStore;
}

@connect(
  'configEditorStore',
  'docsStore'
)
@observer
export default class Header extends ConnectedComponent<Props, Stores> {
  componentDidMount(): void {
    docsService.fetchAndUpdateToc();
  }

  @boundMethod
  private loadCanaryFromJsonObject(config: CanaryConfig): void {
    this.stores.configEditorStore.setCanaryConfigObject(config);
    this.props.history.push('/config/edit');
  }

  render(): React.ReactNode {
    return (
      <div id="header-wrapper">
        <Container fluid={true} id="header">
          <Navbar bg="header-navbar" variant="dark" expand="lg">
            <Navbar.Brand
              onClick={() => {
                this.props.history.push('/');
              }}
            >
              <img id="header-logo" src={logo} alt="" />
              <div id="header-label">Referee</div>
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {Optional.ofNullable(this.stores.docsStore.tableOfContents).isPresent() && (
                  <Nav.Link
                    onClick={() => {
                      this.props.history.push('/docs/');
                    }}
                  >
                    Docs
                  </Nav.Link>
                )}
                <NavDropdown title="Configuration" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    onClick={() => {
                      this.stores.configEditorStore.setCanaryConfigObject(CanaryConfigFactory.createNewCanaryConfig());
                      this.props.history.push('/config/edit');
                    }}
                  >
                    Create a New Kayenta Canary Config
                  </NavDropdown.Item>
                  <LoadCanaryConfigNavItem onError={e => log.error(e)} onLoad={this.loadCanaryFromJsonObject} />
                  <NavDropdown.Item
                    onClick={() => {
                      loadCanaryConfigService.loadCanaryFromClipboard().then((canaryConfig: CanaryConfig | null) => {
                        Optional.ofNullable<CanaryConfig>(canaryConfig).ifPresent(c =>
                          this.loadCanaryFromJsonObject(c)
                        );
                      });
                    }}
                  >
                    Load Existing Kayenta Config from Clipboard
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
    );
  }
}
