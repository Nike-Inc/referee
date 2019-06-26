import * as React from 'react';
import { CanaryExecutionStatusResponse } from '../../../domain/Kayenta';
import './CanaryReport.scss';

interface Props {
  canaryExecutionStatusResponse: CanaryExecutionStatusResponse;
}

export default class CanaryReport extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <div className="report-container d-sm-flx flx-dir-sm-c">
        <pre>{JSON.stringify(this.props.canaryExecutionStatusResponse, null, 2)}</pre>
      </div>
    );
  }
}
