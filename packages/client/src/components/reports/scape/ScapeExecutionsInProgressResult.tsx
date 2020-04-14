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
import logo from '../../../assets/logo-modified.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ToggleableTimeStamp from '../../shared/ToggleableTimeStamp';

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

class RefereeStageMetadata {
  score: string;
  status: string;
  availableResult: CanaryExecutionResult | undefined;

  constructor(score: string, status: string, availableResult: CanaryExecutionResult | undefined) {
    this.score = score;
    this.status = status;
    this.availableResult = availableResult;
  }
}

const isTerminalFailure = (selectedCanaryExecutionResult: CanaryExecutionResult) =>
  selectedCanaryExecutionResult.executionStatus === stageStatus.TERMINAL && selectedCanaryExecutionResult.exception;

const SEC_TO_MS = 60000;

@observer
export default class ScapeExecutionsInProgressResult extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      selectedCAEIndex: safeGet(() => this.props.results.canaryExecutionResults.length - 1).orElse(0),
      isSelectedRunComplete: true
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

    const determineRefereeStageMetadata = (stageMetadata: StageMetadata, index: number): RefereeStageMetadata => {
      let score: string = '...';
      let status: string = 'in-progress';
      let availableResult: CanaryExecutionResult | undefined = undefined;

      if (stageMetadata.status === stageStatus.TERMINAL) {
        score = '0';
        status = 'fail';
      } else if (stageMetadata.status === stageStatus.SUCCEEDED) {
        safeGet(() => results.canaryExecutionResults).ifPresent(
          (results: CanaryExecutionResult[]) =>
            (availableResult = results.find(result => result.executionId === stageMetadata.executionId))
        );
        if (availableResult) {
          score = safeGet(() => availableResult)
            .get()
            .result.judgeResult!.score.score.toFixed(0)
            .toString();
          status = ScoreClassUtils.getClassFromScore(parseInt(score), results.canaryScores, thresholds, index);
        }
      }

      return new RefereeStageMetadata(score, status, availableResult);
    };

    const calculateEstimatedRunEndTime = (runNumber: number, startTime: string, interval: number): string => {
      const startDate = new Date(startTime).getTime();
      const offset = interval * SEC_TO_MS * runNumber;
      return new Date(startDate + offset).toISOString();
    };

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
            endTime={stageStatus.IN_PROGRESS}
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
              const refereeStageMetadata: RefereeStageMetadata = determineRefereeStageMetadata(stageMetadata, index);
              return (
                <div className="scape-tab-wrapper" key={stageMetadata.name}>
                  <div
                    key={`execution-${index}`}
                    className={[
                      'btn',
                      'scape-tab',
                      refereeStageMetadata.status,
                      index === this.state.selectedCAEIndex ? 'selected' : 'not-selected'
                    ].join(' ')}
                    onClick={() => {
                      this.onCAETabClick(index, refereeStageMetadata.status);
                      if (refereeStageMetadata.availableResult) {
                        handleCanaryRunSelection(refereeStageMetadata.availableResult);
                      }
                    }}
                  >
                    <div className="score-wrapper headline-md-marketing">
                      <div className="score">{refereeStageMetadata.score}</div>
                      <div className="label uppercase">
                        {refereeStageMetadata.status === stageStatus.IN_PROGRESS ? '' : refereeStageMetadata.status}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="scape-executions-result-wrapper">
            {safeGet(() => this.props.results.canaryExecutionResults.length > 0).orElse(false) &&
            this.state.isSelectedRunComplete ? (
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
              <div className="in-progress-result-container">
                <div className="estimated-time-card">
                  <div className="estimated-time-card-content">
                    <div className="kv-wrapper">
                      <div className="key">Run</div>
                      <div className="value">
                        {selectedRunNumber} of {runCanaryStages.length}
                      </div>
                    </div>
                    <div className="run-time-container">
                      <div className="run-time-container-row">
                        <FontAwesomeIcon className="img spinner" size="lg" color="black" icon={faSpinner} />
                        <div className="in-progress-time">
                          <div className="eta-label">Estimated Start: </div>
                          <ToggleableTimeStamp timeStamp={startTime} />
                        </div>
                      </div>
                      <div className="run-time-container-row">
                        <FontAwesomeIcon className="img spinner" size="lg" color="black" icon={faSpinner} />
                        <div className="in-progress-time">
                          <div className="eta-label">Estimated End: </div>
                          <ToggleableTimeStamp
                            timeStamp={calculateEstimatedRunEndTime(
                              selectedRunNumber,
                              startTime,
                              request.analysisIntervalMins
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="logo-spinner-container">
                      <img id="logo" className="spinner-animation" src={logo} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
