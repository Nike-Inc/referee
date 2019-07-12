import * as React from 'react';
import ScoreClassUtils, { getGroupClassFromScore } from '../../../util/ScoreClassUtils';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryJudgeGroupScore,
  CanaryMetricConfig,
  MetricSetPair
} from '../../../domain/Kayenta';
import capitalize from 'capitalize';
import { ofNullable } from '../../../util/OptionalUtils';
import Metric from './Metric';
import './MetricGroup.scss';

interface Props {
  metricGroupName: string;
  canaryConfig: CanaryConfig;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  idListByMetricGroupNameMap: KvMap<string[]>;
  groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
  thresholds: CanaryClassifierThresholdsConfig;
  filterMap: Map<string, boolean>;
}

export default class MetricGroup extends React.Component<Props> {
  render(): React.ReactNode {
    const groupScore = this.props.groupScoreByMetricGroupNameMap[this.props.metricGroupName].score;
    const humanReadableScore = Number(groupScore.toFixed(2));
    const { metricGroupName, thresholds, filterMap } = this.props;

    return (
      <div className="group-metrics-container-wrapper">
        <div className="group-metrics-title-container">
          <div className="group-metrics-name"> {metricGroupName}</div>
          <div
            className={[
              'group-score-tab',
              'headline-md-brand',
              ScoreClassUtils.getGroupClassFromScore(groupScore, thresholds)
            ].join(' ')}
          >
            <div className="score-wrapper headline-md-marketing">
              <div className="score">{humanReadableScore}</div>
            </div>
          </div>
        </div>
        <div className="group-metrics-content">
          {this.props.idListByMetricGroupNameMap[this.props.metricGroupName]
            .filter(id => {
              const canaryAnalysisResult: CanaryAnalysisResult = this.props.canaryAnalysisResultByIdMap[id];
              return filterMap.get(canaryAnalysisResult.classification);
            })
            .map(id => {
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
