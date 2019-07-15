import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CanaryAnalysisExecutionStatusResponse, CanaryConfig } from '../../../domain/Kayenta';
import { kayentaApiService } from '../../../services';
import { mapIfPresentOrElse, ofNullable } from '../../../util/OptionalUtils';
import ScapeExecutionsResult from './ScapeExecutionsResult';
import { boundMethod } from 'autobind-decorator';
import CanaryExecutorStore from '../../../stores/CanaryExecutorStore';
import ConfigEditorStore from '../../../stores/ConfigEditorStore';
import { connect, ConnectedComponent } from '../../connectedComponent';

interface PathParams {
  executionId: string;
}

interface Props extends RouteComponentProps<PathParams> {}

interface Stores {
  canaryExecutorStore: CanaryExecutorStore;
  configEditorStore: ConfigEditorStore;
}

interface State {
  executionStatusResponse?: CanaryAnalysisExecutionStatusResponse;
  canaryConfig?: CanaryConfig;
}

@connect('canaryExecutorStore')
@connect('configEditorStore')
export default class ScapeReportViewer extends ConnectedComponent<Props, Stores, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {};
  }

  async componentDidMount(): Promise<void> {
    const executionId = this.props.match.params.executionId;
    const executionStatusResponse = await kayentaApiService.fetchCanaryAnalysisExecutionStatusResponse(executionId);

    let canaryConfig = executionStatusResponse.canaryConfig;
    if (!canaryConfig) {
      canaryConfig = await kayentaApiService.fetchCanaryConfig(
        ofNullable(executionStatusResponse.canaryConfigId).orElseThrow(
          () => new Error('Expected either a canary config id or canary config object to be present')
        )
      );
    }

    this.setState({
      executionStatusResponse,
      canaryConfig
    });
  }

  @boundMethod
  handleGoToConfigButtonClick(config: CanaryConfig): void {
    this.stores.configEditorStore.setCanaryConfigObject(config);
    this.props.history.push('/config/edit');
  }

  render(): React.ReactNode {
    const { executionStatusResponse, canaryConfig } = this.state;

    return mapIfPresentOrElse(
      ofNullable(executionStatusResponse),
      executionStatusResponse => {
        if (executionStatusResponse.complete) {
          return (
            <ScapeExecutionsResult
              executionStatusResponse={executionStatusResponse as CanaryAnalysisExecutionStatusResponse}
              canaryConfig={canaryConfig as CanaryConfig}
              handleGoToConfigButtonClick={this.handleGoToConfigButtonClick}
            />
          );
        } else if (!executionStatusResponse.complete) {
          return <div></div>;
          // TODO execution is still running.
        }
      },
      () => <div>SPINNER HERE</div> // TODO
    );
  }
}
