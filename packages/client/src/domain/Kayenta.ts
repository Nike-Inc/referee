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
  application?: string;
  parentPipelineExecutionId?: string;
  pipelineId: string;
  stageStatus: KvMap<string>;
  complete: boolean;
  status: string;
  exception?: any;
  result?: CanaryResult;
  config?: CanaryConfig;
  canaryConfigId?: string;
  canaryExecutionRequest?: CanaryExecutionRequest;
  metricSetPairListId?: string;
  buildTimeIso?: string;
  buildTimeMillis?: number;
  startTimeIso?: string;
  startTimeMillis?: number;
  endTimeIso?: string;
  endTimeMillis?: number;
  configurationAccountName?: string;
  storageAccountName?: string;
}

export interface CanaryResult {
  judgeResult?: CanaryJudgeResult;
  canaryDuration?: string;
}

export interface CanaryJudgeResult {
  judgeName: string;
  results: CanaryAnalysisResult[];
  groupScores: CanaryJudgeGroupScore[];
  score: CanaryJudgeScore;
}

export interface CanaryJudgeGroupScore {
  classification: string;
  classificationReason: string;
  name: string;
  score: number;
}

export interface CanaryAnalysisResult {
  name: string;
  tags: KvMap<string>;
  id: string;
  classification: string;
  classificationReason: string;
  groups: [string];
  experimentMetadata: KvMap<any>;
  controlMetadata: KvMap<any>;
  resultMetadata: KvMap<any>;
  critical: boolean;
}

export interface CanaryJudgeScore {
  score: number;
  classification: string;
  classificationReason: string;
}

export interface CanaryExecutionResponse {
  canaryExecutionId: string;
}

export interface CanaryAdhocExecutionRequest {
  canaryConfig: CanaryConfig;
  executionRequest: CanaryExecutionRequest;
}

export interface CanaryExecutionRequest {
  scopes: KvMap<CanaryScopePair>;
  thresholds: CanaryClassifierThresholdsConfig;
  metadata?: Metadata[];
  siteLocal?: KvMap<any>;
}

export interface Metadata {
  name: string;
  value: string;
  hidden: boolean;
}

export interface CanaryClassifierThresholdsConfig {
  marginal: number;
  pass: number;
}

export interface CanaryScopePair {
  controlScope: CanaryScope;
  experimentScope: CanaryScope;
}

export interface CanaryScope {
  scope: string;
  location: string;
  step: number;
  start: string;
  end: string;
  extendedScopeParams?: KvMap<string>;
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

export interface MetricSetPair {
  name: string;
  id: string;
  tags: KvMap<string>;
  values: MetricSetPairData;
  scopes: MetricSetPairScopes;
  attributes: MetricSetPairAttributes;
}

export interface MetricSetPairData {
  control: number[];
  experiment: number[];
}

export interface MetricSetPairAttributes {
  control?: KvMap<string>;
  experiment?: KvMap<string>;
}

export interface MetricSetPairScopes {
  control: MetricSetScope;
  experiment: MetricSetScope;
}

export interface MetricSetScope {
  startTimeIso: string;
  startTimeMillis: number;
  stepMillis: number;
}

export interface CanaryAnalysisExecutionStatusResponse {
  application: string;
  user: string;
  parentPipelineExecutionId?: string;
  pipelineId: string;
  stageStatus: StageMetadata[];
  complete: boolean;
  executionStatus: string;
  status?: String;
  exception?: any;
  canaryAnalysisExecutionResult?: CanaryAnalysisExecutionResult;
  canaryAnalysisExecutionRequest?: CanaryAnalysisExecutionRequest;
  canaryConfig?: CanaryConfig;
  canaryConfigId?: string;
  buildTimeIso?: string;
  buildTimeMillis?: number;
  startTimeIso?: string;
  startTimeMillis?: number;
  endTimeIso?: string;
  endTimeMillis?: number;
}

export interface StageMetadata {
  type: string;
  name: string;
  status: string;
}

export interface CanaryAnalysisExecutionResult {
  didPassThresholds: boolean;
  hasWarnings: boolean;
  canaryScoreMessage: string;
  canaryScores: number[];
  canaryExecutionResults: CanaryExecutionResult[];
  buildTimeIso: string;
  startTimeIso: string;
  endTimeIso: string;
}

export interface CanaryExecutionResult {
  executionId: string;
  executionStatus: string;
  exception?: any;
  result: CanaryResult;
  judgementStartTimeIso: string;
  judgementStartTimeMillis: number;
  judgementEndTimeIso: string;
  judgementEndTimeMillis: number;
  warnings: string[];
  metricSetPairListId: string;
  buildTimeIso?: string;
  buildTimeMillis?: number;
  startTimeIso?: string;
  startTimeMillis?: number;
  endTimeIso?: string;
  endTimeMillis?: number;
  configurationAccountName?: string;
  storageAccountName?: string;
}

export interface CanaryAnalysisExecutionRequest {
  scopes: CanaryAnalysisExecutionRequestScope;
  thresholds: CanaryClassifierThresholdsConfig;
  lifetimeDurationMins: number;
  beginAfterMins: number;
  lookbackMins: number;
  analysisIntervalMins: number;
  siteLocal: KvMap<any>;
}

export interface CanaryAnalysisExecutionRequestScope {
  scopeName: string;
  controlScope: string;
  controlLocation: string;
  experimentScope: string;
  experimentLocation: string;
  startTimeIso: string;
  endTimeIso: string;
  step: number;
}
