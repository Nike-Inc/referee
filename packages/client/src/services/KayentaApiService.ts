import axios from 'axios';
import log from '../util/LoggerFactory';
import KayentaCredential from '../domain/KayentaCredential';
import { CanaryExecutionResponse } from '../domain/CanaryExecutionResponse';
import { CanaryExecutionStatusResponse } from '../domain/CanaryExecutionStatusResponse';
import { stores } from '../stores';

const kayentaClient = axios.create({
  baseURL: `${window.location.origin}/kayenta/`,
  timeout: 5000
});

const { canaryExecutorStore } = stores;

export default class KayentaApiService {
  async fetchCredentials(): Promise<KayentaCredential[]> {
    try {
      const response = await kayentaClient.get('/credentials');
      return response.data;
    } catch (e) {
      log.error('Failed to fetch account metadata from Kayenta +', e);
      throw e;
    }
  }

  async triggerCanary(json: any): Promise<CanaryExecutionResponse> {
    // TODO add better validation here
    const application: string = canaryExecutorStore.applicationName;
    const metricsAccountName: string = canaryExecutorStore.metricsAccountName;
    const storageAccountName: string = canaryExecutorStore.storageAccountName;

    try {
      const response = await kayentaClient.post('/canary', json, {
        params: {
          application: application,
          metricsAccountName: metricsAccountName,
          storageAccountName: storageAccountName
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      log.info(response);
      return response.data;
    } catch (error) {
      log.info(error.response);
      throw error;
    }
  }

  async fetchCanaryRunStatusAndResults(canaryExecutionId: string): Promise<CanaryExecutionStatusResponse> {
    try {
      const response = await kayentaClient.get('/canary/' + canaryExecutionId);
      return response.data;
    } catch (e) {
      log.error('Failed to fetch canary run status from Kayenta +', e);
      throw e;
    }
  }
}
