import * as React from 'react';
import { connect, ConnectedComponent } from '../../connectedComponent';
import { RouteComponentProps } from 'react-router';
import {
  CanaryConfig,
  CanaryExecutionRequest,
  CanaryExecutionStatusResponse,
  CanaryResult
} from '../../../domain/Kayenta';
import CanaryExecutorStore from '../../../stores/CanaryExecutorStore';
import { kayentaApiService } from '../../../services';
import { mapIfPresentOrElse, ofNullable } from '../../../util/OptionalUtils';
import CanaryRunResult from './CanaryRunResult';
import log from '../../../util/LoggerFactory';

interface PathParams {
  executionId: string;
}

interface Props extends RouteComponentProps<PathParams> {}

interface Stores {
  canaryExecutorStore: CanaryExecutorStore;
}

interface State {
  canaryExecutionStatusResponse?: CanaryExecutionStatusResponse;
  config?: CanaryConfig;
}

/**
 * The smart top level component for viewing a report of the /canary results.
 */
@connect('canaryExecutorStore')
export default class CanaryReportViewer extends ConnectedComponent<Props, Stores, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {};
  }

  async componentDidMount(): Promise<void> {
    let canaryExecutionStatusResponse: CanaryExecutionStatusResponse | undefined = undefined;
    if (this.stores.canaryExecutorStore.canaryExecutionStatusResponse) {
      canaryExecutionStatusResponse = this.stores.canaryExecutorStore.canaryExecutionStatusResponse;
    } else {
      const executionId = this.props.match.params.executionId;
      try {
        canaryExecutionStatusResponse = await kayentaApiService.fetchCanaryExecutionStatusResponse(executionId);
      } catch (e) {
        log.error(`Failed to fetch the canaryExecutionStatusResponse for id: ${executionId}`);
        throw e;
      }
    }

    let config = canaryExecutionStatusResponse.config;
    if (!config) {
      config = await kayentaApiService.fetchCanaryConfig(
        ofNullable(canaryExecutionStatusResponse.canaryConfigId).orElseThrow(
          () => new Error('Expected either a canary config id or canary config object to be present')
        )
      );
    }

    this.setState({
      canaryExecutionStatusResponse,
      config
    });
  }

  render(): React.ReactNode {
    return mapIfPresentOrElse(
      ofNullable(this.state.canaryExecutionStatusResponse),
      canaryExecutionStatusResponse => {
        if (canaryExecutionStatusResponse.complete && canaryExecutionStatusResponse.status !== 'terminal') {
          // It now safe to assume, to the best of my knowledge, that result, metricSetPairListId will now not be null
          return (
            <CanaryRunResult
              result={canaryExecutionStatusResponse.result as CanaryResult}
              metricSetPairListId={canaryExecutionStatusResponse.metricSetPairListId as string}
              config={this.state.config as CanaryConfig}
              thresholds={(canaryExecutionStatusResponse.canaryExecutionRequest as CanaryExecutionRequest).thresholds}
            />
          );
        } else if (!canaryExecutionStatusResponse.complete) {
          // TODO canary execution is still running.
        } else {
          // TODO terminal canary execution stuff here.
        }
      },
      () => <div>SPINNER HERE</div> // TODO
    );
  }
}
