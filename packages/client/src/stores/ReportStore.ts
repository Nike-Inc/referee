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
import { safeGet } from '../util/OptionalUtils';

enum classifications {
  FAIL = 'Fail',
  NODATA = 'Nodata',
  PASS = 'Pass',
  HIGH = 'High',
  LOW = 'Low'
}

const MILLISECOND_CONVERSION = 1000;
const SEC_TO_MIN_CONVERSION = 60;

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
  metricSetPairListMap: KvMap<MetricSetPair[]> = {};

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

  @observable
  startTime: string = '';

  @observable
  endTime: string = '';

  @action.bound
  updateFromCanaryResponse(canaryExecutionStatusResponse: CanaryExecutionStatusResponse) {
    const request = canaryExecutionStatusResponse.canaryExecutionRequest as CanaryExecutionRequest;
    this.canaryExecutionStatusResponse = canaryExecutionStatusResponse;
    this.canaryResult = canaryExecutionStatusResponse.result as CanaryResult;
    this.thresholds = request.thresholds as CanaryClassifierThresholdsConfig;
    this.metricSetPairListId = canaryExecutionStatusResponse.metricSetPairListId as string;
    this.startTime = request.scopes.default.controlScope.start as string;
    this.endTime = request.scopes.default.controlScope.end as string;
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
      this.thresholds = request.thresholds as CanaryClassifierThresholdsConfig;
      this.startTime = safeGet(() => request.scopes[0]).get().startTimeIso as string;
      this.endTime = safeGet(() => request.scopes[0]).get().endTimeIso as string;
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
    let metricSetPairList: MetricSetPair[] = [];
    if (this.metricSetPairList) {
      metricSetPairList = this.metricSetPairList;
    } else {
      // TODO make sure this is the best way to check if the map is empty
      if (Object.keys(this.metricSetPairListMap).length > 0) {
        metricSetPairList = this.metricSetPairListMap[this.metricSetPairListId];
      }
    }

    const metricSetPairsByIdMap: KvMap<MetricSetPair> = {};
    metricSetPairList.forEach(metricSetPair => {
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

  @computed
  get lifetime(): number {
    if (this.endTime) {
      const startDate = new Date(this.startTime);
      const endDate = new Date(this.endTime);
      const diff = (endDate.getTime() - startDate.getTime()) / MILLISECOND_CONVERSION / SEC_TO_MIN_CONVERSION;
      return Math.abs(Math.round(diff));
    } else if (this.scapeExecutionRequest) {
      return this.scapeExecutionRequest.lifetimeDurationMins;
    } else return -1;
  }

  @action.bound
  setMetricSetPairList(metricSetPairList: MetricSetPair[]) {
    this.metricSetPairList = metricSetPairList;
  }

  @action.bound
  setMetricSetPairListMap(metricSetPairListMap: KvMap<MetricSetPair[]>) {
    this.metricSetPairListMap = metricSetPairListMap;
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
    this.metricSetPairListId = canaryExecutionResult.metricSetPairListId as string;
  }
}
