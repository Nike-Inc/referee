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
  MetricSetPair
} from '../../../domain/Kayenta';
import ScapeMetadataSection from './ScapeMetadataSection';
import { safeGet } from '../../../util/OptionalUtils';
import { ScapeRunResult } from './ScapeRunResult';
import './ScapeExecutionsResult.scss';
import ScoreClassUtils from '../../../util/ScoreClassUtils';
import { boundMethod } from 'autobind-decorator';
import TerminalResult from '../../shared/TerminalResult';
import TitledSection from '../../../layout/titledSection';
import { observer } from 'mobx-react';

interface Props {
  application: string;
  user: string;
  metricSourceType: string;
  metricsAccountName: string;
  storageAccountName: string;
  startTime: string;
  endTime: string;
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
}

const isTerminalFailure = (selectedCanaryExecutionResult: CanaryExecutionResult) =>
  selectedCanaryExecutionResult.executionStatus === 'TERMINAL' && selectedCanaryExecutionResult.exception;

@observer
export default class ScapeExecutionsResult extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    // Set the last canary execution as the selected execution by default.
    this.state = {
      selectedCAEIndex: this.props.results.canaryScores.length - 1
    };
  }

  @boundMethod
  onCAETabClick(index: number) {
    this.setState({ selectedCAEIndex: index });
  }

  render(): React.ReactNode {
    const {
      application,
      user,
      metricSourceType,
      metricsAccountName,
      storageAccountName,
      startTime,
      endTime,
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

    return (
      <div className="scape-report-container">
        <div className="scape-metadata-container">
          <TitledSection title="Canary Report" />
          <ScapeMetadataSection
            application={application as string}
            user={user as string}
            metricsAccountName={metricsAccountName as string}
            storageAccountName={storageAccountName as string}
            startTime={startTime as string}
            endTime={endTime as string}
            request={request as CanaryAnalysisExecutionRequest}
            scope={safeGet(() => request.scopes[0]).get() as CanaryAnalysisExecutionRequestScope}
            canaryConfig={canaryConfig as CanaryConfig}
            handleGoToConfigButtonClick={handleGoToConfigButtonClick}
          />
        </div>
        <div className="scape-executions">
          <div className="scape-executions-tabs">
            {results.canaryExecutionResults.map((canaryExecutionResult, index) => {
              const score = isTerminalFailure(canaryExecutionResult)
                ? 0
                : safeGet(() => canaryExecutionResult.result.judgeResult).get().score.score;
              return (
                <div className="scape-tab-wrapper" key={canaryExecutionResult.executionId}>
                  <div
                    key={`execution-${index}`}
                    className={[
                      'btn',
                      'scape-tab',
                      ScoreClassUtils.getClassFromScore(score, results.canaryScores, thresholds, index),
                      index === this.state.selectedCAEIndex ? 'selected' : 'not-selected'
                    ].join(' ')}
                    onClick={() => {
                      this.onCAETabClick(index);
                      handleCanaryRunSelection(canaryExecutionResult);
                    }}
                  >
                    <div className="score-wrapper headline-md-marketing">
                      <div className="score">{score.toFixed(0)}</div>
                      <div className="label uppercase">
                        {ScoreClassUtils.getClassFromScore(score, results.canaryScores, thresholds, index)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="scape-executions-result-wrapper">
            {isTerminalFailure(selectedCanaryExecutionResult) ? (
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
                selectedCanaryExecutionResult={selectedCanaryExecutionResult as CanaryExecutionResult}
                result={result as CanaryResult}
                totalRuns={results.canaryScores.length as number}
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
            )}
          </div>
        </div>
      </div>
    );
  }
}
