import React from 'react';
import { defaultGraphDataMapper } from './index';

it('generates default graph labels with populated parameters', () => {
  const lifetime = 45;
  const dataPointCount = 10;
  const startTimeMillis = 1565215800000;
  const stepMillis = 10000;

  const expectedControlLabels: number[] = [
    1565215800000,
    1565216070000,
    1565216340000,
    1565216610000,
    1565216880000,
    1565217150000,
    1565217420000,
    1565217690000,
    1565217960000,
    1565218230000
  ];

  const { controlTimeLabels } = defaultGraphDataMapper(lifetime, dataPointCount, startTimeMillis, stepMillis);
  expect(controlTimeLabels).toEqual(expectedControlLabels);
});

it('generates default graph labels with empty lifetime', () => {
  const lifetime = 0;
  const dataPointCount = 10;
  const startTimeMillis = 1565215800000;
  const stepMillis = 10000;

  const expectedControlLabels: number[] = [
    1565215800000,
    1565215810000,
    1565215820000,
    1565215830000,
    1565215840000,
    1565215850000,
    1565215860000,
    1565215870000,
    1565215880000,
    1565215890000
  ];

  const { controlTimeLabels } = defaultGraphDataMapper(lifetime, dataPointCount, startTimeMillis, stepMillis);
  expect(controlTimeLabels).toEqual(expectedControlLabels);
});

it('generates empty graph labels with zero data points', () => {
  const lifetime = 45;
  const dataPointCount = 0;
  const startTimeMillis = 1565215800000;
  const stepMillis = 10000;

  const expectedControlLabels: number[] = [1565215800000, 1565218500000];
  const { controlTimeLabels } = defaultGraphDataMapper(lifetime, dataPointCount, startTimeMillis, stepMillis);
  expect(controlTimeLabels).toEqual(expectedControlLabels);
});

it('generates default graph labels with parameters of zero', () => {
  const lifetime = 0;
  const dataPoints = 0;
  const startTimeMillis = 0;
  const stepMillis = 0;

  const expectedControlLabels: number[] = [0, 0];
  const { controlTimeLabels } = defaultGraphDataMapper(lifetime, dataPoints, startTimeMillis, stepMillis);
  expect(controlTimeLabels).toEqual(expectedControlLabels);
});

it('generates default graph labels with empty parameters', () => {
  const lifetime = NaN;
  const dataPoints = NaN;
  const startTimeMillis = NaN;
  const stepMillis = NaN;

  const expectedControlLabels: number[] = [NaN, NaN];
  const { controlTimeLabels } = defaultGraphDataMapper(lifetime, dataPoints, startTimeMillis, stepMillis);
  expect(controlTimeLabels).toEqual(expectedControlLabels);
});
