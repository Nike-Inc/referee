import axios from 'axios';
import log from '../util/LoggerFactory';

export default class MetricsService {
  async sendMetric(metricName: string, path?: string): Promise<void> {
    let data: KvMap<object | string> = {
      name: `${metricName}`
    };
    if (path) {
      data['dimensions'] = {
        url: `${path}`
      };
    }
    try {
      await axios.post(`${process.env.PUBLIC_URL}/metrics`, data);
    } catch (e) {
      log.error(`Unable to send metric: ${metricName} and dimension: ${path}`, e);
    }
  }
}
