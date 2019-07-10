import * as React from 'react';
import MetricGroups from './MetricGroups';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryExecutionRequest,
  CanaryJudgeGroupScore,
  CanaryResult,
  MetricSetPair
} from '../../../domain/Kayenta';
import { kayentaApiService } from '../../../services';
import { ofNullable } from '../../../util/OptionalUtils';
import CanaryMetadataSection from './CanaryMetadataSection';

interface Props {
  application?: string;
  result: CanaryResult;
  metricSetPairListId: string;
  canaryConfig: CanaryConfig;
  executionRequest: CanaryExecutionRequest;
  thresholds: CanaryClassifierThresholdsConfig;
  warnings?: string[];
  handleGoToConfigButtonClick: (config: CanaryConfig, canaryExecutionRequestObject: CanaryExecutionRequest) => void;
}

interface State {
  application: string;
  hasLoadedMetricSetPairList: boolean;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  idListByMetricGroupNameMap: KvMap<string[]>;
  groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
}

export default class CanaryRunResult extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    const application = ofNullable(this.props.application).orElse('ad-hoc');
    const judgeResult = ofNullable(this.props.result.judgeResult).orElseThrow(
      () => new Error('Expected there to be judgement results on the Canary Result object')
    );

    const canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult> = {};
    const idListByMetricGroupNameMap: KvMap<string[]> = {};

    // Iterate over the results once so we can create various maps for O(1) access later.
    judgeResult.results.forEach(canaryAnalysisResult => {
      canaryAnalysisResultByIdMap[canaryAnalysisResult.id] = canaryAnalysisResult;

      canaryAnalysisResult.groups.forEach(group => {
        if (idListByMetricGroupNameMap[group]) {
          idListByMetricGroupNameMap[group].push(canaryAnalysisResult.id);
        } else {
          idListByMetricGroupNameMap[group] = [canaryAnalysisResult.id];
        }
      });
    });

    const groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore> = {};
    judgeResult.groupScores.forEach(groupScore => (groupScoreByMetricGroupNameMap[groupScore.name] = groupScore));

    this.state = {
      application,
      hasLoadedMetricSetPairList: false,
      metricSetPairsByIdMap: {},
      canaryAnalysisResultByIdMap,
      idListByMetricGroupNameMap,
      groupScoreByMetricGroupNameMap
    };
  }

  async componentDidMount(): Promise<void> {
    const metricSetPairList = await kayentaApiService.fetchMetricSetPairList(this.props.metricSetPairListId);

    const metricSetPairsByIdMap: KvMap<MetricSetPair> = {};
    metricSetPairList.forEach(metricSetPair => {
      metricSetPairsByIdMap[metricSetPair.id] = metricSetPair;
    });

    this.setState({
      hasLoadedMetricSetPairList: true,
      metricSetPairsByIdMap
    });
  }

  render(): React.ReactNode {
    if (!this.state.hasLoadedMetricSetPairList) {
      return <div />; // todo spinner
    }

    const {
      application,
      metricSetPairsByIdMap,
      canaryAnalysisResultByIdMap,
      idListByMetricGroupNameMap,
      groupScoreByMetricGroupNameMap
    } = this.state;
    const { result, canaryConfig, executionRequest, thresholds, handleGoToConfigButtonClick } = this.props;

    return (
      <div className="report-container">
        <CanaryMetadataSection
          application={application}
          result={result}
          canaryConfig={canaryConfig}
          executionRequest={executionRequest}
          thresholds={thresholds}
          handleGoToConfigButtonClick={handleGoToConfigButtonClick}
        />
        <MetricGroups
          config={canaryConfig}
          metricSetPairsByIdMap={metricSetPairsByIdMap}
          canaryAnalysisResultByIdMap={canaryAnalysisResultByIdMap}
          idListByMetricGroupNameMap={idListByMetricGroupNameMap}
          groupScoreByMetricGroupNameMap={groupScoreByMetricGroupNameMap}
          thresholds={thresholds}
        />
      </div>
    );
  }
}
