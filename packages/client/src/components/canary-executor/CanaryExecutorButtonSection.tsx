import { Button } from 'react-bootstrap';
import CanaryExecutorStore from '../../stores/CanaryExecutorStore';
import ConfigEditorStore from '../../stores/ConfigEditorStore';
import { RouterProps } from 'react-router';
import { connect, ConnectedComponent } from '../connectedComponent';
import { observer } from 'mobx-react';
import * as React from 'react';
import log from '../../util/LoggerFactory';
import { kayentaApiService } from '../../services';
import { boundMethod } from 'autobind-decorator';
import './CanaryExecutorButtonSection.scss';
import { CanaryAdhocExecutionRequest } from '../../domain/Kayenta';

interface Stores {
  canaryExecutorStore: CanaryExecutorStore;
  configEditorStore: ConfigEditorStore;
}

interface Props extends RouterProps {}

@connect(
  'canaryExecutorStore',
  'configEditorStore'
)
@observer
export default class CanaryExecutorButtonSection extends ConnectedComponent<Props, Stores> {
  @boundMethod
  private async handleRunButtonClick(): Promise<void> {
    this.stores.canaryExecutorStore.markHasTheRunButtonBeenClickedFlagAsTrue();
    if (!this.stores.canaryExecutorStore.isExecutionRequestValid) {
      return;
    }

    const canaryAdhocExecutionRequest: CanaryAdhocExecutionRequest = {
      canaryConfig: this.stores.configEditorStore.canaryConfigObject,
      executionRequest: this.stores.canaryExecutorStore.canaryExecutionRequestObject
    };

    try {
      const data = await kayentaApiService.initiateCanaryWithConfig(
        canaryAdhocExecutionRequest,
        this.stores.canaryExecutorStore.applicationName,
        this.stores.canaryExecutorStore.metricsAccountName,
        this.stores.canaryExecutorStore.storageAccountName
      );
      this.stores.canaryExecutorStore.clearResultsRequestComplete();
      this.stores.canaryExecutorStore.setCanaryExecutionId(data.canaryExecutionId);
      this.props.history.push(
        '/dev-tools/canary-executor/results/' + this.stores.canaryExecutorStore.canaryExecutionId
      );
    } catch (e) {
      log.error('Failed to fetch response: ', e);
      throw e;
    }
  }

  render(): React.ReactNode {
    return (
      <div className="canary-executor-button-section">
        <div className="btn-wrapper">
          <Button
            onClick={() => {
              this.props.history.push('/config/edit');
            }}
            variant="dark"
          >
            Back to Canary Config
          </Button>
          <Button
            onClick={() => {
              this.handleRunButtonClick();
            }}
            variant="dark"
          >
            Run Manual Execution
          </Button>
        </div>
      </div>
    );
  }
}
