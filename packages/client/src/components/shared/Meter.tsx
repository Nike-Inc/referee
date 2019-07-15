import * as React from 'react';
import classNames from 'classnames';
import './Meter.scss';
import { observer } from 'mobx-react';

const DEFAULT_CANARY_SCORE_DISPLAY = '1';

export const Meter = observer(
  ({
    classification,
    score,
    marginal,
    pass
  }: {
    classification: boolean;
    score: number;
    marginal: number;
    pass: number;
  }): JSX.Element => {
    let meterStyle = {
      width: `${DEFAULT_CANARY_SCORE_DISPLAY}%`
    };
    if (score > 0) {
      meterStyle = {
        width: `${score}%`
      };
    }

    const marginalLineStyle = {
      left: `${marginal}%`
    };
    const passLineStyle = {
      left: `${pass}%`
    };

    return (
      <div className="meter-wrapper">
        <div
          className={classNames('meter', {
            pass: classification,
            fail: !classification
          })}
          style={meterStyle}
        />
        <div className="marginal-line" style={marginalLineStyle}>
          <div className="threshold-label headline-md-base">{marginal}</div>
        </div>
        <div className="pass-line" style={passLineStyle}>
          <div className="threshold-label headline-md-base">{pass}</div>
        </div>
      </div>
    );
  }
);
