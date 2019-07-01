import * as React from 'react';
import { getGroupClassFromScore } from '../../../util/ScoreClassUtils';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryJudgeGroupScore,
  CanaryMetricConfig,
  MetricSetPair
} from '../../../domain/kayenta';
import capitalize from 'capitalize';
import { ofNullable } from '../../../util/OptionalUtils';
import Metric from './Metric';

interface Props {
  metricGroupName: string;
  canaryConfig: CanaryConfig;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  idListByMetricGroupNameMap: KvMap<string[]>;
  groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
  thresholds: CanaryClassifierThresholdsConfig;
}

export default class MetricGroup extends React.Component<Props> {
  render(): React.ReactNode {
    const groupScore = this.props.groupScoreByMetricGroupNameMap[this.props.metricGroupName].score;
    const humanReadableScore = Number(groupScore.toFixed(2));
    const scoreLabel = capitalize(getGroupClassFromScore(groupScore, this.props.thresholds));
    const { metricGroupName } = this.props;

    return (
      <div>
        <div>
          <div>Name: {metricGroupName}</div>
          <div>Score: {humanReadableScore}</div>
          <div>Label: {scoreLabel}</div>
        </div>
        <div className="group-metrics">
          {this.props.idListByMetricGroupNameMap[this.props.metricGroupName].map(id => {
            const canaryAnalysisResult: CanaryAnalysisResult = this.props.canaryAnalysisResultByIdMap[id];
            const metricName = canaryAnalysisResult.name;
            const metricSetPair: MetricSetPair = this.props.metricSetPairsByIdMap[id];
            const canaryMetricConfig: CanaryMetricConfig = ofNullable(
              this.props.canaryConfig.metrics.find(canaryMetricConfig => canaryMetricConfig.name === metricName)
            ).orElseThrow(() => new Error(`Failed to find CanaryMetricConfig for ${metricName}`));
            return (
              <Metric
                key={id}
                metricName={metricName}
                canaryAnalysisResult={canaryAnalysisResult}
                metricSetPair={metricSetPair}
                canaryMetricConfig={canaryMetricConfig}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
