import MockAdapter from 'axios-mock-adapter';
import LoadCanaryConfigService from '../LoadCanaryConfigService';
import axios from 'axios';

jest.mock('../../util/LoggerFactory', () => {
  return {
    error: () => {}
  };
});

describe('LoadCanaryConfigService', () => {
  let httpMock;
  let loadCanaryConfigService;

  beforeEach(() => {
    httpMock = new MockAdapter(axios);
    loadCanaryConfigService = new LoadCanaryConfigService();
  });

  afterEach(() => {
    httpMock.restore();
  });

  it('should load canary config from clipboard', async () => {
    Object.assign(navigator, {
      clipboard: {
        readText: () => {
          return '{"name": "example-canary-config"}';
        }
      }
    });

    const expectedCanaryConfig = { name: 'example-canary-config' };
    jest.spyOn(navigator.clipboard, 'readText');
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const actualCanaryConfig = await loadCanaryConfigService.loadCanaryFromClipboard();
    expect(actualCanaryConfig).toEqual(expectedCanaryConfig);
  });

  it('should fail loading canary config from clipboard', async () => {
    Object.assign(navigator, {
      clipboard: {
        readText: () => {}
      }
    });

    jest.spyOn(navigator.clipboard, 'readText');
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    await loadCanaryConfigService.loadCanaryFromClipboard();
    expect(window.alert).toBeCalled();
  });

  it('should not error on config editor', () => {
    const hrefExample = 'http://example.com/config/edit';
    Object.defineProperty(window, 'location', {
      value: {
        href: hrefExample
      },
      writable: true
    });
    window = Object.create(window);

    expect(loadCanaryConfigService.loadCanaryFromTemplate()).resolves;
  });

  it('should recognize blank config and return true', () => {
    const url = 'http://example.com/config/edit';
    const expectedResult = true;
    const actualResult = loadCanaryConfigService.isBlankConfig(url);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should not recognize blank config and return false', () => {
    const url = 'http://example.com/config/edit?tempte=hello-world-config';
    expect(() => {
      loadCanaryConfigService.getTemplateName(url);
    }).toThrowError(/Template URL does not match pattern/);
  });

  it('should recognize template and return false', () => {
    const url = 'http://example.com/template=test';
    const expectedResult = false;
    const actualResult = loadCanaryConfigService.isBlankConfig(url);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should get template name', () => {
    const url = 'http://example.com/config/edit?template=test';
    const expectedTemplateName = 'test';
    const actualTemplateName = loadCanaryConfigService.getTemplateName(url);
    expect(actualTemplateName).toEqual(expectedTemplateName);
  });

  it('should not get template name from pattern mismatch', () => {
    const url = 'http://example.com/config/edit?test';
    expect(() => {
      loadCanaryConfigService.getTemplateName(url);
    }).toThrowError(/Template URL does not match pattern/);
  });

  it('should fetch template content', async () => {
    const expectedData = { response: true };
    const url = new RegExp(`${process.env.PUBLIC_URL}/templates/*`);
    httpMock.onGet(url).reply(200, expectedData);
    const actualData = await loadCanaryConfigService.fetchTemplateContent();
    expect(actualData).toEqual(expectedData);
  });

  it('should not fetch template content because template is not found', async () => {
    const expectedData = { response: true };
    const url = new RegExp(`${process.env.PUBLIC_URL}/templates/*`);
    httpMock.onGet(url).reply(404, expectedData);
    await expect(loadCanaryConfigService.fetchTemplateContent()).rejects.toThrowError(
      /Request failed with status code 404/
    );
  });
});
