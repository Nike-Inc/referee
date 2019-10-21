import React from 'react';
import { timeLabels } from './index';

it('calculates time labels', () => {

  const controlStartTs = 1565215800000;
  const controlEndTs = 1565218500000;
  const controlDataPointCount = 10;
  const controlRequestedStep = 10000;

  const expectedTimeLabels = [
    1565215800000,
    1565215858696,
    1565215917392,
    1565215976088,
    1565216034784,
    1565216093480,
    1565216152176,
    1565216210872,
    1565216269568,
    1565216328264
  ];

  const actualTimeLabels: number[] = timeLabels(
    controlStartTs,
    controlEndTs,
    controlDataPointCount,
    controlRequestedStep
  );

  expect(actualTimeLabels).toBe(expectedTimeLabels);
  // expect(true).toBe(true);
});
