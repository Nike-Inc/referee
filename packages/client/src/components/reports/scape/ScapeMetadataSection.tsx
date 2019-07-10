import * as React from 'react';
import {
  CanaryAnalysisExecutionRequest,
  CanaryAnalysisExecutionRequestScope,
  CanaryAnalysisExecutionResult,
  CanaryConfig
} from '../../../domain/Kayenta';
import './ScapeMetadataSection.scss';
import { Button } from 'react-bootstrap';
import { Meter } from '../../shared/Meter';

interface Props {
  application: string;
  user: string;
  result: CanaryAnalysisExecutionResult;
  request: CanaryAnalysisExecutionRequest;
  scope: CanaryAnalysisExecutionRequestScope;
  canaryConfig: CanaryConfig;
  handleGoToConfigButtonClick: (config: CanaryConfig) => void;
}

const MILLISECOND_CONVERSION = 1000;
const SEC_TO_MIN_CONVERSION = 60;

export default class ScapeMetadataSection extends React.Component<Props> {

  private calculateLifetime(): number {
    if (this.props.scope.endTimeIso) {
      const startDate = new Date(this.props.scope.startTimeIso);
      const endDate = new Date(this.props.scope.endTimeIso);
      const diff = (endDate.getTime() - startDate.getTime()) / MILLISECOND_CONVERSION / SEC_TO_MIN_CONVERSION;
      return Math.abs(Math.round(diff));
    } else if (this.props.request.lifetimeDurationMins) {
      return this.props.request.lifetimeDurationMins;
    } else return -1;
  }

  render(): React.ReactNode {
    const {
      application,
      user,
      result,
      request,
      scope,
      canaryConfig,
      handleGoToConfigButtonClick
    } = this.props;

    const localTimeZone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
    const last = result.canaryScores.length - 1;

    return (
      <div className="metadata-section">
        <div className="metadata-columns">
          <div className="metadata-column">
            <div className="metadata-column-content">
              <div className="kv-wrapper">
                <div className="key">Application</div>
                <div className="value">{application}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">User</div>
                <div className="value">{user}</div>
              </div>
            </div>
            <div className="btn-wrapper">
              <Button
                onClick={() => {
                  handleGoToConfigButtonClick(canaryConfig);
                }}
                variant="dark"
              >
                Go to Config
              </Button>
            </div>
          </div>

          <div className="metadata-column">
            <div className="metadata-column-content">
              <div className="kv-wrapper">
                <div className="key">Baseline</div>
                <div className="value">{scope.controlScope}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key"></div>
                <div className="value">{scope.controlLocation}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Canary</div>
                <div className="value">{scope.experimentScope}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key"></div>
                <div className="value">{scope.experimentLocation}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Start</div>
                <div className="value">
                  {new Date(scope.startTimeIso).toLocaleString()} {localTimeZone}
                </div>
              </div>
              <div className="kv-wrapper">
                <div className="key"></div>
                <div className="value">{scope.startTimeIso}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">End</div>
                <div className="value">
                  {new Date(scope.endTimeIso).toLocaleString()} {localTimeZone}
                </div>
              </div>
              <div className="kv-wrapper">
                <div className="key"></div>
                <div className="value">{scope.endTimeIso}</div>
              </div>
            </div>
          </div>

          <div className="metadata-column">
            <div className="metadata-column-content">
              {this.calculateLifetime() > 0 && (
                <div className="kv-wrapper">
                  <div className="key">Lifetime</div>
                  <div className="value">{this.calculateLifetime()}m</div>
                </div>
              )}
              <div className="kv-wrapper">
                <div className="key">Interval</div>
                <div className="value">{request.analysisIntervalMins}m</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Delay</div>
                <div className="value">{request.beginAfterMins}m</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Step</div>
                <div className="value">{scope.step}s</div>
              </div>
            </div>
          </div>
        </div>

        <div className="message-wrapper">
          <div className="message">{result.canaryScoreMessage}</div>
        </div>
        <div className="meter-container">
          <Meter
            classification={result.didPassThresholds}
            score={result.canaryScores ? result.canaryScores[last] : 0}
            marginal={request.thresholds.marginal}
            pass={request.thresholds.pass}
          />
        </div>
      </div>
    );
  }
}
