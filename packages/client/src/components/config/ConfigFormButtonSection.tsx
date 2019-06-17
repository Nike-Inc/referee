import * as React from 'react';
import { observer } from 'mobx-react';
import * as FileSaver from 'file-saver';
import { CanaryConfig } from '../../domain/CanaryConfigTypes';
import { Button } from 'react-bootstrap';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import './ConfigFormButtonSection.scss';

export const ConfigFormButtonSection = observer(
  ({
    canaryConfig,
    hasTheCopyOrSaveButtonBeenClicked,
    isCanaryConfigValid,
    markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue
  }: {
    canaryConfig: CanaryConfig;
    hasTheCopyOrSaveButtonBeenClicked: boolean;
    isCanaryConfigValid: boolean;
    markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue: () => void;
  }): JSX.Element => {
    return (
      <div className="config-form-button-section">
        <div className="btn-wrapper">
          <CopyToClipboard text={JSON.stringify(canaryConfig, null, 2)}>
            <Button
              disabled={hasTheCopyOrSaveButtonBeenClicked && !isCanaryConfigValid}
              onClick={() => {
                markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue();
              }}
              variant="dark"
            >
              Copy JSON to Clipboard
            </Button>
          </CopyToClipboard>
          <Button
            disabled={hasTheCopyOrSaveButtonBeenClicked && !isCanaryConfigValid}
            variant="dark"
            onClick={() => {
              markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue();
              if (!isCanaryConfigValid) {
                return;
              }
              const blob = new Blob([JSON.stringify(canaryConfig, null, 2)], { type: 'text/plain;charset=utf-8' });
              const fileName = `${canaryConfig.name.replace(/[\W]/g, '-')}.json`;
              FileSaver.saveAs(blob, fileName);
            }}
          >
            Save as File
          </Button>
        </div>
      </div>
    );
  }
);
