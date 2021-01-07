import axios from 'axios';
import { mocked } from 'ts-jest/utils';
import MockAdapter from 'axios-mock-adapter';
import TemplatesService from '../TemplatesService';
import ConfigEditorStore from '../../stores/ConfigEditorStore';

jest.mock('../../stores/ConfigEditorStore', () => {
  return jest.fn().mockImplementation(() => {
    return {
      setCanaryConfigObject: () => {
        console.log('setCanaryConfigObject was called');
      }
    };
  });
});

describe('TemplatesService', () => {
  let httpMock;
  let templatesService;
  const mockedConfigEditorStore = mocked(ConfigEditorStore, true);

  beforeEach(() => {
    httpMock = new MockAdapter(axios);
    templatesService = new TemplatesService();
  });

  afterEach(() => {
    httpMock.restore();
    mockedConfigEditorStore.mockRestore();
  });

  it('should fetch and update template content', async () => {
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
    await templatesService.fetchAndUpdateTemplateContent();
    expect(console.log).toHaveBeenCalledWith('setCanaryConfigObject was called');
  });

  it('should not fetch and update template content from template not found', async () => {
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
    await expect(templatesService.fetchAndUpdateTemplateContent()).rejects.toThrow();
  });

  it('should not fetch and update template content from pattern mismatch', async () => {
    window = Object.create(window);
    const hrefExample = 'http://example.com';
    Object.defineProperty(window, 'location', {
      value: {
        href: hrefExample
      }
    });

    console.log = jest.fn();
    const expectedData = { response: true };
    const url = new RegExp(`${process.env.PUBLIC_URL}/templates/*`);
    httpMock.onGet(url).reply(200, expectedData);
    await templatesService.fetchAndUpdateTemplateContent();
    expect(console.log).not.toHaveBeenCalledWith('setCanaryConfigObject was called');
  });
});
