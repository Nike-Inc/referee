import { CanaryExecutionRequest } from './CanaryExecutionRequestTypes';
import { CanaryConfig } from './CanaryConfigTypes';
import { KvMap } from './CustomTypes';

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
    groupScores: CanaryJudgeGroupScore;
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
