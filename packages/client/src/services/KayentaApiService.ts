import axios from 'axios';
import log from '../util/LoggerFactory';
import {
  CanaryExecutionStatusResponse,
  CanaryExecutionResponse,
  KayentaCredential,
  MetricSetPair,
  CanaryAdhocExecutionRequest,
  CanaryAnalysisExecutionStatusResponse,
  CanaryConfig
} from '../domain/Kayenta';

const kayentaClient = axios.create({
  baseURL: `${window.location.origin}/kayenta/`,
  timeout: 10000
});

export default class KayentaApiService {
  async fetchCredentials(): Promise<KayentaCredential[]> {
    try {
      const response = await kayentaClient.get('/credentials');
      return response.data;
    } catch (e) {
      log.error('Failed to fetch account metadata from Kayenta', e);
      throw e;
    }
  }

  async initiateCanaryWithConfig(
    canaryAdhocExecutionRequest: CanaryAdhocExecutionRequest,
    application: string,
    metricsAccountName: string,
    storageAccountName: string
  ): Promise<CanaryExecutionResponse> {
    try {
      const response = await kayentaClient.post('/canary', canaryAdhocExecutionRequest, {
        params: {
          application: application.trim() === '' ? undefined : application.trim(),
          metricsAccountName: metricsAccountName,
          storageAccountName: storageAccountName
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      log.info(error.response);
      throw error;
    }
  }

  async fetchCanaryExecutionStatusResponse(executionId: string): Promise<CanaryExecutionStatusResponse> {
    try {
      const response = await kayentaClient.get('/canary/' + executionId);
      return response.data;
    } catch (e) {
      log.error('Failed to fetch canary run status from Kayenta', e);
      throw e;
    }
  }

  async fetchCanaryAnalysisExecutionStatusResponse(
    executionId: string
  ): Promise<CanaryAnalysisExecutionStatusResponse> {
    try {
      const response = await kayentaClient.get('/standalone_canary_analysis/' + executionId);
      return response.data;
    } catch (e) {
      log.error('Failed to fetch standalone canary analysis pipeline execution status from Kayenta', e);
      throw e;
    }
  }

  async fetchMetricSetPairList(metricSetPairListId: string): Promise<MetricSetPair[]> {
    try {
      const response = await kayentaClient.get(`/metricSetPairList/${metricSetPairListId}`);
      return response.data;
    } catch (e) {
      log.error(`Failed to fetch metric set pair list of id: ${metricSetPairListId} from Kayenta`, e);
      throw e;
    }
  }

  async fetchCanaryConfig(configId: string): Promise<CanaryConfig> {
    try {
      const response = await kayentaClient.get(`/canaryConfig/${configId}`);
      return response.data;
    } catch (e) {
      log.error(`Failed to fetch canary config with id: ${configId} from Kayenta`, e);
      throw e;
    }
  }
}
