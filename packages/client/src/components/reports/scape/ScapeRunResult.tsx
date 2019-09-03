import * as React from 'react';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryJudgeGroupScore,
  CanaryResult,
  MetricSetPair
} from '../../../domain/Kayenta';
import MetricsNavPanel from '../../shared/MetricsNavPanel';
import IndividualMetricView from '../../shared/IndividualMetricView';
import './ScapeRunResult.scss';
import { observer } from 'mobx-react';
import CanaryMetricsOverview from '../canary/CanaryMetricsOverview';

export const ScapeRunResult = observer(
  ({
    application,
    user,
    metricSourceType,
    metricsAccountName,
    storageAccountName,
    thresholds,
    result,
    canaryConfig,
    selectedMetric,
    canaryAnalysisResultByIdMap,
    idListByMetricGroupNameMap,
    groupScoreByMetricGroupNameMap,
    metricSetPairsByIdMap,
    classificationCountMap,
    metricGroupNamesDescByWeight,
    displayMetricOverview,
    handleOverviewSelection,
    handleMetricSelection
  }: {
    application: string;
    user: string;
    metricSourceType: string;
    metricsAccountName: string;
    storageAccountName: string;
    thresholds: CanaryClassifierThresholdsConfig;
    result: CanaryResult;
    canaryConfig: CanaryConfig;
    selectedMetric: string;
    canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
    idListByMetricGroupNameMap: KvMap<string[]>;
    groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
    metricSetPairsByIdMap: KvMap<MetricSetPair>;
    classificationCountMap: Map<string, number>;
    metricGroupNamesDescByWeight: string[];
    displayMetricOverview: boolean;
    handleOverviewSelection: () => void;
    handleMetricSelection: (id: string) => void;
  }): JSX.Element => {
    return (
      <div className="scape-metrics-overview-container">
        <div className="scape-metrics-overview-content">
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
    );
  }
);
