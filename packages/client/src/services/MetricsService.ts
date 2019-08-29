import axios from 'axios';

export default class MetricsService {
  sendMetric(metricName: string): void {
    axios.post(`${process.env.PUBLIC_URL}/metrics`, {
      name: `${metricName}`
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  }
}
