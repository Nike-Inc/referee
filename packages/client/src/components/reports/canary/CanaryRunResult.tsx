import * as React from 'react';
import MetricGroups from './MetricGroups';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryJudgeGroupScore,
  CanaryResult,
  MetricSetPair
} from '../../../domain/kayenta';
import { kayentaApiService } from '../../../services';
import { ofNullable } from '../../../util/OptionalUtils';

interface Props {
  result: CanaryResult;
  metricSetPairListId: string;
  config: CanaryConfig;
  thresholds: CanaryClassifierThresholdsConfig;
}

interface State {
  hasLoadedMetricSetPairList: boolean;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  idListByMetricGroupNameMap: KvMap<string[]>;
  groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
}

export default class CanaryRunResult extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

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
      metricSetPairsByIdMap,
      canaryAnalysisResultByIdMap,
      idListByMetricGroupNameMap,
      groupScoreByMetricGroupNameMap
    } = this.state;
    const { config, thresholds } = this.props;

    return (
      <div className="report-container">
        <MetricGroups
          config={config}
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
