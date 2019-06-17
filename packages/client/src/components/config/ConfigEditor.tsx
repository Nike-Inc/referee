import * as React from 'react';

import './ConfigEditor.scss';
import ConfigFormView from './ConfigFormView';
import { loadCanaryConfigService } from '../../services';

export default class ConfigEditor extends React.Component {
  async componentDidMount(): Promise<void> {
    await loadCanaryConfigService.loadCanaryFromTemplate();
  }

  render(): React.ReactNode {
    return (
      <div className="config-editor">
        <ConfigFormView />
      </div>
    );
  }
}
