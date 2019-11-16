<img width="800" alt="Referee Logo" src="/docs/assets/dark-on-light-horizontal-lockup.png">

Referee is a user interface for using Spinnaker's Kayenta, a platform for Automated Canary Analysis (ACA), as a standalone service.

Referee is very much inspired by the Spinnakers official UI (Deck).

Referee is a React Single Page Application written in Typescript, using Create React App.

Referee also has an express backend to serve the app and act as a reverse proxy for Kayenta and handle UI KPI tracking. We can probably make this optional, but right now it is required.

## Why did we build Referee

We built Referee after investigating Spinnaker and how it does ACA, we liked the user experience it offered its users. Since we couldn't use the complete Spinnaker solution but we liked Kayenta, we decided to use Kayenta as a standalone service.

We initially investigated using Deck, Spinnaker's official UI.

Deck is meant to be the UI for the complete Spinnaker user experiance and its good at that. We worked with the UI SIG and investigated modifying deck and or making the Kayenta react components re-usable. Ultimately it didn't make sense to shoehorn our use-case into those projects as it would produce too much developer burden for the contributors.

We decided it would be easier to just have a separate project for the standalone Kayenta use case, even if there is some duplicated logic.

## Warning

This project is very much in a beta state and is undergoing active development.

## Features

### Canary Config Generation Tool

Canary Configuration is where Application teams define what metrics matter and is the input that tells Kayenta how to judge the health of a canary.

This tool is pretty much a direct port of the user experience that Deck offers for creating canary config.

### Retrospective Analysis Tool

This tool enables teams to rapidly iterate on their canary config.

Retrospective analysis is a way to conduct canary analysis of historical events or data. It can be used to speed up testing, so when users test small changes in their configs, they don't have to wait for a full canary run every time.

### Agreggated Standalone Canary Analysis Report Viewer

This allows users to view results generated from the aggregated standalone canary analysis endpoint in Kayenta.

### Single Run Canary Analysis Report Viewer

This allows users to view results generated from the canary analysis endpoint in Kayenta.

<!-- TODO document how this works with the toc yaml.
### Organization Specific Documentation hosting

This allows operators to inject their org specific docs as markdown into packages/client/public/docs/
-->

<!-- TODO document how this works and default to just logging to stdout, if users don't supply a custom reporter
### Metrics and Key Performance Indicators (KPIs) Reporting
-->

## Supported Metrics Sources

Kayenta has many metrics source integrations, this project does not currently support all of them.

Referee currently supports

- New Relic Insights
- SignalFx

To add a new integration you must implement the [MetricSourceIntegration](/packages/client/src/metricSources/MetricSourceIntegration.ts) interface and then add it to the [enabled metric sources](/packages/client/src/metricSources/index.tsx).

## Development

### Configuring Referee to talk to Kayenta

As stated in the [main description](#referee) Referee has an express backend that acts as a reverse proxy for Kayenta among other things.

To configure how Referee talks to Kayenta you can set the following environment variable.
If you do nothing Referee defaults to talking to Kayenta on http://localhost:8090, the default when running Kayenta locally.

Env Var | Default | Description
--------|---------|-------------
*KAYENTA_BASE_URL* | `http://localhost:8090` | The base URL for where Kayenta is is serving traffic
*KAYENTA_BASE_PATH* | NULL | If present this will be appended to the base URL when reverse proxying Kayenta requests, useful if want to local dev against a deployed Kayenta that is behind a reverse proxy.
*DISABLE_KAYENTA_SSL_VERIFICATION* | `false` | [A hook for self signed cert issues](https://www.npmjs.com/package/express-http-proxy#q-how-to-ignore-self-signed-certificates-)

### bootstrap the project

```bash
yarn && yarn bootstrap
```

### Start the reverse proxy and front end

```bash
yarn start
```

## Contributing

See [Contributing](CONTRIBUTING.md)

## License

This project Measured and all of its modules are licensed under the [Apache License, Version 2.0](LICENSE.txt).
