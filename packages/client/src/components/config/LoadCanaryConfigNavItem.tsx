import * as React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { CanaryConfig } from '../../domain/Kayenta';
import { boundMethod } from 'autobind-decorator';
import log from '../../util/LoggerFactory';
import { EVENT, trackEvent } from '../../util/MetricUtils';
import { safeGet } from '../../util/OptionalUtils';

interface Props {
  onLoad: (config: CanaryConfig) => void;
  onError: (error: any) => void;
}

export default class LoadCanaryConfigNavItem extends React.Component<Props> {
  private fileInput: any;
  private fileReader = new FileReader();

  constructor(props: Props) {
    super(props);
    this.fileInput = React.createRef();
    this.fileReader.onloadend = () => {
      this.onFileLoad();
    };
  }

  @boundMethod
  private handleClick(): void {
    this.fileInput.click();
  }

  @boundMethod
  private handleFileSelect(event: any, onLoad: (config: CanaryConfig) => void, onError: (error: any) => void): void {
    const file = event.target.files[0];
    log.info(`Processing file: ${file ? file.name : 'unknown'}`);
    try {
      this.fileReader.readAsText(file);
    } catch (e) {
      onError(e);
    }
  }

  @boundMethod
  private onFileLoad(): void {
    // todo, when will this be a buffer instead of a string? We need to maybe validate that
    const unvalidatedJsonObject = JSON.parse(this.fileReader.result as any);
    // TODO validate that json is config
    this.props.onLoad(unvalidatedJsonObject);
    trackEvent(EVENT.LOAD_CONFIG, {
      source: 'file',
      name: safeGet(() => unvalidatedJsonObject.name).orElse('UNKNOWN')
    });
    alert('Successfully loaded canary config from file');
  }

  render(): React.ReactNode {
    const { onLoad, onError } = this.props;
    return (
      <div>
        <NavDropdown.Item onClick={this.handleClick}>Load Existing Kayenta Config from File</NavDropdown.Item>
        <input
          className="hidden"
          onChange={e => {
            this.handleFileSelect(e, onLoad, onError);
          }}
          ref={input => (this.fileInput = input)}
          type="file"
          accept=".json"
          id="file-input"
        />
      </div>
    );
  }
}
