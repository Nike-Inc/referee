import * as React from 'react';
import { RouterProps } from 'react-router';

import './Landing.scss';

export default class Landing extends React.Component<RouterProps> {
  public render(): React.ReactNode {
    return (
      <div className="landing-content">
        <div className="welcome-message">
          <h3>Welcome to Referee</h3>
          <p>
            Referee is a user experience for using Spinnaker Kayenta as a standalone service.
            <br />
            Use Referee to create, edit and test canary config as well as view canary results.
          </p>
        </div>
      </div>
    );
  }
}
