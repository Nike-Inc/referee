import axios from 'axios';
import log from '../util/LoggerFactory';
import KayentaCredential from '../domain/KayentaCredential';
import CanaryExecutionResponse from '../domain/CanaryExecutionResponse';

const kayentaClient = axios.create({
  baseURL: `${process.env.PUBLIC_URL}/kayenta/`,
  timeout: 5000
});

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

  async triggerCanary(json: string): Promise<CanaryExecutionResponse> {
    try {
      const response = await kayentaClient.post(
        '/standalone_canary_analysis?user=melana.hammel@nike.com&application=example-canary-microservice&metricsAccountName=sfx-architecture&storageAccountName=in-memory-store',
        json,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      log.info(response);
      return response.data;
    } catch (error) {
      log.info(error.response);
      throw error;
    }
  }
}
