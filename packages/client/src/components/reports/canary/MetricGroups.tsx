import * as React from 'react';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryJudgeGroupScore,
  MetricSetPair
} from '../../../domain/Kayenta';
import MetricGroup from './MetricGroup';

interface Props {
  config: CanaryConfig;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  idListByMetricGroupNameMap: KvMap<string[]>;
  groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
  thresholds: CanaryClassifierThresholdsConfig;
}

interface State {
  metricGroupNamesDescByWeight: string[];
}

export default class MetricGroups extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    const groupWeights = this.props.config.classifier.groupWeights;
    const metricGroupNamesDescByWeight = Object.keys(groupWeights).sort((a, b) => {
      return groupWeights[b] - groupWeights[a];
    });

    this.state = {
      metricGroupNamesDescByWeight
    };
  }

  render(): React.ReactNode {
    const {
      config,
      metricSetPairsByIdMap,
      canaryAnalysisResultByIdMap,
      idListByMetricGroupNameMap,
      groupScoreByMetricGroupNameMap,
      thresholds
    } = this.props;
    return (
      <div>
        {this.state.metricGroupNamesDescByWeight.map(name => (
          <MetricGroup
            key={name}
            metricGroupName={name}
            canaryConfig={config}
            metricSetPairsByIdMap={metricSetPairsByIdMap}
            canaryAnalysisResultByIdMap={canaryAnalysisResultByIdMap}
            idListByMetricGroupNameMap={idListByMetricGroupNameMap}
            groupScoreByMetricGroupNameMap={groupScoreByMetricGroupNameMap}
            thresholds={thresholds}
          />
        ))}
      </div>
    );
  }
}
