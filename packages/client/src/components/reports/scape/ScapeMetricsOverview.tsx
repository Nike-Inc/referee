import * as React from 'react';
import { CanaryClassifierThresholdsConfig, CanaryExecutionResult, CanaryResult } from '../../../domain/Kayenta';
import { Meter } from '../../shared/Meter';
import classNames from 'classnames';
import './ScapeMetricsOverview.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassEnd, faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import ToggleableTimeStamp from '../../shared/ToggleableTimeStamp';

interface Props {
  selectedCanaryExecutionResult: CanaryExecutionResult;
  result: CanaryResult;
  totalRuns: number;
  selectedRunNumber: number;
  thresholds: CanaryClassifierThresholdsConfig;
  classificationCountMap: Map<string, number>;
}

enum classifications {
  FAIL = 'Fail',
  NODATA = 'Nodata',
  PASS = 'Pass'
}

export default class ScapeMetricsOverview extends React.Component<Props> {
  render(): React.ReactNode {
    const {
      selectedCanaryExecutionResult,
      result,
      totalRuns,
      selectedRunNumber,
      thresholds,
      classificationCountMap
    } = this.props;

    return (
      <div className="scape-metrics-overview-wrapper">
        <div className="scape-metrics-results-message-wrapper">
          <div
            className={classNames('scape-metrics-run-metadata-container', {
              'pass-border': result.judgeResult!.score.classification === 'Pass',
              'fail-border': result.judgeResult!.score.classification === 'Fail'
            })}
          >
            <div className="kv-wrapper">
              <div className="key">Run</div>
              <div className="value">
                {selectedRunNumber} of {totalRuns}
              </div>
            </div>
            <div className="run-time-container">
              <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassStart} />
              <ToggleableTimeStamp timeStamp={selectedCanaryExecutionResult.judgementStartTimeIso} />
            </div>
            <div className="run-time-container">
              <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassEnd} />
              <ToggleableTimeStamp timeStamp={selectedCanaryExecutionResult.judgementEndTimeIso} />
            </div>
          </div>
          <div className="scape-metrics-results-message">
            <div className="scape-metrics-meter-container">
              <Meter
                classification={result.judgeResult!.score.classification === 'Pass'}
                score={result.judgeResult!.score.score}
                marginal={thresholds.marginal}
                pass={thresholds.pass}
              />
            </div>
            {result.judgeResult!.score.classificationReason && (
              <div className="scape-metrics-results-text">{result.judgeResult!.score.classificationReason}</div>
            )}
          </div>
        </div>

        <div className="scape-metrics-results-cards">
          <div className="scape-metrics-results-card fail-text">
            <div className="card-classification-count"> {classificationCountMap.get(classifications.FAIL)}</div>
            <div className="card-classification-label">Failures</div>
          </div>
          <div className="scape-metrics-results-card">
            <div className="card-classification-count">{classificationCountMap.get(classifications.NODATA)}</div>
            <div className="card-classification-label">No Data</div>
          </div>
          <div className="scape-metrics-results-card pass-text">
            <div className="card-classification-count">{classificationCountMap.get(classifications.PASS)}</div>
            <div className="card-classification-label">Passes</div>
          </div>
        </div>
      </div>
    );
  }
}
