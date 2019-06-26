import { Button } from 'react-bootstrap';
import CanaryExecutorStore from '../../stores/CanaryExecutorStore';
import ConfigEditorStore from '../../stores/ConfigEditorStore';
import { RouterProps } from 'react-router';
import { connect, ConnectedComponent } from '../connectedComponent';
import { observer } from 'mobx-react';
import * as React from 'react';
import log from '../../util/LoggerFactory';
import { fetchCanaryResultsService, kayentaApiService } from '../../services';
import { boundMethod } from 'autobind-decorator';
import './CanaryExecutorResultsButtonSection.scss';

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
export default class CanaryExecutorResultsButtonSection extends ConnectedComponent<Props, Stores> {
  @boundMethod
  private async handleRunButtonClick(): Promise<void> {
    const canaryAdhocExecutionRequest: any = {};

    this.stores.configEditorStore.markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue();
    this.stores.canaryExecutorStore.markHasTheRunButtonBeenClickedFlagAsTrue();

    if (
      !this.stores.configEditorStore.isCanaryConfigValid ||
      !this.stores.canaryExecutorStore.isExecutionRequestValid
    ) {
      return;
    }

    canaryAdhocExecutionRequest['canaryConfig'] = this.stores.configEditorStore.canaryConfigObject;
    canaryAdhocExecutionRequest['executionRequest'] = this.stores.canaryExecutorStore.canaryExecutionRequestObject;

    try {
      const data = await kayentaApiService.triggerCanary(canaryAdhocExecutionRequest);
      this.stores.canaryExecutorStore.clearResultsRequestComplete();
      this.stores.canaryExecutorStore.resetIsAccordionExpanded();
      this.stores.canaryExecutorStore.setCanaryExecutionId(data.canaryExecutionId);
      this.props.history.push(
        '/dev-tools/canary-executor/results/' + this.stores.canaryExecutorStore.canaryExecutionId
      );
      fetchCanaryResultsService.pollForCanaryExecutionComplete(this.stores.canaryExecutorStore.canaryExecutionId);
    } catch (e) {
      log.error('Failed to fetch response: ', e);
      throw e;
    }
  }

  render(): React.ReactNode {
    return (
      <div className="canary-executor-results-button-section">
        <div className="btn-wrapper">
          <Button
            onClick={() => {
              this.handleRunButtonClick();
            }}
            variant="dark"
          >
            Run Again
          </Button>
        </div>
      </div>
    );
  }
}
