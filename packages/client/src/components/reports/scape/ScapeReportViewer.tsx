import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  CanaryAnalysisExecutionRequest,
  CanaryAnalysisExecutionResult,
  CanaryAnalysisExecutionStatusResponse,
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryExecutionResult,
  CanaryJudgeGroupScore,
  CanaryResult,
  MetricSetPair
} from '../../../domain/Kayenta';
import { kayentaApiService } from '../../../services';
import { mapIfPresentOrElse, ofNullable, safeGet } from '../../../util/OptionalUtils';
import ScapeExecutionsResult from './ScapeExecutionsResult';
import { boundMethod } from 'autobind-decorator';
import ConfigEditorStore from '../../../stores/ConfigEditorStore';
import { connect, ConnectedComponent } from '../../connectedComponent';
import ReportStore from '../../../stores/ReportStore';
import log from '../../../util/LoggerFactory';
import { observer } from 'mobx-react';
import logo from '../../../assets/logo.svg';
import ListStore from '../../../stores/ListStore';
import { DisplayableError } from '../../../domain/Referee';
import './ScapeReportViewer.scss';
import Optional from 'optional-js';
import ScapeExecutionsInProgressResult from './ScapeExecutionsInProgressResult';
import { add } from '../../../validation/configValidators';

interface PathParams {
  executionId: string;
}

interface Props extends RouteComponentProps<PathParams> {}

interface Stores {
  configEditorStore: ConfigEditorStore;
  reportStore: ReportStore;
  errorStore: ListStore<DisplayableError>;
}

interface State {
  scapeExecutionStatusResponse?: CanaryAnalysisExecutionStatusResponse;
  executionId?: string;
}

const REPORT_UPDATE_WAIT_IN_MS = 300000;

