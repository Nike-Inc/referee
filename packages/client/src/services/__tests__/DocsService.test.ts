import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import DocsService from '../DocsService';

describe('DocsService', () => {
  let httpMock;
  let docsService;

  beforeEach(() => {
    httpMock = new MockAdapter(axios);
    docsService = new DocsService();
  });

  it('should fetch toc', async () => {
    const expectedData = { response: true };
    httpMock.onGet(`${process.env.PUBLIC_URL}/docs/table-of-contents.yaml`).reply(200, expectedData);
    const actualData = await docsService.fetchToc();
    expect(actualData).toEqual(expectedData);
  });

  it('should not fetch toc and throw error', async () => {
    const expectedData = { response: true };
    httpMock.onGet(`${process.env.PUBLIC_URL}/docs/table-of-contents.yaml`).reply(404, expectedData);
    await expect(docsService.fetchToc()).rejects.toThrowError(/Request failed with status code 404/);
  });

  it('should fetch doc content', async () => {
    const markdown = 'markdown';
    const expectedData = { response: true };
    httpMock.onGet(`${process.env.PUBLIC_URL}/docs/${markdown}`).reply(200, expectedData);
    const actualData = await docsService.fetchDocContent(markdown);
    expect(actualData).toEqual(expectedData);
  });

  it('should not fetch doc content and throw error', async () => {
    const markdown = 'markdown';
    const expectedData = { response: true };
    httpMock.onGet(`${process.env.PUBLIC_URL}/docs/${markdown}`).reply(404, expectedData);
    await expect(docsService.fetchDocContent(markdown)).rejects.toThrowError(/Request failed with status code 404/);
  });
});
