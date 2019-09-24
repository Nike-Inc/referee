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

  async executeSignalfxRequest(): Promise<void> {

    const startTime = "2019-08-07T22:09:57Z";
    const endTime = "2019-08-07T22:57:56Z";

    const SIGNAL_FX_TOKEN = process.env.REACT_APP_SFX_TOKEN;
    let query = "data('jmx_memory.used', filter=filter('plugin_instance', 'memory-heap') and filter('server_group', 'carebears-cms-master-cerberus-prod2-baseline-v1') and filter('server_region', 'us-west-2')).mean(by=['server_region', 'server_group']).publish()";

    let res: any;

    try {
      const response = await axios.post(`https://stream.signalfx.com/v2/signalflow/execute`, query, {
        params: {
          start: new Date(startTime).getMilliseconds(),
          stop: new Date(endTime).getMilliseconds()
        },
        headers: {
          'Content-Type': 'text/plain',
          'X-SF-Token': SIGNAL_FX_TOKEN
        }
      });
      console.log(JSON.stringify(response.data));
      res = response;
      // return JSON.stringify(response.data);
    } catch (error) {
      log.info(error.response);
      throw error;
    }


    // let eventSource = new EventSource(`https://reactrealtime-6683.restdb.io/realtime?apikey=${apikey}`);

    // res.writeHead(200, {
    //   Connection: "keep-alive",
    //   "Content-Type": "text/event-stream",
    //   "Cache-Control": "no-cache"
    // });
    // setTimeout(() => {
    //   res.write("data:" + JSON.stringify(JSON.parse(res.data.body)));
    //   res.write("\n\n");
    // }, 3000);

  }
}
