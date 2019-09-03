import * as React from 'react';

import {kayentaApiService, metricsService} from '../../services/';
import { connect, ConnectedComponent } from '../connectedComponent';
import { observer } from 'mobx-react';
import CanaryExecutorFormView from './CanaryExecutorFormView';
import CanaryExecutorButtonSection from './CanaryExecutorButtonSection';
import { RouterProps } from 'react-router';
import CanaryExecutorStore from '../../stores/CanaryExecutorStore';
import './CanaryExecutor.scss';

interface Stores {
  canaryExecutorStore: CanaryExecutorStore;
}

interface Props extends RouterProps {}

@connect('canaryExecutorStore')
@observer
export default class CanaryExecutor extends ConnectedComponent<Props, Stores> {
  componentDidMount(): void {
    window.scrollTo(0, 0);
    kayentaApiService.fetchCredentials().then(data => this.stores.canaryExecutorStore.setKayentaCredentials(data));
    metricsService.sendMetric('retrospectiveTool', '');
  }

  render(): React.ReactNode {
    return (
      <div className="canary-executor">
        <CanaryExecutorFormView />
        <CanaryExecutorButtonSection history={this.props.history} />
      </div>
    );
  }
}
