import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {EVENT, trackEvent} from '../MetricUtils';

jest.mock('../../util/LoggerFactory', () => {
    return {
        error: () => {
        }
    };
});

describe('MetricUtils', () => {
    let httpMock;

    beforeEach(() => {
        httpMock = new MockAdapter(axios);
    });

    afterEach(() => {
        httpMock.restore();
    });

    it('should track load config event with empty dimensions', async () => {
        httpMock.onPost(`/metrics`).reply(200);
        await expect(trackEvent(EVENT.LOAD_CONFIG)).resolves;
    });

    it('should track new config event with empty dimensions', async () => {
        httpMock.onPost(`/metrics`).reply(200);
        await expect(trackEvent(EVENT.NEW_CONFIG)).resolves;
    });

    it('should track new config event with dimensions', async () => {
        const dimensions = {"key": "value"};
        httpMock.onPost(`/metrics`).reply(200);
        await expect(trackEvent(EVENT.NEW_CONFIG, dimensions)).resolves;
    });

    it('should track page view event with empty dimensions', async () => {
        httpMock.onPost(`/metrics`).reply(200);
        await expect(trackEvent(EVENT.PAGE_VIEW)).resolves;
    });

    it('should fail on track event', async () => {
        httpMock.onGet(`/metrics`).reply(404);
        await expect(trackEvent(EVENT.LOAD_CONFIG)).rejects;
    });
});
