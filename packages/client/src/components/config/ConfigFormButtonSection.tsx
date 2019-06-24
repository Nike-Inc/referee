import * as React from 'react';
import { observer } from 'mobx-react';
import * as FileSaver from 'file-saver';
import { Button } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './ConfigFormButtonSection.scss';
import ConfigEditorStore from '../../stores/ConfigEditorStore';
import { RouterProps } from 'react-router';
import { connect, ConnectedComponent } from '../connectedComponent';

interface Stores {
  configEditorStore: ConfigEditorStore;
}

interface Props extends RouterProps {}

@connect('configEditorStore')
@observer
export default class ConfigFormButtonSection extends ConnectedComponent<Props, Stores> {
  render(): React.ReactNode {
    const {
      canaryConfigObject,
      hasTheCopyOrSaveButtonBeenClicked,
      isCanaryConfigValid,
      markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue
    } = this.stores.configEditorStore;

    return (
      <div className="config-form-button-section">
        <div className="btn-wrapper">
          <CopyToClipboard text={JSON.stringify(canaryConfigObject, null, 2)}>
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
              const blob = new Blob([JSON.stringify(canaryConfigObject, null, 2)], {
                type: 'text/plain;charset=utf-8'
              });
              const fileName = `${canaryConfigObject.name.replace(/[\W]/g, '-')}.json`;
              FileSaver.saveAs(blob, fileName);
            }}
          >
            Save as File
          </Button>
          <Button
            disabled={hasTheCopyOrSaveButtonBeenClicked && !isCanaryConfigValid}
            onClick={() => {
              markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue();
              if (!isCanaryConfigValid) {
                return;
              }
              this.props.history.push('/dev-tools/canary-executor/setup');
            }}
            variant="dark"
          >
            Test Config
          </Button>
        </div>
      </div>
    );
  }
}
