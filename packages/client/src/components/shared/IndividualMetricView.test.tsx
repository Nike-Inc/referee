import React from 'react';
import { filterNansFromData, calculateTimeLabels } from './IndividualMetricView';
import { MetricSetPair } from '../../domain/Kayenta';

it('filters nans from data', () => {
  const data: number[] = [5, NaN, NaN, 8, NaN, NaN, NaN, 16, NaN, NaN];
  const expected: number[] = [5, 8, 16];
  const actual: number[] = filterNansFromData(data);
  expect(actual).toEqual(expected);
});

it('filters nans from data with no nans', () => {
  const data: number[] = [5, 6, 7, 8, 9];
  const expected: number[] = [5, 6, 7, 8, 9];
  const actual: number[] = filterNansFromData(data);
  expect(actual).toEqual(expected);
});

it('filters nans from data of only nans', () => {
  const data: number[] = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
  const expected: number[] = [];
  const actual: number[] = filterNansFromData(data);
  expect(actual).toEqual(expected);
});

it('filters nans from empty data', () => {
  const data: number[] = [];
  const expected: number[] = [];
  const actual: number[] = filterNansFromData(data);
  expect(actual).toEqual(expected);
});

it('calculates time labels from populated parameters for signalfx mapper', () => {
  const selectedMetric = '6c8a5221-7bc0-4c2f-87be-2d49d4337ff0';
  const metricSourceType = 'signalfx';
  const lifetime = 45;
  const metricSetPairsByIdMap: KvMap<MetricSetPair> = {
    '6c8a5221-7bc0-4c2f-87be-2d49d4337ff0': {
      name: 'Average Endpoint Latency',
      id: '6c8a5221-7bc0-4c2f-87be-2d49d4337ff0',
      tags: {},
      values: { control: [], experiment: [] },
      scopes: {
        control: {
          startTimeIso: '2019-10-24T19:00:00Z',
          startTimeMillis: 1571943600000,
          stepMillis: 60000
        },
        experiment: {
          startTimeIso: '2019-10-24T19:00:00Z',
          startTimeMillis: 1571943600000,
          stepMillis: 60000
        }
      },
      attributes: {
        control: {
          'signal-flow-program': '',
          'actual-data-point-count': '10',
          'requested-start': '1571943600000',
          'requested-end': '1571950800000',
          'requested-step-milli': '60000',
          'requested-max-delay': '0',
          'requested-immediate': 'true',
          'requested-account': '',
          'actual-start-ts': '1571943600000',
          'actual-end-ts': '1571950800000'
        },
        experiment: {
          'signal-flow-program': '',
          'actual-data-point-count': '10',
          'requested-start': '1571943600000',
          'requested-end': '1571950800000',
          'requested-step-milli': '60000',
          'requested-max-delay': '0',
          'requested-immediate': 'true',
          'requested-account': '',
          'actual-start-ts': '1571943600000',
          'actual-end-ts': '1571950800000'
        }
      }
    }
  };
  const filteredControlDataPointsLength = 10;
  const startTimeMillis = 1571943600000;
  const stepMillis = 60000;

  const expected: number[] = [
    1571943600000,
    1571943870000,
    1571944140000,
    1571944410000,
    1571944680000,
    1571944950000,
    1571945220000,
    1571945490000,
    1571945760000,
    1571946030000
  ];
  const actual: number[] = calculateTimeLabels(
    selectedMetric,
    metricSourceType,
    lifetime,
    metricSetPairsByIdMap,
    filteredControlDataPointsLength,
    startTimeMillis,
    stepMillis
  );
  expect(actual).toEqual(expected);
});

it('calculates time labels from populated parameters for default mapper', () => {
  const selectedMetric = '';
  const metricSourceType = 'newrelic';
  const lifetime = 45;
  const metricSetPairsByIdMap = {};
  const filteredControlDataPointsLength = 10;
  const startTimeMillis = 1565215800000;
  const stepMillis = 10000;

  const expected: number[] = [
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

  const actual: number[] = calculateTimeLabels(
    selectedMetric,
    metricSourceType,
    lifetime,
    metricSetPairsByIdMap,
    filteredControlDataPointsLength,
    startTimeMillis,
    stepMillis
  );
  expect(actual).toEqual(expected);
});

it('calculates time labels from parameters of zero', () => {
  const selectedMetric = '';
  const metricSourceType = '';
  const lifetime = 0;
  const metricSetPairsByIdMap = {};
  const filteredControlDataPointsLength = 0;
  const startTimeMillis = 0;
  const stepMillis = 0;

  const expected: number[] = [];
  const actual: number[] = calculateTimeLabels(
    selectedMetric,
    metricSourceType,
    lifetime,
    metricSetPairsByIdMap,
    filteredControlDataPointsLength,
    startTimeMillis,
    stepMillis
  );
  expect(actual).toEqual(expected);
});
