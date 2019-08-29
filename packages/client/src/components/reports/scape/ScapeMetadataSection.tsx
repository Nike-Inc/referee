import * as React from 'react';
import {
  CanaryAnalysisExecutionRequest,
  CanaryAnalysisExecutionRequestScope,
  CanaryConfig
} from '../../../domain/Kayenta';
import './ScapeMetadataSection.scss';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassEnd, faHourglassStart, faLayerGroup, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ToggleableTimeStamp from '../../shared/ToggleableTimeStamp';

interface Props {
  application: string;
  user: string;
  metricsAccountName: string;
  storageAccountName: string;
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
      metricsAccountName,
      storageAccountName,
      request,
      scope,
      canaryConfig,
      handleGoToConfigButtonClick
    } = this.props;

    return (
      <div className="scape-metadata-section">
        <div className="scape-metadata-row">
          <div className="scape-metadata-column">
            <div className="scape-metadata-column-content">
              <div className="kv-wrapper">
                <div className="key">Application</div>
                <div className="value">{application}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">User</div>
                <div className="value">{user}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Metrics Account</div>
                <div className="value">{metricsAccountName}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Storage Account</div>
                <div className="value">{storageAccountName}</div>
              </div>
            </div>
          </div>
          <div className="scape-metadata-column">
            <div className="scape-metadata-column-content">
              <div className="kv-wrapper">
                <div className="key">Baseline</div>
              </div>
              <div className="scope-item-wrapper">
                <FontAwesomeIcon className="img layer-group" size="1x" color="black" icon={faLayerGroup} />
                <div className="value">{scope.controlScope}</div>
              </div>
              <div className="scope-item-wrapper">
                <FontAwesomeIcon className="img map-marker" size="lg" color="black" icon={faMapMarkerAlt} />
                <div className="value">{scope.controlLocation}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Canary</div>
              </div>
              <div className="scope-item-wrapper">
                <FontAwesomeIcon className="img layer-group" size="1x" color="black" icon={faLayerGroup} />
                <div className="value">{scope.experimentScope}</div>
              </div>
              <div className="scope-item-wrapper">
                <FontAwesomeIcon className="img map-marker" size="lg" color="black" icon={faMapMarkerAlt} />
                <div className="value">{scope.experimentLocation}</div>
              </div>
              <div className="kv-wrapper"></div>
              <div className="scope-item-wrapper">
                <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassStart} />
                <ToggleableTimeStamp timeStamp={scope.startTimeIso} />
              </div>
              <div className="scope-item-wrapper">
                <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassEnd} />
                <ToggleableTimeStamp timeStamp={scope.endTimeIso} />
              </div>
            </div>
          </div>
        </div>
        <div className="scape-metadata-row">
          <div className="scape-metadata-column">
            {this.calculateLifetime() > 0 && (
              <div className="number-label-card">
                <div className="label-value">Lifetime</div>
                <div className="number-container">
                  <div className="number-value">{this.calculateLifetime()}</div>
                  <div className="number-unit">m</div>
                </div>
              </div>
            )}
          </div>
          <div className="scape-metadata-column">
            <div className="number-label-card">
              <div className="label-value">Interval</div>
              <div className="number-container">
                <div className="number-value">{request.analysisIntervalMins}</div>
                <div className="number-unit">m</div>
              </div>
            </div>
          </div>
          <div className="scape-metadata-column">
            <div className="number-label-card">
              <div className="label-value">Delay</div>
              <div className="number-container">
                <div className="number-value">{request.beginAfterMins}</div>
                <div className="number-unit">m</div>
              </div>
            </div>
          </div>
          <div className="scape-metadata-column">
            <div className="number-label-card">
              <div className="label-value">Step</div>
              <div className="number-container">
                <div className="number-value">{scope.step}</div>
                <div className="number-unit">s</div>
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
        </div>
      </div>
    );
  }
}
