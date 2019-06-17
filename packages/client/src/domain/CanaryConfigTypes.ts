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
  templates: { [key: string]: string };
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
  judgeConfigurations: { [key: string]: any };
}

export interface SignalFxCanaryMetricSetQueryConfig extends CanaryMetricSetQueryConfig {
  metricName: string;
  aggregationMethod: string;
  queryPairs?: KvPair[];
}

export interface KvPair {
  key: string;
  value: string;
}
