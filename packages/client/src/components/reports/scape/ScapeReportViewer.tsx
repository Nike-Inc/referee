import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  CanaryAnalysisExecutionRequest,
  CanaryAnalysisExecutionStatusResponse,
  CanaryConfig
} from '../../../domain/Kayenta';
import { kayentaApiService } from '../../../services';
import { mapIfPresentOrElse, ofNullable } from '../../../util/OptionalUtils';
import ScapeExecutionsResult from './ScapeExecutionsResult';
import { boundMethod } from 'autobind-decorator';
import ConfigEditorStore from '../../../stores/ConfigEditorStore';
import { connect, ConnectedComponent } from '../../connectedComponent';
import ReportStore from '../../../stores/ReportStore';
import log from '../../../util/LoggerFactory';

interface PathParams {
  executionId: string;
}

interface Props extends RouteComponentProps<PathParams> {}

interface Stores {
  configEditorStore: ConfigEditorStore;
  reportStore: ReportStore;
}

interface State {
  scapeExecutionStatusResponse?: CanaryAnalysisExecutionStatusResponse;
}

@connect(
  'configEditorStore',
  'reportStore'
)
export default class ScapeReportViewer extends ConnectedComponent<Props, Stores, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {};
  }

  async componentDidMount(): Promise<void> {
    let scapeExecutionStatusResponse: CanaryAnalysisExecutionStatusResponse | undefined = undefined;

    const executionId = this.props.match.params.executionId;

    try {
      scapeExecutionStatusResponse = await kayentaApiService.fetchCanaryAnalysisExecutionStatusResponse(executionId);
      this.stores.reportStore.updateFromScapeResponse(scapeExecutionStatusResponse);
    } catch (e) {
      log.error(`Failed to fetch the canaryAnalysisExecutionStatusResponse for id: ${executionId}`);
      throw e;
    }

    ofNullable(this.stores.reportStore.scapeExecutionStatusResponse).ifPresent(async response => {
      let canaryConfig: CanaryConfig | undefined = undefined;
      if (response.canaryConfig !== undefined) {
        this.stores.configEditorStore.setCanaryConfigObject(response.canaryConfig);
      }
      if (!this.stores.configEditorStore.canaryConfigObject) {
        canaryConfig = await kayentaApiService.fetchCanaryConfig(
          ofNullable(response.canaryConfigId).orElseThrow(
            () => new Error('Expected either a canary config id or canary config object to be present')
          )
        );
        this.stores.configEditorStore.setCanaryConfigObject(canaryConfig);
      }
    });
    this.setState({
      scapeExecutionStatusResponse
    });
  }

  @boundMethod
  handleGoToConfigButtonClick(config: CanaryConfig): void {
    this.stores.configEditorStore.setCanaryConfigObject(config);
    this.props.history.push('/config/edit');
  }

  render(): React.ReactNode {
    const { configEditorStore, reportStore } = this.stores;

    return mapIfPresentOrElse(
      ofNullable(this.state.scapeExecutionStatusResponse),
      scapeExecutionStatusResponse => {
        if (scapeExecutionStatusResponse.complete) {
          return (
            <ScapeExecutionsResult
              application={reportStore.application as string}
              user={reportStore.user as string}
              metricsAccountName={reportStore.metricsAccountName as string}
              storageAccountName={reportStore.storageAccountName as string}
              request={reportStore.scapeExecutionRequest as CanaryAnalysisExecutionRequest}
              canaryConfig={configEditorStore.canaryConfigObject as CanaryConfig}
              handleGoToConfigButtonClick={this.handleGoToConfigButtonClick}
            />
          );
        } else if (!scapeExecutionStatusResponse.complete) {
          return <div></div>;
          // TODO execution is still running.
        }
      },
      () => <div>SPINNER HERE</div> // TODO
    );
  }
}
