import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  CanaryAnalysisExecutionResult,
  CanaryAnalysisExecutionStatusResponse,
  CanaryConfig
} from '../../../domain/Kayenta';
import { kayentaApiService } from '../../../services';
import { mapIfPresentOrElse, ofNullable } from '../../../util/OptionalUtils';
import CanaryRunResult from '../canary/CanaryRunResult';

interface PathParams {
  executionId: string;
}

interface Props extends RouteComponentProps<PathParams> {}

interface State {
  executionStatusResponse?: CanaryAnalysisExecutionStatusResponse;
  canaryConfig?: CanaryConfig;
}

export default class ScapeReportViewer extends React.Component<Props, State> {
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

  render(): React.ReactNode {
    const { executionStatusResponse, canaryConfig } = this.state;

    return mapIfPresentOrElse(
      ofNullable(executionStatusResponse),
      executionStatusResponse => {
        if (executionStatusResponse.complete) {
          // It now safe to assume, to the best of my knowledge, that result, metricSetPairListId will now not be null
          return (
            <div>
              {(executionStatusResponse!
                .canaryAnalysisExecutionResult as CanaryAnalysisExecutionResult).canaryExecutionResults.map(
                canaryRun => {
                  return (
                    <CanaryRunResult
                      result={canaryRun.result}
                      metricSetPairListId={canaryRun.metricSetPairListId as string}
                      config={canaryConfig as CanaryConfig}
                      thresholds={executionStatusResponse!.canaryAnalysisExecutionRequest!.thresholds}
                    />
                  );
                }
              )}
            </div>
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
