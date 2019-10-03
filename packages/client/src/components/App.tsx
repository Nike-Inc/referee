import * as React from 'react';
import * as H from 'history';
import { Provider } from 'mobx-react';
import { BrowserRouter, Route } from 'react-router-dom';

import { stores } from '../stores';

import Header from './Header';
import Footer from './Footer';
import Landing from './Landing';
import ModalPane from './ModalPane';
import ConfigEditor from './config/ConfigEditor';
import CanaryExecutor from './canary-executor/CanaryExecutor';
import CanaryExecutorResults from './reports/canary/CanaryExecutorResults';
import Docs from './docs/Docs';

import './App.scss';
import 'typeface-assistant/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import CanaryReportViewer from './reports/canary/CanaryReportViewer';
import ScapeReportViewer from './reports/scape/ScapeReportViewer';
import ErrorPane from './ErrorPane';

interface AppProps {}

export default class App extends React.Component<AppProps> {
  render(): React.ReactNode {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Provider {...stores}>
          <div id="kayenta-config-manager">
            <ModalPane />
            <Route render={({ history }: { history: H.History }) => <Header history={history} />} />
            <div className="content-container">
              <div className="content-container-inner-wrapper">
                <ErrorPane />
                <Route exact={true} path="/" component={Landing} />
                <Route path="/docs/:path(.*)" component={Docs} />
                <Route path="/reports/canary/:executionId(.*)" component={CanaryReportViewer} />
                <Route path="/reports/standalone_canary_analysis/:executionId(.*)" component={ScapeReportViewer} />
                <Route path="/config/edit" component={ConfigEditor} />
                <Route path="/dev-tools/canary-executor/setup" component={CanaryExecutor} />
                <Route
                  exact
                  path="/dev-tools/canary-executor/results\/:canaryExecutionId(\w+)"
                  component={CanaryExecutorResults}
                />
              </div>
            </div>
            <Footer />
          </div>
        </Provider>
      </BrowserRouter>
    );
  }
}
