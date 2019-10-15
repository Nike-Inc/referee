import { CanaryClassifierThresholdsConfig } from '../domain/Kayenta';

export function getClassFromScore(
  score: number,
  canaryScores: number[],
  scoreThresholds: CanaryClassifierThresholdsConfig,
  canaryRunIndex: number
) {
  const { pass, marginal } = scoreThresholds;
  const isLastCanaryExecution = canaryRunIndex + 1 === canaryScores.length;

  if (isLastCanaryExecution) {
    return score < pass ? 'fail' : 'pass';
  }
  return score >= pass ? 'pass' : score >= marginal ? 'marginal' : 'fail';
}

export function getGroupClassFromScore(score: number, scoreThresholds: CanaryClassifierThresholdsConfig) {
  const { pass } = scoreThresholds;
  return score >= pass ? 'pass' : 'fail';
}

export default {
  getClassFromScore,
  getGroupClassFromScore
};
