import * as React from 'react';
import { connect, ConnectedComponent } from '../../connectedComponent';
import { RouteComponentProps } from 'react-router';
import { CanaryExecutionStatusResponse } from '../../../domain/Kayenta';
import CanaryExecutorStore from '../../../stores/CanaryExecutorStore';
import { kayentaApiService } from '../../../services';
import OptionalUtils from '../../../util/OptionalUtils';
import Optional from 'optional-js';
import CanaryReport from './CanaryReport';

interface CanaryReportViewerPathParams {
  executionId: string;
}

interface Props extends RouteComponentProps<CanaryReportViewerPathParams> {}

interface Stores {
  canaryExecutorStore: CanaryExecutorStore;
}

interface State {
  canaryExecutionStatusResponse?: CanaryExecutionStatusResponse;
}

/**
 * The smart top level component for viewing a report of the /canary results.
 */
@connect('canaryExecutorStore')
export default class CanaryReportViewer extends ConnectedComponent<Props, Stores, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {};
  }

  async componentDidMount(): Promise<void> {
    if (this.stores.canaryExecutorStore.canaryExecutionStatusResponse) {
      this.setState({
        canaryExecutionStatusResponse: this.stores.canaryExecutorStore.canaryExecutionStatusResponse
      });
    } else {
      const executionId = this.props.match.params.executionId;
      this.setState({
        canaryExecutionStatusResponse: await kayentaApiService.fetchCanaryExecutionStatusResponse(executionId)
      });
    }
  }

  render(): React.ReactNode {
    return OptionalUtils.mapIfPresentOrElse(
      Optional.ofNullable(this.state.canaryExecutionStatusResponse),
      canaryExecutionStatusResponse => <CanaryReport canaryExecutionStatusResponse={canaryExecutionStatusResponse} />,
      () => <div>SPINNER HERE</div> // TODO
    );
  }
}
