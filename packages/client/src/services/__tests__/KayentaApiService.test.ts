import MockAdapter from 'axios-mock-adapter';
import KayentaApiService, { kayentaClient } from '../KayentaApiService';
import { CanaryExecutionResult } from '../../domain/Kayenta';

describe('KayentaApiService', () => {
  let httpMock;
  let kayentaApiService;

  beforeEach(() => {
    httpMock = new MockAdapter(kayentaClient);
    kayentaApiService = new KayentaApiService();
  });

  afterEach(() => {
    httpMock.restore();
  });

  it('should fetch credentials', async () => {
    const expectedData = { response: true };
    httpMock.onGet(`/credentials`).reply(200, expectedData);
    const actualData = await kayentaApiService.fetchCredentials();
    expect(actualData).toEqual(expectedData);
  });

  it('should not fetch credentials and throw error', async () => {
    httpMock.onGet(`/credentials`).reply(500);
    await expect(kayentaApiService.fetchCredentials()).rejects.toThrow();
  });

  it('should initiate canary with config with empty data', async () => {
    const expectedResponse = { response: true };
    httpMock.onPost(`/canary`).reply(200, expectedResponse);
    const actualResponse = await kayentaApiService.initiateCanaryWithConfig(undefined, '', '', '');
    expect(actualResponse).toEqual(expectedResponse);
  });

  it('should initiate canary with config', async () => {
    const expectedResponse = { response: true };
    const application = 'application';
    const metricsAccountName = 'metricsAccountName';
    const storageAccountName = 'storageAccountName';
    httpMock.onPost(`/canary`).reply(200, expectedResponse);
    const actualResponse = await kayentaApiService.initiateCanaryWithConfig(
      {},
      application,
      metricsAccountName,
      storageAccountName
    );
    expect(actualResponse).toEqual(expectedResponse);
  });

  it('should not initiate canary with config and throw error', async () => {
    httpMock.onPost(`/canary`).reply(404);
    const expectedError = kayentaApiService.initiateCanaryWithConfig(undefined, '', '', '');
    await expect(expectedError).rejects.toThrow();
  });

  it('should fetch canary execution status response', async () => {
    const executionId = 'executionId';
    const expectedData = { response: true };
    httpMock.onGet(`/canary/${executionId}`).reply(200, expectedData);
    const actualData = await kayentaApiService.fetchCanaryExecutionStatusResponse(executionId);
    expect(actualData).toEqual(expectedData);
  });

  it('should not fetch canary execution status response and throw error', async () => {
    const executionId = 'executionId';
    httpMock.onGet(`/canary/${executionId}`).reply(404);
    await expect(kayentaApiService.fetchCanaryExecutionStatusResponse(executionId)).rejects.toThrow();
  });

  it('should fetch canary config', async () => {
    const configId = 'configId';
    const expectedData = { response: true };
    httpMock.onGet(`/canaryConfig/${configId}`).reply(200, expectedData);
    const actualData = await kayentaApiService.fetchCanaryConfig(configId);
    expect(actualData).toEqual(expectedData);
  });

  it('should not fetch canary config and throw error', async () => {
    const configId = 'configId';
    httpMock.onGet(`/canaryConfig/${configId}`).reply(404);
    await expect(kayentaApiService.fetchCanaryConfig(configId)).rejects.toThrow();
  });

  it('should fetch metric set pair list', async () => {
    const metricSetPairListId = 'metricSetPairListId';
    const expectedData = { response: true };
    httpMock.onGet(`/metricSetPairList/${metricSetPairListId}`).reply(200, expectedData);
    const actualData = await kayentaApiService.fetchMetricSetPairList(metricSetPairListId);
    expect(actualData).toEqual(expectedData);
  });

  it('should not fetch metric set pair list and throw error', async () => {
    const metricSetPairListId = 'metricSetPairListId';
    httpMock.onGet(`/metricSetPairList/${metricSetPairListId}`).reply(404);
    await expect(kayentaApiService.fetchMetricSetPairList(metricSetPairListId)).rejects.toThrow();
  });

  it('should create metric set pair list map with empty results', async () => {
    const expectedMetricSetPairListMap = {};
    const actualMetricSetPairListMap = await kayentaApiService.createMetricSetPairListMap([]);
    expect(actualMetricSetPairListMap).toEqual(expectedMetricSetPairListMap);
  });

  it('should create metric set pair list map', async () => {
    const canaryExecutionResults: CanaryExecutionResult[] = [
      {
        executionId: '01EV9V6SXPMCAD038QXDVRHFT1',
        executionStatus: 'SUCCEEDED',
        result: {},
        judgementStartTimeIso: '2020-02-05T02:00:00Z',
        judgementStartTimeMillis: 1580868000000,
        judgementEndTimeIso: '2020-02-05T03:00:00Z',
        judgementEndTimeMillis: 1580871600000,
        warnings: [],
        metricSetPairListId: '9b9fe8b0-f470-42dc-bbaa-157abadec9bf'
      }
    ];
    const metricSetPairListId = '9b9fe8b0-f470-42dc-bbaa-157abadec9bf';
    const expectedData = ['metricSetPairList'];
    const expectedMetricSetPairListMap = { '9b9fe8b0-f470-42dc-bbaa-157abadec9bf': ['metricSetPairList'] };
    httpMock.onGet(`/metricSetPairList/${metricSetPairListId}`).reply(200, expectedData);
    const actualMetricSetPairListMap = await kayentaApiService.createMetricSetPairListMap(canaryExecutionResults);
    expect(actualMetricSetPairListMap).toEqual(expectedMetricSetPairListMap);
  });
});
