import * as React from 'react';
import './TerminalResult.scss';
import { observer } from 'mobx-react';

interface TerminalResultProps {
  exception: any;
}

@observer
export default class TerminalResult extends React.Component<TerminalResultProps> {
  render(): React.ReactNode {
    const { stackTrace, error, errors } = this.props.exception.details;
    return (
      <div className="terminal-canary">
        <div className="main-error">{error}</div>
        <div className="stacktrace">
          {errors && (
            <div>
              <div className="stacktrace-label">Error</div>
              errors.map((error: string) => (<div>{error}</div>
              ))
            </div>
          )}
          {stackTrace && (
            <div>
              <div className="stacktrace-label">Stacktrace</div>
              <pre>{stackTrace}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }
}
