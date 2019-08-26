import * as React from 'react';
import './ToggleableTimeStamp.scss';
import { boundMethod } from 'autobind-decorator';
import { Button } from 'react-bootstrap';

interface Props {
  timeStamp: string;
}

interface State {
  displayLocalTime: boolean;
}

export default class ToggleableTimeStamp extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    const displayLocalTime = true;
    this.state = {
      displayLocalTime
    };
  }

  @boundMethod
  setDisplayLocalTime(value: boolean): void {
    this.setState({ displayLocalTime: value });
  }

  render(): React.ReactNode {
    const { timeStamp } = this.props;

    return (
      <div className="toggleable-time-stamp-container">
        {this.state.displayLocalTime ? (
          <div className="local time-stamp">{new Date(timeStamp).toLocaleString()}</div>
        ) : (
          <div className="iso time-stamp">{timeStamp}</div>
        )}
        <div className="time-zone-container">
          <Button
            className="time-zone"
            variant={this.state.displayLocalTime ? 'dark' : 'dark'}
            bsPrefix={this.state.displayLocalTime ? 'btn-clicked' : 'btn-to-click'}
            disabled={this.state.displayLocalTime}
            onClick={() => this.setDisplayLocalTime(true)}
          >
            {new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]}
          </Button>
          <Button
            className="time-zone"
            variant={!this.state.displayLocalTime ? 'dark' : 'dark'}
            bsPrefix={!this.state.displayLocalTime ? 'btn-clicked' : 'btn-to-click'}
            disabled={!this.state.displayLocalTime}
            onClick={() => this.setDisplayLocalTime(false)}
          >
            ISO
          </Button>
        </div>
      </div>
    );
  }
}
