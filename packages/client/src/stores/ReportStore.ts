import { observable, action, computed } from 'mobx';
import {
  CanaryAnalysisExecutionRequest,
  CanaryAnalysisExecutionResult,
  CanaryAnalysisExecutionStatusResponse,
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryExecutionRequest,
  CanaryExecutionResult,
  CanaryExecutionStatusResponse,
  CanaryJudgeGroupScore,
  CanaryResult,
  MetricSetPair
} from '../domain/Kayenta';
import { ofNullable, safeGet } from '../util/OptionalUtils';

enum classifications {
  FAIL = 'Fail',
  NODATA = 'Nodata',
  PASS = 'Pass',
  HIGH = 'High',
  LOW = 'Low'
}

export default class ReportStore {
  @observable
  application: string = '';

  @observable
  user: string = '';

  @observable
  metricsAccountName: string = '';

  @observable
  storageAccountName: string = '';

  @observable
  canaryResult: CanaryResult = {};

  @observable
  scapeResults: CanaryAnalysisExecutionResult | undefined;

  @observable
  thresholds: CanaryClassifierThresholdsConfig | undefined;

  @observable
  canaryExecutionResultByIdMap: KvMap<CanaryExecutionResult> = {};

  @observable
  metricSetPairListId: string = '';

  @observable
  metricSetPairList: MetricSetPair[] = [];

  @observable
  canaryExecutionStatusResponse: CanaryExecutionStatusResponse | undefined;

  @observable
  scapeExecutionStatusResponse: CanaryAnalysisExecutionStatusResponse | undefined;

  @observable
  scapeExecutionRequest: CanaryAnalysisExecutionRequest | undefined;

  @observable
  selectedCanaryExecutionResult: CanaryExecutionResult | undefined;

  @observable
  selectedMetric: string = '';

  @observable
  displayMetricOverview: boolean = true;

  @action.bound
  updateFromCanaryResponse(canaryExecutionStatusResponse: CanaryExecutionStatusResponse) {
    this.canaryExecutionStatusResponse = canaryExecutionStatusResponse;
    this.canaryResult = canaryExecutionStatusResponse.result as CanaryResult;
    this.thresholds = (canaryExecutionStatusResponse.canaryExecutionRequest as CanaryExecutionRequest).thresholds;
    this.metricSetPairListId = canaryExecutionStatusResponse.metricSetPairListId as string;
  }

  @action.bound
  updateFromScapeResponse(scapeExecutionStatusResponse: CanaryAnalysisExecutionStatusResponse) {
    this.scapeExecutionStatusResponse = scapeExecutionStatusResponse;
    this.scapeResults = scapeExecutionStatusResponse.canaryAnalysisExecutionResult as CanaryAnalysisExecutionResult;
    this.scapeExecutionRequest = scapeExecutionStatusResponse.canaryAnalysisExecutionRequest as CanaryAnalysisExecutionRequest;

    safeGet(() => this.scapeResults).ifPresent(results => {
      const lastRun = results.canaryScores.length - 1;
      this.selectedCanaryExecutionResult = results.canaryExecutionResults[lastRun];
      this.canaryResult = this.selectedCanaryExecutionResult.result;
      this.metricSetPairListId = this.selectedCanaryExecutionResult.metricSetPairListId as string;
    });

    safeGet(() => this.scapeExecutionRequest).ifPresent(request => {
      this.thresholds = request.thresholds;
    });
  }

  @computed
  get canaryAnalysisResultByIdMap(): KvMap<CanaryAnalysisResult> {
    const canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult> = {};

    safeGet(() => this.canaryResult.judgeResult!.results).ifPresent(results => {
      results.forEach((canaryAnalysisResult: CanaryAnalysisResult) => {
        canaryAnalysisResultByIdMap[canaryAnalysisResult.id] = canaryAnalysisResult;
      });
    });

    return canaryAnalysisResultByIdMap;
  }

  @computed
  get idListByMetricGroupNameMap(): KvMap<string[]> {
    const idListByMetricGroupNameMap: KvMap<string[]> = {};

    safeGet(() => this.canaryResult.judgeResult!.results).ifPresent(results => {
      results.forEach(canaryAnalysisResult => {
        canaryAnalysisResult.groups.forEach(group => {
          if (idListByMetricGroupNameMap[group]) {
            idListByMetricGroupNameMap[group].push(canaryAnalysisResult.id);
          } else {
            idListByMetricGroupNameMap[group] = [canaryAnalysisResult.id];
          }
        });
      });
    });

    return idListByMetricGroupNameMap;
  }

  @computed
  get groupScoreByMetricGroupNameMap(): KvMap<CanaryJudgeGroupScore> {
    const groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore> = {};

    safeGet(() => this.canaryResult.judgeResult!.groupScores).ifPresent(groupScores => {
      groupScores.forEach(groupScore => (groupScoreByMetricGroupNameMap[groupScore.name] = groupScore));
    });

    return groupScoreByMetricGroupNameMap;
  }

  @computed
  get metricSetPairsByIdMap(): KvMap<MetricSetPair> {
    const metricSetPairsByIdMap: KvMap<MetricSetPair> = {};
    this.metricSetPairList.forEach(metricSetPair => {
      metricSetPairsByIdMap[metricSetPair.id] = metricSetPair;
    });

    return metricSetPairsByIdMap;
  }

  @computed
  get classificationCountMap(): Map<string, number> {
    const classificationCountMap = new Map();
    classificationCountMap.set(classifications.FAIL, 0);
    classificationCountMap.set(classifications.NODATA, 0);
    classificationCountMap.set(classifications.PASS, 0);

    Object.entries(this.canaryAnalysisResultByIdMap).map(id => {
      let label;
      if (id[1].classification === classifications.HIGH || id[1].classification === classifications.LOW) {
        label = classifications.FAIL;
      } else {
        label = id[1].classification;
      }
      let current = classificationCountMap.get(label);
      current++;
      classificationCountMap.set(label, current);
    });

    return classificationCountMap;
  }

  @action.bound
  setMetricSetPairList(metricSetPairList: MetricSetPair[]) {
    this.metricSetPairList = metricSetPairList;
  }

  @action.bound
  handleOverviewSelection() {
    this.displayMetricOverview = true;
  }

  @action.bound
  handleMetricSelection(id: string) {
    this.selectedMetric = id;
    this.displayMetricOverview = false;
  }

  @action.bound
  handleCanaryRunSelection(canaryExecutionResult: CanaryExecutionResult) {
    this.selectedCanaryExecutionResult = canaryExecutionResult;
    this.displayMetricOverview = true;
  }
}
