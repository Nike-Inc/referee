import * as React from 'react';
import { CanaryAnalysisResult, CanaryMetricConfig, MetricSetPair } from '../../../domain/kayenta';

interface Props {
  metricName: string;
  canaryAnalysisResult: CanaryAnalysisResult;
  metricSetPair: MetricSetPair;
  canaryMetricConfig: CanaryMetricConfig;
}

export default class Metric extends React.Component<Props> {
  render(): React.ReactNode {
    const { metricName, canaryMetricConfig, metricSetPair, canaryAnalysisResult } = this.props;

    // TODO below is just a stub showing that the data is available
    return (
      <div>
        <div>Name: {metricName}</div>
        <div>{canaryAnalysisResult.classification}</div>
        <div>{canaryAnalysisResult.classificationReason}</div>
        <div>{JSON.stringify(canaryMetricConfig.query)}</div>
        <div>Number of control data points: {metricSetPair.values.control.length}</div>
        <div>Number of experiment data points: {metricSetPair.values.experiment.length}</div>
      </div>
    );
  }
}
