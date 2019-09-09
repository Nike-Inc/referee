import axios from 'axios';
import log from '../util/LoggerFactory';

export default class MetricsService {
  sendMetric(metricName: string, path?: string): void {
    let data: KvMap<object | string> = {
      name: `${metricName}`
    };
    if (path) {
      data['dimensions'] = {
        url: `${path}`
      };
    }
    try {
      axios.post(`/metrics`, data);
    } catch (e) {
      log.error(`Unable to send metric: ${metricName} and dimension: ${path}`, e);
    }
  }
}
