import MockAdapter from 'axios-mock-adapter';
import LoadCanaryConfigService from '../LoadCanaryConfigService';
import ConfigEditorStore from '../../stores/ConfigEditorStore';
import { mocked } from 'ts-jest/utils';
import axios from "axios";

jest.mock('../../stores/ConfigEditorStore', () => {
  return jest.fn().mockImplementation(() => {
    return {
      setCanaryConfigObject: () => {
        console.log('setCanaryConfigObject was called');
      }
    };
  });
});

jest.mock('../../util/LoggerFactory', () => {
  return {
    error: () => {}
  };
});

Object.assign(navigator, {
  clipboard: {
    readText: () => {},
  },
});

describe('LoadCanaryConfigService', () => {
  let httpMock;
  let loadCanaryConfigService;
  const mockedConfigEditorStore = mocked(ConfigEditorStore, true);

  beforeEach(() => {
    httpMock = new MockAdapter(axios);
    loadCanaryConfigService = new LoadCanaryConfigService();
  });

  afterEach(() => {
    httpMock.restore();
    mockedConfigEditorStore.mockRestore();
  });

  // TODO figure out how to mock reading from clipboard
  // it('should load canary config from clipboard', async () => {
  //   jest.spyOn(navigator.clipboard, "readText");
  //   await loadCanaryConfigService.loadCanaryFromClipboard();
  //   expect(navigator.clipboard.readText()).toHaveBeenCalled();
  // });

  it('should fail loading canary config from clipboard', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    await loadCanaryConfigService.loadCanaryFromClipboard();
    expect(window.alert).toBeCalled();
  });

  it('should load canary from template', async () => {
    const hrefExample = 'http://example.com/template=test';
    Object.defineProperty(window, 'location', {
      value: {
        href: hrefExample
      },
      writable: true
    });
    window = Object.create(window);

    console.log = jest.fn();
    const expectedData = { response: true };
    const url = new RegExp(`${process.env.PUBLIC_URL}/templates/*`);
    httpMock.onGet(url).reply(200, expectedData);
    await loadCanaryConfigService.loadCanaryFromTemplate();
    expect(console.log).toHaveBeenCalledWith('setCanaryConfigObject was called');
  });

  it('should not load canary from template from template not found', async () => {
    const hrefExample = 'http://example.com/template=test';
    Object.defineProperty(window, 'location', {
      value: {
        href: hrefExample
      },
      writable: true
    });
    window = Object.create(window);

    console.log = jest.fn();
    const expectedData = { response: true };
    const url = new RegExp(`${process.env.PUBLIC_URL}/templates/*`);
    httpMock.onGet(url).reply(404, expectedData);
    await expect(loadCanaryConfigService.loadCanaryFromTemplate()).rejects.toThrow();
  });

  it('should not load canary from template from pattern mismatch', async () => {
    const hrefExample = 'http://example.com/';
    Object.defineProperty(window, 'location', {
      value: {
        href: hrefExample
      },
      writable: true
    });
    window = Object.create(window);

    console.log = jest.fn();
    const expectedData = { response: true };
    const url = new RegExp(`${process.env.PUBLIC_URL}/templates/*`);
    httpMock.onGet(url).reply(200, expectedData);
    await loadCanaryConfigService.loadCanaryFromTemplate();
    expect(console.log).not.toHaveBeenCalledWith('setCanaryConfigObject was called');
  });
});
