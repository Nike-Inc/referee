import * as React from 'react';
import { RouteComponentProps, RouterProps } from 'react-router';
import { EVENT, trackEvent } from '../util/MetricUtils';
import { ofNullable, trimToEmpty } from '../util/OptionalUtils';

interface Props extends RouteComponentProps {}

interface PathMapping {
  path: string;
  regex: RegExp;
}

const pathMappingOverrides: PathMapping[] = [
  {
    path: '/reports/canary',
    regex: /\/reports\/canary\/.*/
  },
  {
    path: '/reports/standalone_canary_analysis',
    regex: /\/reports\/standalone_canary_analysis\/.*/
  },
  {
    path: '/dev-tools/canary-executor',
    regex: /\/dev-tools\/canary-executor\/results\/.*/
  }
];

/**
 * Some metric sources don't like high cardinality in dimension values (resource ids) as it creates too many time series.
 * We will collapse certain pages to a simple path here.
 * @param path
 */
const mapPathToReduceCardinality = (path: string): string => {
  return ofNullable(pathMappingOverrides.find(mapping => mapping.regex.test(path)))
    .map(mapping => mapping.path)
    .orElse(path);
};

const trackPageView = async (nullablePreTrimmedPath: string | undefined): Promise<void> => {
  trimToEmpty(nullablePreTrimmedPath).ifPresent(preMappedPath => {
    const path = mapPathToReduceCardinality(preMappedPath);
    trackEvent(EVENT.PAGE_VIEW, { path });
  });
};

/**
 * Simple React component that get the history object as props so that we can do page view tracking.
 */
export default class PageViewTracker extends React.Component<Props> {
  constructor(props: Readonly<Props>) {
    super(props);
    // Track the initial page
    // noinspection JSIgnoredPromiseFromCall
    trackPageView(this.props.history.location.pathname);

    // Track any new page changes
    this.props.history.listen(location => {
      // noinspection JSIgnoredPromiseFromCall
      trackPageView(location.pathname);
    });
  }

  render(): React.ReactElement {
    return <div />;
  }
}
