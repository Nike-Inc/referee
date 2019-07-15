// Code from https://github.com/fedosejev/checkboxes-in-react-16
import * as React from 'react';
import { observer } from 'mobx-react';

export const Checkbox = observer(
  ({
    label,
    isSelected,
    onCheckboxChange
  }: {
    label: string;
    isSelected: boolean;
    onCheckboxChange: (value: any) => void;
  }): JSX.Element => {
    return (
      <div className="form-check">
        <label>
          <input
            type="checkbox"
            name={label}
            checked={isSelected}
            onChange={onCheckboxChange}
            className="form-check-input"
          />
          {label}
        </label>
      </div>
    );
  }
);
