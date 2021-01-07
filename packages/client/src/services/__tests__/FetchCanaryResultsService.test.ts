import MockAdapter from 'axios-mock-adapter';
import KayentaApiService, { kayentaClient } from '../KayentaApiService';
import FetchCanaryResultsService from '../FetchCanaryResultsService';
import CanaryExecutorStore from '../../stores/CanaryExecutorStore';
import ReportStore from '../../stores/ReportStore';
import ConfigEditorStore from '../../stores/ConfigEditorStore';
import { fetchCanaryResultsService } from '../index';
import { mocked } from 'ts-jest/utils';

jest.mock('../../stores/CanaryExecutorStore', () => {
  return jest.fn().mockImplementation(() => {
    return {
      setKayentaCredentials: () => {},
      setCanaryExecutionId: () => {},
      setCanaryExecutionRequestObject: () => {
        console.log('setCanaryExecutionRequestObject was called');
      },
      updateStageStatus: () => {},
      updateResultsRequestComplete: () => {
        console.log('updateResultsRequestComplete was called');
      }
    };
  });
});

jest.mock('../../stores/ReportStore', () => {
  return jest.fn().mockImplementation(() => {
    return {
      updateFromCanaryResponse: () => {
        console.log('updateFromCanaryResponse was called');
      }
    };
  });
});

jest.mock('../../stores/ConfigEditorStore', () => {
  return jest.fn().mockImplementation(() => {
    return {
      setCanaryConfigObject: () => {
        console.log('setCanaryConfigObject was called');
      }
    };
  });
});

describe('FetchCanaryResultsService', () => {
  let httpMock;
  let kayentaApiService;
  const mockedCanaryExecutorStore = mocked(CanaryExecutorStore, true);
  const mockedReportStore = mocked(ReportStore, true);
  const mockedConfigEditorStore = mocked(ConfigEditorStore, true);

  beforeEach(() => {
    httpMock = new MockAdapter(kayentaClient);
    kayentaApiService = new KayentaApiService();
  });

  afterEach(() => {
    httpMock.restore();
    mockedCanaryExecutorStore.mockClear();
    mockedReportStore.mockClear();
    mockedConfigEditorStore.mockClear();
  });

  it('should poll for canary execution complete', async () => {
    const executionId = 'executionId';
    const expectedCredsData = { response: true };
    const expectedCanaryData = {
      complete: true,
      config: 'test'
    };

    console.log = jest.fn();
    httpMock.onGet(`/credentials`).reply(200, expectedCredsData);
    const url = new RegExp(`/canary/*`);
    httpMock.onGet(url).reply(200, expectedCanaryData);
    await fetchCanaryResultsService.pollForCanaryExecutionComplete(executionId);

    expect(console.log).toHaveBeenCalledWith('updateFromCanaryResponse was called');
    expect(console.log).toHaveBeenCalledWith('setCanaryConfigObject was called');
    expect(console.log).toHaveBeenCalledWith('setCanaryExecutionRequestObject was called');
    expect(console.log).toHaveBeenCalledWith('updateResultsRequestComplete was called');
  });
});
