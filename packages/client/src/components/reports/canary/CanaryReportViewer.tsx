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
import TerminalResult from '../../shared/TerminalResult';
import log from '../../../util/LoggerFactory';
import { boundMethod } from 'autobind-decorator';
import ConfigEditorStore from '../../../stores/ConfigEditorStore';
import ReportStore from '../../../stores/ReportStore';
import { observer } from 'mobx-react';
import TitledSection from '../../../layout/titledSection';
import CanaryMetadataSection from './CanaryMetadataSection';

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
@observer
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

    ofNullable(this.stores.reportStore.canaryExecutionStatusResponse).ifPresent(async response => {

      let canaryConfig: CanaryConfig | undefined = undefined;
      if (response.config !== undefined) {
        this.stores.configEditorStore.setCanaryConfigObject(response.config);
      }
      if (!this.stores.configEditorStore.canaryConfigObject) {
        canaryConfig = await kayentaApiService.fetchCanaryConfig(
          ofNullable(response.canaryConfigId).orElseThrow(
            () => new Error('Expected either a canary config id or canary config object to be present')
          )
        );
        this.stores.configEditorStore.setCanaryConfigObject(canaryConfig);
      }

      if (this.stores.reportStore.metricSetPairListId) {
        const metricSetPairList = await kayentaApiService.fetchMetricSetPairList(
          this.stores.reportStore.metricSetPairListId
        );
        this.stores.reportStore.setMetricSetPairList(metricSetPairList);
      }
    });

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
              metricSourceType={configEditorStore.metricSourceType as string}
              result={reportStore.result as CanaryResult}
              canaryConfig={configEditorStore.canaryConfigObject as CanaryConfig}
              thresholds={reportStore.thresholds as CanaryClassifierThresholdsConfig}
              selectedMetric={reportStore.selectedMetric as string}
              canaryAnalysisResultByIdMap={reportStore.canaryAnalysisResultByIdMap as KvMap<CanaryAnalysisResult>}
              idListByMetricGroupNameMap={reportStore.idListByMetricGroupNameMap as KvMap<string[]>}
              groupScoreByMetricGroupNameMap={
                reportStore.groupScoreByMetricGroupNameMap as KvMap<CanaryJudgeGroupScore>
              }
              metricSetPairsByIdMap={reportStore.metricSetPairsByIdMap as KvMap<MetricSetPair>}
              classificationCountMap={reportStore.classificationCountMap as Map<string, number>}
              metricGroupNamesDescByWeight={configEditorStore.metricGroupNamesDescByWeight as string[]}
              executionRequest={canaryExecutionStatusResponse.canaryExecutionRequest as CanaryExecutionRequest}
              displayMetricOverview={reportStore.displayMetricOverview as boolean}
              handleOverviewSelection={reportStore.handleOverviewSelection}
              handleMetricSelection={reportStore.handleMetricSelection}
              handleGoToConfigButtonClick={this.handleGoToConfigButtonClick}
            />
          );
        } else if (!canaryExecutionStatusResponse.complete) {
          // TODO canary execution is still running.
        } else {
          return (
            <div className="terminal-canary-wrapper">
              <TitledSection title="Canary Report" />
              <CanaryMetadataSection
                application={reportStore.application as string}
                canaryConfig={configEditorStore.canaryConfigObject as CanaryConfig}
                executionRequest={canaryExecutionStatusResponse.canaryExecutionRequest as CanaryExecutionRequest}
                handleGoToConfigButtonClick={this.handleGoToConfigButtonClick}
              />
              <TerminalResult
                exception={ofNullable(this.stores.reportStore.canaryExecutionStatusResponse).get().exception}
              />
            </div>
          );
        }
      },
      () => <div>SPINNER HERE</div> // TODO
    );
  }
}
