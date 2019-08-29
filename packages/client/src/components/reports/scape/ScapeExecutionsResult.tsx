import * as React from 'react';
import {
  CanaryAnalysisExecutionRequest,
  CanaryAnalysisExecutionRequestScope,
  CanaryConfig
} from '../../../domain/Kayenta';
import ScapeMetadataSection from './ScapeMetadataSection';
import { safeGet } from '../../../util/OptionalUtils';

interface Props {
  application: string;
  user: string;
  metricsAccountName: string;
  storageAccountName: string;
  request: CanaryAnalysisExecutionRequest;
  canaryConfig: CanaryConfig;
  handleGoToConfigButtonClick: (config: CanaryConfig) => void;
}

export default class ScapeExecutionsResult extends React.Component<Props> {
  render(): React.ReactNode {
    const {
      application,
      user,
      metricsAccountName,
      storageAccountName,
      request,
      canaryConfig,
      handleGoToConfigButtonClick
    } = this.props;

    return (
      <div className="report-container">
        <ScapeMetadataSection
          application={application as string}
          user={user as string}
          metricsAccountName={metricsAccountName as string}
          storageAccountName={storageAccountName as string}
          request={request as CanaryAnalysisExecutionRequest}
          scope={safeGet(() => request.scopes[0]).get() as CanaryAnalysisExecutionRequestScope}
          canaryConfig={canaryConfig as CanaryConfig}
          handleGoToConfigButtonClick={handleGoToConfigButtonClick}
        />
      </div>
    );
  }
}
