import * as React from 'react';
import { CanaryConfig, CanaryExecutionRequest } from '../../../domain/Kayenta';
import './CanaryMetadataSection.scss';
import { Button } from 'react-bootstrap';

interface Props {
  application: string;
  canaryConfig: CanaryConfig;
  executionRequest: CanaryExecutionRequest;
  handleGoToConfigButtonClick: (config: CanaryConfig, canaryExecutionRequestObject: CanaryExecutionRequest) => void;
}

export default class CanaryMetadataSection extends React.Component<Props> {
  render(): React.ReactNode {
    const { application, canaryConfig, executionRequest, handleGoToConfigButtonClick } = this.props;

    const localTimeZone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];

    return (
      <div className="metadata-section">
        <div className="metadata-columns">
          <div className="metadata-column">
            <div className="metadata-column-content">
              <div className="column-title-wrapper">
                <div className="column-title">Canary Execution</div>
              </div>
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

          <div className="metadata-column">
            <div className="metadata-column-content">
              <div className="column-title-wrapper">
                <div className="column-title">Baseline</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Scope</div>
                <div className="value">{executionRequest.scopes.default.controlScope.scope}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Location</div>
                <div className="value">{executionRequest.scopes.default.controlScope.location}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Start</div>
                <div className="value">
                  {new Date(executionRequest.scopes.default.controlScope.start).toLocaleString()} {localTimeZone}
                </div>
              </div>
              <div className="kv-wrapper">
                <div className="key"></div>
                <div className="value">{executionRequest.scopes.default.controlScope.start}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">End</div>
                <div className="value">
                  {new Date(executionRequest.scopes.default.controlScope.end).toLocaleString()} {localTimeZone}
                </div>
              </div>
              <div className="kv-wrapper">
                <div className="key"></div>
                <div className="value">{executionRequest.scopes.default.controlScope.end}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Step (s)</div>
                <div className="value">{executionRequest.scopes.default.controlScope.step}</div>
              </div>
            </div>
          </div>

          <div className="metadata-column">
            <div className="metadata-column-content">
              <div className="column-title-wrapper">
                <div className="column-title">Canary</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Scope</div>
                <div className="value">{executionRequest.scopes.default.experimentScope.scope}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Location</div>
                <div className="value">{executionRequest.scopes.default.experimentScope.location}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Start</div>
                <div className="value">
                  {new Date(executionRequest.scopes.default.experimentScope.start).toLocaleString()} {localTimeZone}
                </div>
              </div>
              <div className="kv-wrapper">
                <div className="key"></div>
                <div className="value">{executionRequest.scopes.default.experimentScope.start}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">End</div>
                <div className="value">
                  {new Date(executionRequest.scopes.default.experimentScope.end).toLocaleString()} {localTimeZone}
                </div>
              </div>
              <div className="kv-wrapper">
                <div className="key"></div>
                <div className="value">{executionRequest.scopes.default.experimentScope.end}</div>
              </div>
              <div className="kv-wrapper">
                <div className="key">Step (s)</div>
                <div className="value">{executionRequest.scopes.default.experimentScope.step}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
