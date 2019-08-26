import * as React from 'react';
import { CanaryConfig, CanaryExecutionRequest } from '../../../domain/Kayenta';
import './CanaryMetadataSection.scss';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import { faHourglassEnd } from '@fortawesome/free-solid-svg-icons';
import ToggleableTimeStamp from '../../shared/ToggleableTimeStamp';

interface Props {
  application: string;
  metricsAccountName: string;
  storageAccountName: string;
  canaryConfig: CanaryConfig;
  executionRequest: CanaryExecutionRequest;
  handleGoToConfigButtonClick: (config: CanaryConfig, canaryExecutionRequestObject: CanaryExecutionRequest) => void;
}

export default class CanaryMetadataSection extends React.Component<Props> {
  render(): React.ReactNode {
    const {
      application,
      metricsAccountName,
      storageAccountName,
      canaryConfig,
      executionRequest,
      handleGoToConfigButtonClick
    } = this.props;

    return (
      <div className="canary-metadata-section">
        <div className="canary-metadata-column">
          <div className="canary-metadata-column-content">
            <div className="kv-wrapper">
              <div className="key">Application</div>
              <div className="value">{application}</div>
            </div>
            <div className="kv-wrapper">
              <div className="key">Test Type</div>
              {JSON.stringify(executionRequest.scopes.default.controlScope) ===
              JSON.stringify(executionRequest.scopes.default.experimentScope) ? (
                <div className="value">A-A</div>
              ) : (
                <div className="value">A-B</div>
              )}
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

        <div className="canary-metadata-column">
          <div className="canary-metadata-column-content">
            <div className="canary-column-title-wrapper">
              <div className="canary-column-title">Baseline</div>
            </div>
            <div className="scope-item-wrapper">
              <FontAwesomeIcon className="img layer-group" size="1x" color="black" icon={faLayerGroup} />
              <div className="value">{executionRequest.scopes.default.controlScope.scope}</div>
            </div>
            <div className="scope-item-wrapper">
              <FontAwesomeIcon className="img map-marker" size="lg" color="black" icon={faMapMarkerAlt} />
              <div className="value">{executionRequest.scopes.default.controlScope.location}</div>
            </div>
            <div className="scope-item-wrapper">
              <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassStart} />
              <ToggleableTimeStamp timeStamp={executionRequest.scopes.default.controlScope.start} />
            </div>
            <div className="scope-item-wrapper">
              <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassEnd} />
              <ToggleableTimeStamp timeStamp={executionRequest.scopes.default.controlScope.end} />
            </div>
          </div>
        </div>

        <div className="canary-metadata-column">
          <div className="canary-metadata-column-content">
            <div className="canary-column-title-wrapper">
              <div className="canary-column-title">Canary</div>
            </div>
            <div className="scope-item-wrapper">
              <FontAwesomeIcon className="img layer-group" size="1x" color="black" icon={faLayerGroup} />
              <div className="value">{executionRequest.scopes.default.experimentScope.scope}</div>
            </div>
            <div className="scope-item-wrapper">
              <FontAwesomeIcon className="img map-marker" size="lg" color="black" icon={faMapMarkerAlt} />
              <div className="value">{executionRequest.scopes.default.experimentScope.location}</div>
            </div>
            <div className="scope-item-wrapper">
              <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassStart} />
              <ToggleableTimeStamp timeStamp={executionRequest.scopes.default.experimentScope.start} />
            </div>
            <div className="scope-item-wrapper">
              <FontAwesomeIcon className="img hourglass" size="lg" color="black" icon={faHourglassEnd} />
              <ToggleableTimeStamp timeStamp={executionRequest.scopes.default.experimentScope.end} />
            </div>
          </div>
        </div>

        <div className="canary-metadata-column">
          <div className="number-label-card">
            <div className="label-value">Step</div>
            <div className="number-container">
              <div className="number-value">{executionRequest.scopes.default.controlScope.step}</div>
              <div className="number-unit">s</div>
            </div>
          </div>
          <div className="btn-wrapper">
            <Button
              onClick={() => {
                handleGoToConfigButtonClick(canaryConfig, executionRequest);
              }}
              variant="dark"
            >
              Go to Config
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
