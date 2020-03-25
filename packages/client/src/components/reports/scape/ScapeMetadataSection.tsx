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
  applicationMetadata: KvMap<string>;
  metricsAccountName: string;
  storageAccountName: string;
  startTime: string;
  endTime: string;
  lifetime: number;
  request: CanaryAnalysisExecutionRequest;
  scope: CanaryAnalysisExecutionRequestScope;
  canaryConfig: CanaryConfig;
  handleGoToConfigButtonClick: (config: CanaryConfig) => void;
}

enum time {
  IN_PROGRESS = 'in-progress'
}

export default class ScapeMetadataSection extends React.Component<Props> {
  render(): React.ReactNode {
    const {
      application,
      user,
      applicationMetadata,
      metricsAccountName,
      storageAccountName,
      startTime,
      endTime,
      lifetime,
      request,
      scope,
      canaryConfig,
      handleGoToConfigButtonClick
    } = this.props;

    return (
      <div className="scape-metadata-section">
        <div className="scape-metadata-column">
          <div className="scape-metadata-properties-columns">
            <div className="scape-metadata-properties-column">
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
            {applicationMetadata && (
              <div className="scape-metadata-properties-column">
                {applicationMetadata['environment'] && (
                  <div className="kv-wrapper">
                    <div className="key">Environment</div>
                    <div className="value">{applicationMetadata['environment']}</div>
                  </div>
                )}
                {applicationMetadata['domain'] && (
                  <div className="kv-wrapper">
                    <div className="key">Domain</div>
                    <div className="value">{applicationMetadata['domain']}</div>
                  </div>
                )}
                {applicationMetadata['department'] && (
                  <div className="kv-wrapper">
                    <div className="key">Department</div>
                    <div className="value">{applicationMetadata['department']}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="scape-metadata-column">
          <div className="scape-metadata-row">
            <div className="scape-metadata-row-items">
              <div className="scape-metadata-row-content">
                <div className="title">Baseline</div>
                <div className="scope-item-wrapper">
                  <FontAwesomeIcon className="img layer-group" size="1x" color="black" icon={faLayerGroup} />
                  <div className="value">{scope.controlScope}</div>
                </div>
                <div className="scope-item-wrapper">
                  <FontAwesomeIcon className="img map-marker" size="lg" color="black" icon={faMapMarkerAlt} />
                  <div className="value">{scope.controlLocation}</div>
                </div>
              </div>
              <div className="scape-metadata-row-content">
                <div className="title">Canary</div>
                <div className="scope-item-wrapper">
                  <FontAwesomeIcon className="img layer-group" size="1x" color="black" icon={faLayerGroup} />
                  <div className="value">{scope.experimentScope}</div>
                </div>
                <div className="scope-item-wrapper">
                  <FontAwesomeIcon className="img map-marker" size="lg" color="black" icon={faMapMarkerAlt} />
                  <div className="value">{scope.experimentLocation}</div>
                </div>
              </div>
              <div className="scape-metadata-row-content">
                <div className="title">Time</div>
                <div className="scope-item-wrapper timestamp-min-width">
                  <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassStart} />
                  <ToggleableTimeStamp timeStamp={scope.startTimeIso ? scope.startTimeIso : startTime} />
                </div>
                <div className="scope-item-wrapper timestamp-min-width">
                  <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassEnd} />
                  {endTime === time.IN_PROGRESS ? (
                    'In Progress'
                  ) : (
                    <ToggleableTimeStamp timeStamp={scope.endTimeIso ? scope.endTimeIso : endTime} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="scape-metadata-row">
            <div className="scape-metadata-number-cards">
              {lifetime > 0 && (
                <div className="number-label-card">
                  <div className="label-value">Lifetime</div>
                  <div className="number-container">
                    <div className="number-value">{lifetime}</div>
                    <div className="number-unit">m</div>
                  </div>
                </div>
              )}
              <div className="number-label-card">
                <div className="label-value">Interval</div>
                <div className="number-container">
                  <div className="number-value">{request.analysisIntervalMins}</div>
                  <div className="number-unit">m</div>
                </div>
              </div>
              <div className="number-label-card">
                <div className="label-value">Delay</div>
                <div className="number-container">
                  <div className="number-value">{request.beginAfterMins}</div>
                  <div className="number-unit">m</div>
                </div>
              </div>

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
      </div>
    );
  }
}
