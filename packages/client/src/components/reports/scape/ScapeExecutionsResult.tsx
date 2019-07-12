import * as React from 'react';
import {
  CanaryAnalysisExecutionRequest,
  CanaryAnalysisExecutionRequestScope,
  CanaryAnalysisExecutionResult,
  CanaryAnalysisExecutionStatusResponse,
  CanaryConfig
} from '../../../domain/Kayenta';
import { ofNullable, safeGet } from '../../../util/OptionalUtils';
import ScapeMetadataSection from './ScapeMetadataSection';

interface Props {
  executionStatusResponse: CanaryAnalysisExecutionStatusResponse;
  canaryConfig: CanaryConfig;
  handleGoToConfigButtonClick: (config: CanaryConfig) => void;
}

interface State {
  application: string;
  user: string;
  result: CanaryAnalysisExecutionResult;
  scope: CanaryAnalysisExecutionRequestScope;
}

export default class ScapeExecutionsResult extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    const application = ofNullable(this.props.executionStatusResponse.application).orElse('ad-hoc');
    const user = ofNullable(this.props.executionStatusResponse.user).orElse('anonymous');

    const result = ofNullable(this.props.executionStatusResponse.canaryAnalysisExecutionResult).orElseThrow(
      () => new Error('Expected judgement results on the Canary Analysis Execution Result object')
    );

    const scope = safeGet(() => this.props.executionStatusResponse.canaryAnalysisExecutionRequest!.scopes[0]).get();

    this.state = {
      application,
      user,
      result,
      scope
    };
  }

  render(): React.ReactNode {
    const { application, user, result, scope } = this.state;

    const { executionStatusResponse, canaryConfig, handleGoToConfigButtonClick } = this.props;

    return (
      <div className="report-container">
        <ScapeMetadataSection
          application={application as string}
          user={user as string}
          result={result as CanaryAnalysisExecutionResult}
          request={executionStatusResponse.canaryAnalysisExecutionRequest as CanaryAnalysisExecutionRequest}
          scope={scope as CanaryAnalysisExecutionRequestScope}
          canaryConfig={canaryConfig as CanaryConfig}
          handleGoToConfigButtonClick={handleGoToConfigButtonClick}
        />
      </div>
    );
  }
}
