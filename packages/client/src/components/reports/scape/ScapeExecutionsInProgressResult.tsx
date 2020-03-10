import * as React from 'react';
import {
  CanaryAnalysisExecutionRequest,
  CanaryAnalysisExecutionRequestScope,
  CanaryAnalysisExecutionResult,
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryExecutionResult,
  CanaryJudgeGroupScore,
  CanaryResult,
  MetricSetPair,
  StageMetadata
} from '../../../domain/Kayenta';
import ScapeMetadataSection from './ScapeMetadataSection';
import { safeGet } from '../../../util/OptionalUtils';
import { ScapeRunResult } from './ScapeRunResult';
import './ScapeExecutionsInProgressResult.scss';
import ScoreClassUtils from '../../../util/ScoreClassUtils';
import TerminalResult from '../../shared/TerminalResult';
import TitledSection from '../../../layout/titledSection';
import { observer } from 'mobx-react';
import logo from '../../../assets/logo.svg';

enum stageStatus {
  SUCCEEDED = 'SUCCEEDED',
  TERMINAL = 'TERMINAL',
  IN_PROGRESS = 'in-progress'
}

interface Props {
  stageStatusList: StageMetadata[];
  application: string;
  user: string;
  metricSourceType: string;
  applicationMetadata: KvMap<string>;
  metricsAccountName: string;
  storageAccountName: string;
  startTime: string;
  endTime: string;
  lifetime: number;
  thresholds: CanaryClassifierThresholdsConfig;
  results: CanaryAnalysisExecutionResult;
  selectedCanaryExecutionResult: CanaryExecutionResult;
  result: CanaryResult;
  selectedMetric: string;
  request: CanaryAnalysisExecutionRequest;
  canaryConfig: CanaryConfig;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  idListByMetricGroupNameMap: KvMap<string[]>;
  groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
  classificationCountMap: Map<string, number>;
  metricGroupNamesDescByWeight: string[];
  displayMetricOverview: boolean;
  handleOverviewSelection: () => void;
  handleCanaryRunSelection: (canaryExecutionResult: CanaryExecutionResult) => void;
  handleMetricSelection: (id: string) => void;
  handleGoToConfigButtonClick: (config: CanaryConfig) => void;
}

interface State {
  selectedCAEIndex: number;
  isSelectedRunComplete: boolean;
}

const isTerminalFailure = (selectedCanaryExecutionResult: CanaryExecutionResult) =>
  selectedCanaryExecutionResult.executionStatus === stageStatus.TERMINAL && selectedCanaryExecutionResult.exception;

