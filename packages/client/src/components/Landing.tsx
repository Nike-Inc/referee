import * as React from 'react';
import { RouterProps } from 'react-router';

import './Landing.scss';

export default class Landing extends React.Component<RouterProps> {
  public render(): React.ReactNode {
    return (
      <div className="landing-content">
        <div className="welcome-message">
          <h3>Welcome to the Referee Dashboard</h3>
          <p>
            Referee is a set of tools to create a complete user experience for using Spinnaker Kayenta as a standalone
            service.
            <br />
            You can use the Referee UI to create, edit, test and iterate Kayenta canary config.
            <br />
            You can also use the Referee UI to browse and view canary and standalone canary analysis results (coming
            soon™).
          </p>
        </div>
      </div>
    );
  }
}
