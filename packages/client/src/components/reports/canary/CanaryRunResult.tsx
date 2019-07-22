import * as React from 'react';
import MetricGroups from './MetricGroups';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryExecutionRequest,
  CanaryJudgeGroupScore,
  CanaryResult,
  MetricSetPair
} from '../../../domain/Kayenta';
import CanaryMetadataSection from './CanaryMetadataSection';
import CanaryMetricsOverview from './CanaryMetricsOverview';
import './CanaryRunResult.scss';
import TitledSection from '../../../layout/titledSection';
import { observer } from 'mobx-react';

export const CanaryRunResult = observer(
  ({
    application,
    result,
    canaryConfig,
    thresholds,
    canaryAnalysisResultByIdMap,
    idListByMetricGroupNameMap,
    groupScoreByMetricGroupNameMap,
    metricSetPairsByIdMap,
    classificationCountMap,
    executionRequest,
    handleGoToConfigButtonClick
  }: {
    application: string;
    result: CanaryResult;
    canaryConfig: CanaryConfig;
    thresholds: CanaryClassifierThresholdsConfig;
    canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
    idListByMetricGroupNameMap: KvMap<string[]>;
    groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
    metricSetPairsByIdMap: KvMap<MetricSetPair>;
    classificationCountMap: Map<string, number>;
    executionRequest: CanaryExecutionRequest;
    handleGoToConfigButtonClick: (config: CanaryConfig, canaryExecutionRequestObject: CanaryExecutionRequest) => void;
  }): JSX.Element => {
    return (
      <div className="report-container">
        <div className="metadata-container">
          <TitledSection title="Canary Report" />
          <CanaryMetadataSection
            application={application}
            canaryConfig={canaryConfig}
            executionRequest={executionRequest}
            handleGoToConfigButtonClick={handleGoToConfigButtonClick}
          />
        </div>
        <div className="metrics-overview-container">
          <MetricGroups
            config={canaryConfig}
            metricSetPairsByIdMap={metricSetPairsByIdMap}
            canaryAnalysisResultByIdMap={canaryAnalysisResultByIdMap}
            idListByMetricGroupNameMap={idListByMetricGroupNameMap}
            groupScoreByMetricGroupNameMap={groupScoreByMetricGroupNameMap}
            thresholds={thresholds}
            classificationCountMap={classificationCountMap}
          />
          <CanaryMetricsOverview
            result={result}
            thresholds={thresholds}
            classificationCountMap={classificationCountMap}
          />
        </div>
      </div>
    );
  }
);
