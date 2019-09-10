import * as React from 'react';
import { CanaryClassifierThresholdsConfig, CanaryResult } from '../../../domain/Kayenta';
import { Meter } from '../../shared/Meter';
import classNames from 'classnames';
import './CanaryMetricsOverview.scss';

interface Props {
  result: CanaryResult;
  thresholds: CanaryClassifierThresholdsConfig;
  classificationCountMap: Map<string, number>;
}

enum classifications {
  FAIL = 'Fail',
  NODATA = 'Nodata',
  PASS = 'Pass'
}

export default class CanaryMetricsOverview extends React.Component<Props> {
  render(): React.ReactNode {
    const { result, thresholds, classificationCountMap } = this.props;

    return (
      <div className="canary-metrics-overview-wrapper">
        <div className="canary-metrics-results-message-wrapper">
          <div
            className={classNames('canary-metrics-score-container', {
              pass: result.judgeResult!.score.classification === 'Pass',
              fail: result.judgeResult!.score.classification === 'Fail'
            })}
          >
            <div className="canary-metrics-score">{result.judgeResult!.score.score.toFixed(0)}</div>
          </div>
          <div className="canary-metrics-results-message">
            <div className="canary-metrics-meter-container">
              <Meter
                classification={result.judgeResult!.score.classification === 'Pass'}
                score={result.judgeResult!.score.score}
                marginal={thresholds.marginal}
                pass={thresholds.pass}
              />
            </div>
            {result.judgeResult!.score.classificationReason && (
              <div className="canary-metrics-results-text">{result.judgeResult!.score.classificationReason}</div>
            )}
          </div>
        </div>

        <div className="canary-metrics-results-cards">
          <div className="canary-metrics-results-card fail-text">
            <div className="card-classification-count"> {classificationCountMap.get(classifications.FAIL)}</div>
            <div className="card-classification-label">Failures</div>
          </div>
          <div className="canary-metrics-results-card">
            <div className="card-classification-count">{classificationCountMap.get(classifications.NODATA)}</div>
            <div className="card-classification-label">No Data</div>
          </div>
          <div className="canary-metrics-results-card pass-text">
            <div className="card-classification-count">{classificationCountMap.get(classifications.PASS)}</div>
            <div className="card-classification-label">Passes</div>
          </div>
        </div>
      </div>
    );
  }
}
