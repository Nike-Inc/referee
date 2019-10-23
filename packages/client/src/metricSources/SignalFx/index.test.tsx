import React from 'react';
import { lifetimeMillis, scale, timeLabels } from './index';
import Optional from 'optional-js';

it('calculates lifetime in ms with populated parameters', () => {
  const controlStartTs = 1565215800000;
  const controlEndTs = 1565218500000;

  const expectedLifetimeMillis = 2700000;
  const actualLifetimeMillis: number = lifetimeMillis(controlStartTs, controlEndTs);

  expect(actualLifetimeMillis).toBe(expectedLifetimeMillis);
});

it('calculates lifetime in ms with parameters of zero', () => {
  const controlStartTs = 0;
  const controlEndTs = 0;

  const expectedLifetimeMillis = 0;
  const actualLifetimeMillis: number = lifetimeMillis(controlStartTs, controlEndTs);

  expect(actualLifetimeMillis).toBe(expectedLifetimeMillis);
});

it('calculates lifetime in ms with empty parameters', () => {
  const controlStartTs = Number(Optional.ofNullable(null));
  const controlEndTs = Number(Optional.ofNullable(null));

  const expectedLifetimeMillis = NaN;
  const actualLifetimeMillis: number = lifetimeMillis(controlStartTs, controlEndTs);

  expect(actualLifetimeMillis).toBe(expectedLifetimeMillis);
});

it('calculates scale with populated parameters', () => {
  const lifetimeMillis = 2700000;
  const dataPointCount = 10;
  const step = 10000;

  const expectedScale = 270000;
  const actualScale: number = scale(lifetimeMillis, dataPointCount, step);

  expect(actualScale).toBe(expectedScale);
});

it('calculates scale with no data points', () => {
  const lifetimeMillis = 2700000;
  const dataPointCount = 0;
  const step = 10000;

  const expectedScale = 10000;
  const actualScale: number = scale(lifetimeMillis, dataPointCount, step);

  expect(actualScale).toBe(expectedScale);
});

it('calculates scale with no lifetime', () => {
  const lifetimeMillis = 0;
  const dataPointCount = 10;
  const step = 10000;

  const expectedScale = 10000;
  const actualScale: number = scale(lifetimeMillis, dataPointCount, step);

  expect(actualScale).toBe(expectedScale);
});

it('calculates time labels with populated parameters', () => {
  const controlStartTs = 1565215800000;
  const controlEndTs = 1565218500000;
  const controlDataPointCount = 10;
  const controlRequestedStep = 10000;

  const expectedTimeLabels = [
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

  const actualTimeLabels: number[] = timeLabels(
    controlStartTs,
    controlEndTs,
    controlDataPointCount,
    controlRequestedStep
  );

  expect(actualTimeLabels).toEqual(expectedTimeLabels);
});

it('calculates time labels with empty parameters', () => {
  const controlStartTs = NaN;
  const controlEndTs = NaN;
  const controlDataPointCount = NaN;
  const controlRequestedStep = NaN;

  const expectedTimeLabels: number[] = [];

  const actualTimeLabels: number[] = timeLabels(
    controlStartTs,
    controlEndTs,
    controlDataPointCount,
    controlRequestedStep
  );

  expect(actualTimeLabels).toEqual(expectedTimeLabels);
});

it('calculates time labels with some empty parameters', () => {
  const controlStartTs = NaN;
  const controlEndTs = NaN;
  const controlDataPointCount = 10;
  const controlRequestedStep = 10000;

  const expectedTimeLabels: number[] = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];

  const actualTimeLabels: number[] = timeLabels(
    controlStartTs,
    controlEndTs,
    controlDataPointCount,
    controlRequestedStep
  );

  expect(actualTimeLabels).toEqual(expectedTimeLabels);
});
