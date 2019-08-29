import * as React from 'react';
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
import MetricsNavPanel from '../../shared/MetricsNavPanel';
import IndividualMetricView from '../../shared/IndividualMetricView';
import './CanaryRunResult.scss';
import TitledSection from '../../../layout/titledSection';
import { observer } from 'mobx-react';

export const CanaryRunResult = observer(
  ({
    application,
    metricSourceType,
    metricsAccountName,
    storageAccountName,
    result,
    canaryConfig,
    thresholds,
    selectedMetric,
    canaryAnalysisResultByIdMap,
    idListByMetricGroupNameMap,
    groupScoreByMetricGroupNameMap,
    metricSetPairsByIdMap,
    classificationCountMap,
    metricGroupNamesDescByWeight,
    executionRequest,
    displayMetricOverview,
    handleOverviewSelection,
    handleMetricSelection,
    handleGoToConfigButtonClick
  }: {
    application: string;
    metricSourceType: string;
    metricsAccountName: string;
    storageAccountName: string;
    result: CanaryResult;
    canaryConfig: CanaryConfig;
    thresholds: CanaryClassifierThresholdsConfig;
    selectedMetric: string;
    canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
    idListByMetricGroupNameMap: KvMap<string[]>;
    groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
    metricSetPairsByIdMap: KvMap<MetricSetPair>;
    classificationCountMap: Map<string, number>;
    metricGroupNamesDescByWeight: string[];
    executionRequest: CanaryExecutionRequest;
    displayMetricOverview: boolean;
    handleOverviewSelection: () => void;
    handleMetricSelection: (id: string) => void;
    handleGoToConfigButtonClick: (config: CanaryConfig, canaryExecutionRequestObject: CanaryExecutionRequest) => void;
  }): JSX.Element => {
    return (
      <div className="report-container">
        <div className="metadata-container">
          <TitledSection title="Canary Report" />
          <CanaryMetadataSection
            application={application}
            metricsAccountName={metricsAccountName}
            storageAccountName={storageAccountName}
            canaryConfig={canaryConfig}
            executionRequest={executionRequest}
            handleGoToConfigButtonClick={handleGoToConfigButtonClick}
          />
        </div>
        <div className="metrics-overview-container">
          <TitledSection title="Metrics" />
          <div className="metrics-overview-content">
            <MetricsNavPanel
              config={canaryConfig}
              metricSetPairsByIdMap={metricSetPairsByIdMap}
              canaryAnalysisResultByIdMap={canaryAnalysisResultByIdMap}
              idListByMetricGroupNameMap={idListByMetricGroupNameMap}
              groupScoreByMetricGroupNameMap={groupScoreByMetricGroupNameMap}
              metricGroupNamesDescByWeight={metricGroupNamesDescByWeight}
              thresholds={thresholds}
              classificationCountMap={classificationCountMap}
              selectedMetric={selectedMetric}
              displayMetricOverview={displayMetricOverview}
              handleOverviewSelection={handleOverviewSelection}
              handleMetricSelection={handleMetricSelection}
            />
            {displayMetricOverview ? (
              <CanaryMetricsOverview
                result={result}
                thresholds={thresholds}
                classificationCountMap={classificationCountMap}
              />
            ) : (
              <IndividualMetricView
                selectedMetric={selectedMetric}
                metricSourceType={metricSourceType}
                canaryAnalysisResultByIdMap={canaryAnalysisResultByIdMap}
                metricSetPairsByIdMap={metricSetPairsByIdMap}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);
