import * as React from 'react';
import { AbstractMetricModal } from '../../components/config/AbstractMetricModal';
import NewRelicCanaryMetricSetQueryConfig from './NewRelicCanaryMetricSetQueryConfig';
import { NEW_RELIC_SERVICE_TYPE } from './index';
import { InlineTextGroup } from '../../layout/InlineTextGroup';

export default class NewRelicMetricModal extends AbstractMetricModal<NewRelicCanaryMetricSetQueryConfig> {
  getQueryInitialState(): NewRelicCanaryMetricSetQueryConfig {
    return {
      type: NEW_RELIC_SERVICE_TYPE,
      select: '',
      q: ''
    };
  }

  getMetricSourceSpecificJsx(): JSX.Element {
    return (
      <div>
        <InlineTextGroup
          onBlur={() => {
            this.touch('select');
          }}
          touched={this.state.touched.select}
          error={this.state.errors['query.select']}
          id="select"
          label="Select"
          value={this.state.metric.query.select}
          onChange={e => this.updateQueryObject('select', e.target.value)}
          placeHolderText="SELECT count(request.count)"
          subText="The full select query component of the NRQL statement. See the NRQL Docs: https://bit.ly/2S6VVuK"
        />
        <InlineTextGroup
          onBlur={() => {
            this.touch('q');
          }}
          touched={this.state.touched.q}
          error={this.state.errors['query.q']}
          id="query"
          label="Query"
          value={this.state.metric.query.q}
          onChange={e => this.updateQueryObject('q', e.target.value)}
          placeHolderText="status_code = '200'"
          subText="NRQL query segment for WHERE clause"
        />
      </div>
    );
  }
}
