import express from 'express';
import proxy from 'express-http-proxy';
import util from 'util';
import Optional from 'optional-js';
import path from 'path';
import { publicRoot } from './const/appPaths';

const app = express();
const port = 3001;

app.get('/', (req, res) => res.redirect(301, '/dashboard'));

app.use(
  '/kayenta',
  proxy(Optional.ofNullable(process.env.KAYENTA_BASE_URL).orElse('http://localhost:8090'), {
    proxyReqOptDecorator: (proxyReqOpts: any) => {
      proxyReqOpts.rejectUnauthorized = false;
      return proxyReqOpts;
    }
  })
);

// Route all other traffic to the public dir
app.use('/dashboard/', express.static(publicRoot));

// Wild card route needed for React Router to support deep linking.
app.get('/dashboard/*', (req, res) => {
  res.sendFile(path.join(publicRoot, '/index.html'), err => {
    if (err) {
      res.status(500).send(util.inspect(err));
    }
  });
});

app.listen(port, () => console.log(`Referee listening on port ${port}!`));
