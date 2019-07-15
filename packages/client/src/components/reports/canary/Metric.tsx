import * as React from 'react';
import { CanaryAnalysisResult, CanaryMetricConfig, MetricSetPair } from '../../../domain/Kayenta';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import './Metric.scss';

interface Props {
  metricName: string;
  canaryAnalysisResult: CanaryAnalysisResult;
  metricSetPair: MetricSetPair;
  canaryMetricConfig: CanaryMetricConfig;
}

export default class Metric extends React.Component<Props> {
  render(): React.ReactNode {
    const { metricName, canaryMetricConfig, metricSetPair, canaryAnalysisResult } = this.props;

    return (
      <div className="metric-container">
        <div className="metric-name">{metricName}</div>
        <div className="metric-symbols">
          {canaryMetricConfig.analysisConfigurations.canary.critical && (
            <div className="metric-critical-symbol">
              <FontAwesomeIcon className="exclamation" size="1x" color="black" icon={faExclamation} />
            </div>
          )}
          <div
            className={classNames('dot', {
              [canaryAnalysisResult.classification.toLowerCase()]: true
            })}
          ></div>
        </div>
      </div>
    );
  }
}
