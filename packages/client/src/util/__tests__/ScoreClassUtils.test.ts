import { getClassFromScore, getGroupClassFromScore } from '../ScoreClassUtils';

describe('ScoreClassUtils getClassFromScore', () => {
  it('should get class from score and not be the last execution and return pass', () => {
    const score = 100;
    const canaryScores = [100, 100, 100];
    const scoreThresholds = { marginal: 70, pass: 90 };
    const canaryRunIndex = 1;
    const expectedClass = 'pass';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score and not be the last execution and return marginal', () => {
    const score = 80;
    const canaryScores = [100, 80, 100];
    const scoreThresholds = { marginal: 70, pass: 90 };
    const canaryRunIndex = 1;
    const expectedClass = 'marginal';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score and not be the last execution and return fail', () => {
    const score = 60;
    const canaryScores = [60, 60, 60];
    const scoreThresholds = { marginal: 70, pass: 90 };
    const canaryRunIndex = 1;
    const expectedClass = 'fail';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score and be the last execution and return pass', () => {
    const score = 95;
    const canaryScores = [75, 75, 95];
    const scoreThresholds = { marginal: 70, pass: 90 };
    const canaryRunIndex = 2;
    const expectedClass = 'pass';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score and be the last execution and return fail', () => {
    const score = 60;
    const canaryScores = [60, 60, 60];
    const scoreThresholds = { marginal: 70, pass: 90 };
    const canaryRunIndex = 2;
    const expectedClass = 'fail';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score and be the only execution and return pass', () => {
    const score = 100;
    const canaryScores = [100];
    const scoreThresholds = { marginal: 70, pass: 90 };
    const canaryRunIndex = 0;
    const expectedClass = 'pass';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score and be the only execution and return fail', () => {
    const score = 0;
    const canaryScores = [0];
    const scoreThresholds = { marginal: 70, pass: 90 };
    const canaryRunIndex = 2;
    const expectedClass = 'fail';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score with empty arrays and pass', () => {
    const score = 100;
    const canaryScores = [];
    const scoreThresholds = { marginal: 75, pass: 95 };
    const canaryRunIndex = 2;
    const expectedClass = 'pass';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score with empty arrays and be marginal', () => {
    const score = 80;
    const canaryScores = [];
    const scoreThresholds = { marginal: 75, pass: 95 };
    const canaryRunIndex = 0;
    const expectedClass = 'marginal';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get class from score with empty arrays and fail', () => {
    const score = 0;
    const canaryScores = [];
    const scoreThresholds = { marginal: 0, pass: 0 };
    const canaryRunIndex = 0;
    const expectedClass = 'pass';
    const actualClass = getClassFromScore(score, canaryScores, scoreThresholds, canaryRunIndex);
    expect(actualClass).toEqual(expectedClass);
  });
});

describe('ScoreClassUtils getGroupClassFromScore', () => {
  it('should get group class from score and pass', () => {
    const score = 100;
    const scoreThresholds = { marginal: 70, pass: 90 };
    const expectedClass = 'pass';
    const actualClass = getGroupClassFromScore(score, scoreThresholds);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get group class from score and fail', () => {
    const score = 0;
    const scoreThresholds = { marginal: 70, pass: 90 };
    const expectedClass = 'fail';
    const actualClass = getGroupClassFromScore(score, scoreThresholds);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get group class from score and fail for being marginal', () => {
    const score = 80;
    const scoreThresholds = { marginal: 70, pass: 90 };
    const expectedClass = 'fail';
    const actualClass = getGroupClassFromScore(score, scoreThresholds);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get group class from score for lower bound edge case and pass', () => {
    const score = 0;
    const scoreThresholds = { marginal: 0, pass: 0 };
    const expectedClass = 'pass';
    const actualClass = getGroupClassFromScore(score, scoreThresholds);
    expect(actualClass).toEqual(expectedClass);
  });

  it('should get group class from score for upper bound edge case and pass', () => {
    const score = 100;
    const scoreThresholds = { marginal: 100, pass: 100 };
    const expectedClass = 'pass';
    const actualClass = getGroupClassFromScore(score, scoreThresholds);
    expect(actualClass).toEqual(expectedClass);
  });
});
