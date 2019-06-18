import * as React from 'react';
import { RouterProps } from 'react-router';
import CanaryExecutorStore from '../../stores/CanaryExecutorStore';
import ConfigEditorStore from '../../stores/ConfigEditorStore';
import { connect, ConnectedComponent } from '../connectedComponent';
import { observer } from 'mobx-react';
import CanaryExecutorResultsStore from '../../stores/CanaryExecutorResultsStore';
import CanaryExecutorFormView from '../canary-executor/CanaryExecutorFormView';
import ConfigFormView from '../config/ConfigFormView';
import log from '../../util/LoggerFactory';

interface Stores {
  canaryExecutorStore: CanaryExecutorStore;
  configEditorStore: ConfigEditorStore;
  resultsStore: CanaryExecutorResultsStore;
}

interface Props extends RouterProps {}

@connect(
  'canaryExecutorStore',
  'configEditorStore',
  'resultsStore'
)
@observer
export default class CanaryExecutorResults extends ConnectedComponent<Props, Stores> {
  render(): React.ReactNode {
    const { canaryExecutorStore, configEditorStore, resultsStore } = this.stores;

    return (
      <div>
        <h5>
          <br /> Canary Execution Id: <br />
          {resultsStore.canaryExecutionId}
        </h5>
        <h5>
          <br /> Canary Config: <br />{' '}
        </h5>
        <pre> {JSON.stringify(configEditorStore.canaryConfigObject, null, 2)}</pre>
        <h5>
          <br /> Execution Config: <br />{' '}
        </h5>
        <pre> {JSON.stringify(canaryExecutorStore.canaryExecutionRequestObject, null, 2)}</pre>

        {/*<ConfigFormView history={this.props.history} />*/}
        {/*<CanaryExecutorFormView />*/}
      </div>
    );
  }
}