@observer
export default class ScapeExecutionsInProgressResult extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      selectedCAEIndex: safeGet(() => this.props.results.canaryExecutionResults.length - 1).orElse(0),
      isSelectedRunComplete: safeGet(() => this.props.results.canaryExecutionResults.length > 0).orElse(false)
    };
  }

  onCAETabClick(index: number, status: string) {
    this.setState({ selectedCAEIndex: index, isSelectedRunComplete: status !== stageStatus.IN_PROGRESS });
  }

  render(): React.ReactNode {
    const {
      stageStatusList,
      application,
      user,
      metricSourceType,
      applicationMetadata,
      metricsAccountName,
      storageAccountName,
      startTime,
      endTime,
      lifetime,
      thresholds,
      results,
      selectedCanaryExecutionResult,
      result,
      selectedMetric,
      request,
      canaryConfig,
      canaryAnalysisResultByIdMap,
      idListByMetricGroupNameMap,
      groupScoreByMetricGroupNameMap,
      metricSetPairsByIdMap,
      classificationCountMap,
      metricGroupNamesDescByWeight,
      displayMetricOverview,
      handleOverviewSelection,
      handleCanaryRunSelection,
      handleMetricSelection,
      handleGoToConfigButtonClick
    } = this.props;

    const selectedRunNumber = this.state.selectedCAEIndex + 1;
    const runCanaryStages = stageStatusList.filter(stageMetadata => stageMetadata.type === 'runCanary');

    return (
      <div className="scape-in-progress-report-container">
        <div className="scape-metadata-container">
          <TitledSection title="Canary Report" />
          <ScapeMetadataSection
            application={application as string}
            user={user as string}
            applicationMetadata={applicationMetadata as KvMap<string>}
            metricsAccountName={metricsAccountName as string}
            storageAccountName={storageAccountName as string}
            startTime={startTime as string}
            endTime={endTime as string}
            lifetime={lifetime as number}
            request={request as CanaryAnalysisExecutionRequest}
            scope={safeGet(() => request.scopes[0]).get() as CanaryAnalysisExecutionRequestScope}
            canaryConfig={canaryConfig as CanaryConfig}
            handleGoToConfigButtonClick={handleGoToConfigButtonClick}
          />
        </div>
        <div className="message-bar">Canary Analysis In Progress</div>
        <div className="scape-executions">
          <div className="scape-executions-tabs">
            {runCanaryStages.map((stageMetadata, index) => {
              // TODO clean up this code
              let score: string = '...';
              let status: string;
              let availableResult: CanaryExecutionResult | undefined = undefined;

              if (stageMetadata.status === stageStatus.TERMINAL) {
                score = '0';
                status = 'fail';
              } else if (stageMetadata.status === stageStatus.SUCCEEDED) {
                availableResult = results.canaryExecutionResults.find(
                  result => result.executionId === stageMetadata.executionId
                );
                if (availableResult)
                  score = safeGet(() => availableResult)
                    .get()
                    .result.judgeResult!.score.score.toFixed(0)
                    .toString();
                status = ScoreClassUtils.getClassFromScore(parseInt(score), results.canaryScores, thresholds, index);
              } else {
                status = 'in-progress';
              }

              return (
                <div className="scape-tab-wrapper" key={stageMetadata.name}>
                  <div
                    key={`execution-${index}`}
                    className={[
                      'btn',
                      'scape-tab',
                      status,
                      index === this.state.selectedCAEIndex ? 'selected' : 'not-selected'
                    ].join(' ')}
                    onClick={() => {
                      this.onCAETabClick(index, status);
                      if (availableResult) {
                        handleCanaryRunSelection(availableResult);
                      }
                    }}
                  >
                    <div className="score-wrapper headline-md-marketing">
                      <div className="score">{score}</div>
                      <div className="label uppercase">{status === stageStatus.IN_PROGRESS ? '' : status}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="scape-executions-result-wrapper">
            {this.state.isSelectedRunComplete ? (
              isTerminalFailure(selectedCanaryExecutionResult) ? (
                <div className="terminal-canary-wrapper">
                  <TerminalResult exception={selectedCanaryExecutionResult.exception} />
                </div>
              ) : (
                <ScapeRunResult
                  application={application as string}
                  user={user as string}
                  metricSourceType={metricSourceType as string}
                  metricsAccountName={metricsAccountName as string}
                  storageAccountName={storageAccountName as string}
                  thresholds={thresholds as CanaryClassifierThresholdsConfig}
                  lifetime={lifetime as number}
                  selectedCanaryExecutionResult={selectedCanaryExecutionResult as CanaryExecutionResult}
                  result={result as CanaryResult}
                  totalRuns={runCanaryStages.length as number}
                  selectedRunNumber={selectedRunNumber as number}
                  selectedMetric={selectedMetric as string}
                  canaryConfig={canaryConfig as CanaryConfig}
                  canaryAnalysisResultByIdMap={canaryAnalysisResultByIdMap as KvMap<CanaryAnalysisResult>}
                  idListByMetricGroupNameMap={idListByMetricGroupNameMap as KvMap<string[]>}
                  groupScoreByMetricGroupNameMap={groupScoreByMetricGroupNameMap as KvMap<CanaryJudgeGroupScore>}
                  metricSetPairsByIdMap={metricSetPairsByIdMap as KvMap<MetricSetPair>}
                  classificationCountMap={classificationCountMap as Map<string, number>}
                  metricGroupNamesDescByWeight={metricGroupNamesDescByWeight as string[]}
                  displayMetricOverview={displayMetricOverview as boolean}
                  handleOverviewSelection={handleOverviewSelection}
                  handleMetricSelection={handleMetricSelection}
                />
              )
            ) : (
              <div className="img-container">
                <img id="logo" src={logo} alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}