export interface KayentaCredential {
  name: string;
  supportedTypes: string[];
  objects: any;
  metadata: any;
  type: string;
  recommendedLocations: string[];
  locations: string[];
}

export interface CanaryExecutionStatusResponse {
  application: string;
  configurationAccountName: string;
  storageAccountName: string;

  complete: boolean;
  status: string;
  exception: {};
  stageStatus: KvMap<string>;

  buildTimeIso: string;
  buildTimeMillis: number;
  startTimeIso: string;
  startTimeMillis: number;
  endTimeIso: string;
  endTimeMillis: number;

  canaryConfigId: string;
  config: CanaryConfig;
  canaryExecutionRequest: CanaryExecutionRequest;

  metricSetPairListId: string;
  parentPipelineExecutionId: string;
  pipelineId: string;
  result: CanaryResult;
}

export interface CanaryResult {
  canaryDuration: {
    nano: number;
    negative: boolean;
    seconds: number;
    units: {};
    zero: boolean;
  };
  judgeResult: {
    groupScores: CanaryJudgeGroupScore[];
    judgeName: string;
    results: CanaryAnalysisResult;
    score: CanaryJudgeScore;
  };
}

export interface CanaryJudgeGroupScore {
  classification: string;
  classificationReason: string;
  name: string;
  score: number;
}

export interface CanaryAnalysisResult {
  classification: string;
  classificationReason: string;
  id: string;
  name: string;
  critical: boolean;
  groups: [string];
  controlMetadata: {};
  experimentMetadata: {};
  resultMetadata: {};
  tags: KvMap<string>;
}

export interface CanaryJudgeScore {
  classification: string;
  classificationReason: string;
  score: number;
}

export interface CanaryExecutionResponse {
  canaryExecutionId: string;
}

export interface CanaryExecutionRequest {
  scopes: {
    default: {
      controlScope: CanaryScope;
      experimentScope: CanaryScope;
    };
  };
  thresholds: {
    marginal: number;
    pass: number;
  };
}

export interface CanaryScope {
  scope: string;
  location: string;
  step: number;
  start: string;
  end: string;
  extendedScopeParams: KvMap<string>;
}

export interface CanaryConfig {
  applications: string[];
  id?: string;
  createdTimestamp?: number;
  updatedTimestamp?: number;
  createdTimestampIso?: string;
  updatedTimestampIso?: string;
  name: string;
  description: string;
  configVersion: string;
  metrics: CanaryMetricConfig[];
  templates: KvMap<string>;
  classifier: CanaryClassifierConfig;
  judge: CanaryJudgeConfig;
}

export interface CanaryMetricConfig<T extends CanaryMetricSetQueryConfig = any> {
  name: string;
  query: T;
  groups: string[];
  analysisConfigurations: {
    canary: CanaryAnalysisConfiguration;
  };
  scopeName: string;
}

export interface CanaryAnalysisConfiguration {
  direction: string;
  nanStrategy?: string;
  critical?: boolean;
  mustHaveData?: boolean;
  effectSize?: CanaryMetricEffectSizeConfig;
}

export interface CanaryMetricSetQueryConfig {
  type: string;
  customInlineTemplate?: string;
  customFilterTemplate?: string;
}

export interface GroupWeights {
  [group: string]: number;
}

export interface CanaryClassifierConfig {
  groupWeights: GroupWeights;
}

export interface CanaryMetricEffectSizeConfig {
  allowedIncrease?: number;
  allowedDecrease?: number;
  criticalIncrease?: number;
  criticalDecrease?: number;
}

export interface CanaryJudgeConfig {
  name: string;
  judgeConfigurations: KvMap<any>;
}

export interface SignalFxCanaryMetricSetQueryConfig extends CanaryMetricSetQueryConfig {
  metricName: string;
  aggregationMethod: string;
  queryPairs?: KvPair[];
}
