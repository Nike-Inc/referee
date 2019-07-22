import * as React from 'react';
import { connect, ConnectedComponent } from '../../connectedComponent';
import { RouteComponentProps } from 'react-router';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryExecutionRequest,
  CanaryExecutionStatusResponse,
  CanaryJudgeGroupScore,
  CanaryResult,
  MetricSetPair
} from '../../../domain/Kayenta';
import CanaryExecutorStore from '../../../stores/CanaryExecutorStore';
import { kayentaApiService } from '../../../services';
import { mapIfPresentOrElse, ofNullable } from '../../../util/OptionalUtils';
import { CanaryRunResult } from './CanaryRunResult';
import log from '../../../util/LoggerFactory';
import { boundMethod } from 'autobind-decorator';
import ConfigEditorStore from '../../../stores/ConfigEditorStore';
import ReportStore from '../../../stores/ReportStore';

interface PathParams {
  executionId: string;
}

interface Props extends RouteComponentProps<PathParams> {}

interface Stores {
  canaryExecutorStore: CanaryExecutorStore;
  configEditorStore: ConfigEditorStore;
  reportStore: ReportStore;
}

interface State {
  canaryExecutionStatusResponse?: CanaryExecutionStatusResponse;
}

/**
 * The smart top level component for viewing a report of the /canary results.
 */
@connect(
  'configEditorStore',
  'canaryExecutorStore',
  'reportStore'
)
export default class CanaryReportViewer extends ConnectedComponent<Props, Stores, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {};
  }

  async componentDidMount(): Promise<void> {
    let canaryExecutionStatusResponse: CanaryExecutionStatusResponse | undefined = undefined;

    const executionId = this.props.match.params.executionId;
    try {
      canaryExecutionStatusResponse = await kayentaApiService.fetchCanaryExecutionStatusResponse(executionId);
      this.stores.reportStore.updateFromCanaryResponse(canaryExecutionStatusResponse);
    } catch (e) {
      log.error(`Failed to fetch the canaryExecutionStatusResponse for id: ${executionId}`);
      throw e;
    }

    let canaryConfig: CanaryConfig | undefined = undefined;
    if (this.stores.reportStore.canaryExecutionStatusResponse!.config !== undefined) {
      this.stores.configEditorStore.setCanaryConfigObject(
        this.stores.reportStore.canaryExecutionStatusResponse!.config
      );
    }
    if (!this.stores.configEditorStore.canaryConfigObject) {
      canaryConfig = await kayentaApiService.fetchCanaryConfig(
        ofNullable(this.stores.reportStore.canaryExecutionStatusResponse!.canaryConfigId).orElseThrow(
          () => new Error('Expected either a canary config id or canary config object to be present')
        )
      );
      this.stores.configEditorStore.setCanaryConfigObject(canaryConfig);
    }

    const metricSetPairList = await kayentaApiService.fetchMetricSetPairList(
      this.stores.reportStore.metricSetPairListId
    );
    this.stores.reportStore.setMetricSetPairList(metricSetPairList);

    this.setState({
      canaryExecutionStatusResponse
    });
  }

  @boundMethod
  handleGoToConfigButtonClick(config: CanaryConfig, canaryExecutionRequestObject: CanaryExecutionRequest): void {
    this.stores.configEditorStore.setCanaryConfigObject(config);
    this.stores.canaryExecutorStore.setCanaryExecutionRequestObject(canaryExecutionRequestObject);
    this.props.history.push('/config/edit');
  }

  render(): React.ReactNode {
    const { configEditorStore, reportStore } = this.stores;

    return mapIfPresentOrElse(
      ofNullable(this.state.canaryExecutionStatusResponse),
      canaryExecutionStatusResponse => {
        if (canaryExecutionStatusResponse.complete && canaryExecutionStatusResponse.status !== 'terminal') {
          // It now safe to assume, to the best of my knowledge, that result, metricSetPairListId will now not be null
          return (
            <CanaryRunResult
              application={reportStore.application as string}
              result={reportStore.result as CanaryResult}
              canaryConfig={configEditorStore.canaryConfigObject as CanaryConfig}
              thresholds={reportStore.thresholds as CanaryClassifierThresholdsConfig}
              canaryAnalysisResultByIdMap={reportStore.canaryAnalysisResultByIdMap as KvMap<CanaryAnalysisResult>}
              idListByMetricGroupNameMap={reportStore.idListByMetricGroupNameMap as KvMap<string[]>}
              groupScoreByMetricGroupNameMap={
                reportStore.groupScoreByMetricGroupNameMap as KvMap<CanaryJudgeGroupScore>
              }
              metricSetPairsByIdMap={reportStore.metricSetPairsByIdMap as KvMap<MetricSetPair>}
              classificationCountMap={reportStore.classificationCountMap as Map<string, number>}
              metricGroupNamesDescByWeight={configEditorStore.metricGroupNamesDescByWeight as string[]}
              executionRequest={canaryExecutionStatusResponse.canaryExecutionRequest as CanaryExecutionRequest}
              handleGoToConfigButtonClick={this.handleGoToConfigButtonClick}
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
