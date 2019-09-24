import express from 'express';
import proxy from 'express-http-proxy';
import util from 'util';
import Optional from 'optional-js';
import path from 'path';
import { publicRoot } from './const/appPaths';
import { SelfReportingMetricsRegistry, LoggingReporter, Dimensions } from 'measured-reporting';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

interface CustomizableConfiguration {
  metricsRegistry: SelfReportingMetricsRegistry;
}

// Hook for org specific customizations
// eslint-disable-next-line @typescript-eslint/no-var-requires
const customizations: CustomizableConfiguration = require('../../../customizations') || {};

// eslint-disable-next-line prettier/prettier
const metricsRegistry: SelfReportingMetricsRegistry = Optional
  .ofNullable(customizations.metricsRegistry)
  .orElse(new SelfReportingMetricsRegistry(new LoggingReporter({ defaultDimensions: {}, logLevel: 'ERROR' })));

const port = process.env.PORT || 3001;

app.get('/', (req, res) => res.redirect(301, '/dashboard'));

interface MetricsProxyRequest {
  name: string;
  dimensions?: Dimensions;
}

app.post('/metrics', (req, res) => {
  const request = req.body as MetricsProxyRequest;
  metricsRegistry.getOrCreateCounter(request.name, request.dimensions).inc();
  res.status(201).end();
});

app.get('/getDataFromSfX', async (req, res) => {
  console.log('I WAS CALLED');

  const startTime = '2019-08-07T22:09:57Z';
  const endTime = '2019-08-07T22:57:56Z';

  const SIGNAL_FX_TOKEN = process.env.REACT_APP_SFX_TOKEN;
  let query =
    "data('jmx_memory.used', filter=filter('plugin_instance', 'memory-heap') and filter('server_group', 'carebears-cms-master-cerberus-prod2-baseline-v1') and filter('server_region', 'us-west-2')).mean(by=['server_region', 'server_group']).publish()";

  try {
    console.log('1.');
    const response = await axios.post(`https://stream.signalfx.com/v2/signalflow/execute`, query, {
      params: {
        start: new Date(startTime).getTime(),
        stop: new Date(endTime).getTime(),
        resolution: 10000,
        maxDelay: 0,
        immediate: true
      },
      headers: {
        Accepts: 'text/plain',
        'Content-Type': 'text/plain',
        'X-SF-Token': SIGNAL_FX_TOKEN
      }
    });
    console.log('2.');
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.log(error)
    throw error;
  }
  res.status(201).end(); // doesn't return anything
});

app.use(
  '/kayenta',
  proxy(Optional.ofNullable(process.env.KAYENTA_BASE_URL).orElse('http://localhost:8090'), {
    proxyReqOptDecorator: (proxyReqOpts: any) => {
      // Hook for self signed certs https://www.npmjs.com/package/express-http-proxy#q-how-to-ignore-self-signed-certificates-
      proxyReqOpts.rejectUnauthorized = !!process.env.DISABLE_KAYENTA_SSL_VERIFICATION;
      return proxyReqOpts;
    },
    proxyReqPathResolver: req => {
      return process.env.KAYENTA_BASE_PATH ? `${process.env.KAYENTA_BASE_PATH}${req.url}` : req.url;
    }
  })
);

app.get('/health', (req, res) => {
  res.status(204).end();
});

// Route all other traffic to the public dir
app.use(
  '/dashboard/',
  express.static(publicRoot, {
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        // All of the project's HTML files end in .html
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  })
);

// Wild card route needed for React Router to support deep linking.
app.get('/dashboard/*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(publicRoot, '/index.html'), err => {
    if (err) {
      res.status(500).send(util.inspect(err));
    }
  });
});

app.listen(port, () => console.log(`Referee listening on port ${port}!`));
