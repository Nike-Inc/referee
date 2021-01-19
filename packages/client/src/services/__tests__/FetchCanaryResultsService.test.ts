import MockAdapter from 'axios-mock-adapter';
import { kayentaClient } from '../KayentaApiService';
import { fetchCanaryResultsService } from '../index';

describe('FetchCanaryResultsService', () => {
  let httpMock;

  beforeEach(() => {
    httpMock = new MockAdapter(kayentaClient);
  });

  afterEach(() => {
    httpMock.restore();
  });

  it('should poll for response successfully', async () => {
    const expectedData = {
      complete: true,
      config: 'test'
    };

    const url = new RegExp(`/canary/*`);
    httpMock.onGet(url).reply(200, expectedData);
    const actualData = await fetchCanaryResultsService.pollForResponse();
    expect(actualData).toEqual(expectedData);
  });

  it('should poll for response unsuccessfully', function(done) {
    const data = {
      complete: false,
      config: 'test'
    };

    const url = new RegExp(`/canary/*`);
    httpMock.onGet(url).reply(200, data);
    const actualData = fetchCanaryResultsService.pollForResponse();
    expect(actualData).resolves.toEqual({});
    done();
  });
});