@connect('configEditorStore', 'reportStore', 'errorStore')
@observer
export default class ScapeReportViewer extends ConnectedComponent<Props, Stores, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {};
  }

  async fetchScapeResponseAndUpdateStores(executionId: string) {
    let scapeExecutionStatusResponse: CanaryAnalysisExecutionStatusResponse | undefined = undefined;
    try {
      scapeExecutionStatusResponse = await kayentaApiService.fetchCanaryAnalysisExecutionStatusResponse(executionId);
      this.stores.reportStore.updateFromScapeResponse(scapeExecutionStatusResponse);
    } catch (e) {
      log.error(`Failed to fetch the canaryExecutionStatusResponse for id: ${executionId}`);
      this.stores.errorStore.push({
        heading: `Failed to fetch the canaryExecutionStatusResponse for id: ${executionId}`,
        content: (
          <div>We are unable to find a canary run for id: {executionId}. Please confirm this id is correct. </div>
        )
      });
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

      const totalGroupWeights: number = Math.round(Object.values(this.stores.configEditorStore.computedGroupWeights).reduce(
        add,
        0
      ));
      if (totalGroupWeights !== 100) {
        log.error(`Configuration Error: Group weights need to add up to 100.`);
        this.stores.errorStore.push({
          heading: `Configuration Error: Group weights need to add up to 100.`,
          content: (
            <div>
              Your group weights equal {totalGroupWeights}. This might affect your canary results. Please click "Go To
              Config" to set group weights to 100.
            </div>
          )
        });
      }

      // TODO confirm if this is the best way to check if map exists before calling the API
      if (Object.keys(this.stores.reportStore.metricSetPairListMap).length === 0) {
        let metricSetPairListMap: KvMap<MetricSetPair[]>;
        if (this.stores.reportStore.scapeResults) {
          metricSetPairListMap = await kayentaApiService.createMetricSetPairListMap(
            this.stores.reportStore.scapeResults.canaryExecutionResults
          );

          this.stores.reportStore.setMetricSetPairListMap(metricSetPairListMap);
        }
      }
    });

    this.setState({
      scapeExecutionStatusResponse,
      executionId
    });
  }

  async componentDidMount(): Promise<void> {
    const executionId = Optional.ofNullable(this.props.match.params.executionId).orElse('');
    const self = this;

    this.fetchScapeResponseAndUpdateStores(executionId);
    const intervalId = setInterval(function() {
      const scapeExecutionStatusResponseValue = safeGet(() => self.state.scapeExecutionStatusResponse);
      if (scapeExecutionStatusResponseValue.isPresent() ? scapeExecutionStatusResponseValue.get().complete : false) {
        clearInterval(intervalId);
      } else {
        self.fetchScapeResponseAndUpdateStores(executionId);
      }
    }, REPORT_UPDATE_WAIT_IN_MS);
  }

  @boundMethod
  handleGoToConfigButtonClick(config: CanaryConfig): void {
    this.stores.configEditorStore.setCanaryConfigObject(config);
    this.props.history.push('/config/edit');
  }

  @boundMethod
  handleCanaryRunSelection(canaryExecutionResult: CanaryExecutionResult): void {
    this.stores.reportStore.handleCanaryRunSelection(canaryExecutionResult);
  }

  render(): React.ReactNode {
    const { configEditorStore, reportStore, errorStore } = this.stores;

    return mapIfPresentOrElse(
      ofNullable(this.state.scapeExecutionStatusResponse),
      scapeExecutionStatusResponse => {
        if (scapeExecutionStatusResponse.complete && reportStore.scapeResults && reportStore.scapeExecutionRequest) {
          return (
            <ScapeExecutionsResult
              application={ofNullable(scapeExecutionStatusResponse.application).orElse('ad-hoc') as string}
              user={ofNullable(scapeExecutionStatusResponse.user).orElse('anonymous') as string}
              metricSourceType={configEditorStore.metricSourceType as string}
              metricsAccountName={scapeExecutionStatusResponse.metricsAccountName as string}
              storageAccountName={scapeExecutionStatusResponse.storageAccountName as string}
              applicationMetadata={reportStore.applicationMetadata as KvMap<string>}
              startTime={reportStore.startTime as string}
              endTime={reportStore.endTime as string}
              lifetime={reportStore.lifetime as number}
              thresholds={reportStore.thresholds as CanaryClassifierThresholdsConfig}
              results={reportStore.scapeResults as CanaryAnalysisExecutionResult}
              selectedCanaryExecutionResult={reportStore.selectedCanaryExecutionResult as CanaryExecutionResult}
              result={reportStore.canaryResult as CanaryResult}
              selectedMetric={reportStore.selectedMetric as string}
              request={reportStore.scapeExecutionRequest as CanaryAnalysisExecutionRequest}
              canaryConfig={configEditorStore.canaryConfigObject as CanaryConfig}
              canaryAnalysisResultByIdMap={reportStore.canaryAnalysisResultByIdMap as KvMap<CanaryAnalysisResult>}
              idListByMetricGroupNameMap={reportStore.idListByMetricGroupNameMap as KvMap<string[]>}
              groupScoreByMetricGroupNameMap={
                reportStore.groupScoreByMetricGroupNameMap as KvMap<CanaryJudgeGroupScore>
              }
              metricSetPairsByIdMap={reportStore.metricSetPairsByIdMap as KvMap<MetricSetPair>}
              classificationCountMap={reportStore.classificationCountMap as Map<string, number>}
              metricGroupNamesDescByWeight={configEditorStore.metricGroupNamesDescByWeight as string[]}
              displayMetricOverview={reportStore.displayMetricOverview as boolean}
              handleOverviewSelection={reportStore.handleOverviewSelection}
              handleCanaryRunSelection={this.handleCanaryRunSelection}
              handleMetricSelection={reportStore.handleMetricSelection}
              handleGoToConfigButtonClick={this.handleGoToConfigButtonClick}
            />
          );
        } else if (!scapeExecutionStatusResponse.complete && reportStore.scapeExecutionRequest) {
          return (
            <div>
              <ScapeExecutionsInProgressResult
                stageStatusList={ofNullable(scapeExecutionStatusResponse.stageStatus).orElse([])}
                application={ofNullable(scapeExecutionStatusResponse.application).orElse('ad-hoc') as string}
                user={ofNullable(scapeExecutionStatusResponse.user).orElse('anonymous') as string}
                metricSourceType={configEditorStore.metricSourceType as string}
                metricsAccountName={scapeExecutionStatusResponse.metricsAccountName as string}
                storageAccountName={scapeExecutionStatusResponse.storageAccountName as string}
                applicationMetadata={reportStore.applicationMetadata as KvMap<string>}
                startTime={reportStore.startTime as string}
                lifetime={reportStore.lifetime as number}
                thresholds={reportStore.thresholds as CanaryClassifierThresholdsConfig}
                results={reportStore.scapeResults as CanaryAnalysisExecutionResult}
                selectedCanaryExecutionResult={reportStore.selectedCanaryExecutionResult as CanaryExecutionResult}
                result={reportStore.canaryResult as CanaryResult}
                selectedMetric={reportStore.selectedMetric as string}
                request={reportStore.scapeExecutionRequest as CanaryAnalysisExecutionRequest}
                canaryConfig={configEditorStore.canaryConfigObject as CanaryConfig}
                canaryAnalysisResultByIdMap={reportStore.canaryAnalysisResultByIdMap as KvMap<CanaryAnalysisResult>}
                idListByMetricGroupNameMap={reportStore.idListByMetricGroupNameMap as KvMap<string[]>}
                groupScoreByMetricGroupNameMap={
                  reportStore.groupScoreByMetricGroupNameMap as KvMap<CanaryJudgeGroupScore>
                }
                metricSetPairsByIdMap={reportStore.metricSetPairsByIdMap as KvMap<MetricSetPair>}
                classificationCountMap={reportStore.classificationCountMap as Map<string, number>}
                metricGroupNamesDescByWeight={configEditorStore.metricGroupNamesDescByWeight as string[]}
                displayMetricOverview={reportStore.displayMetricOverview as boolean}
                handleOverviewSelection={reportStore.handleOverviewSelection}
                handleCanaryRunSelection={this.handleCanaryRunSelection}
                handleMetricSelection={reportStore.handleMetricSelection}
                handleGoToConfigButtonClick={this.handleGoToConfigButtonClick}
              />
            </div>
          );
        } else {
          log.error(`Failed to fetch the canaryExecutionStatusResponse for id: ${this.state.executionId}`);
          errorStore.push({
            heading: `Failed to fetch the canaryExecutionStatusResponse for id: ${this.state.executionId}`,
            content: (
              <div>
                We are unable to find a canary run for id: {this.state.executionId}. Please confirm this id is correct.{' '}
              </div>
            )
          });
          return (
            <div className="img-container">
              <img id="logo" src={logo} alt="" />
            </div>
          );
        }
      },
      () => (
        <div className="img-container">
          <img id="logo" src={logo} alt="" />
        </div>
      )
    );
  }
}
