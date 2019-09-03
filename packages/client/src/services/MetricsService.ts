import axios from 'axios';

export default class MetricsService {
  async sendMetric(metricName: string, path: string): Promise<void> {
    try {
      await axios.post(`${process.env.PUBLIC_URL}/metrics`, {
        name: `${metricName}`,
        dimensions: {
          url: `${path}`
        }
      })
    }
    catch (e) {
      console.log(`unable to send metric: ${metricName} and dimension: ${path}`);
      console.log(e)
    }
  }
}
