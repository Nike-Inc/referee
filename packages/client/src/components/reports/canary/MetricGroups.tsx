import * as React from 'react';
import {
  CanaryAnalysisResult,
  CanaryClassifierThresholdsConfig,
  CanaryConfig,
  CanaryJudgeGroupScore,
  MetricSetPair
} from '../../../domain/Kayenta';
import MetricGroup from './MetricGroup';
import './MetricGroups.scss';
import { Checkbox } from '../../shared/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

interface Props {
  config: CanaryConfig;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  idListByMetricGroupNameMap: KvMap<string[]>;
  groupScoreByMetricGroupNameMap: KvMap<CanaryJudgeGroupScore>;
  thresholds: CanaryClassifierThresholdsConfig;
}

interface State {
  metricGroupNamesDescByWeight: string[];
  filterMap: Map<string, boolean>;
  classificationCountMap: Map<string, number>;
}

enum filters {
  FAIL = 'Fail',
  NODATA = 'Nodata',
  PASS = 'Pass'
}

export default class MetricGroups extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    const groupWeights = this.props.config.classifier.groupWeights;
    const metricGroupNamesDescByWeight = Object.keys(groupWeights).sort((a, b) => {
      return groupWeights[b] - groupWeights[a];
    });

    const filterMap = new Map();
    filterMap.set(filters.FAIL, true);
    filterMap.set(filters.NODATA, true);
    filterMap.set(filters.PASS, false);

    const classificationCountMap = new Map();
    classificationCountMap.set(filters.FAIL, 0);
    classificationCountMap.set(filters.NODATA, 0);
    classificationCountMap.set(filters.PASS, 0);

    Object.entries(this.props.canaryAnalysisResultByIdMap).map(id => {
      let current = classificationCountMap.get(id[1].classification);
      current++;
      classificationCountMap.set(id[1].classification, current);
    });

    this.state = {
      metricGroupNamesDescByWeight,
      filterMap,
      classificationCountMap
    };
  }

  handleCheckboxChange(filter: string): void {
    const current = this.state.filterMap.get(filter);
    this.setState({ filterMap: this.state.filterMap.set(filter, !current) });
  }

  render(): React.ReactNode {
    const {
      config,
      metricSetPairsByIdMap,
      canaryAnalysisResultByIdMap,
      idListByMetricGroupNameMap,
      groupScoreByMetricGroupNameMap,
      thresholds
    } = this.props;
    return (
      <div className="metrics-container-wrapper">
        <div className="metrics-container">
          <div className="metrics-container-title">Metrics</div>
          <div className="metrics-filters-container">
            <div className="metrics-filter btn">
              <Checkbox
                label={`Fail (${this.state.classificationCountMap.get(filters.FAIL)})`}
                isSelected={!!this.state.filterMap.get(filters.FAIL)}
                onCheckboxChange={e => this.handleCheckboxChange(filters.FAIL)}
                key={filters.FAIL}
              />
            </div>
            <div className="metrics-filter btn">
              <Checkbox
                label={`No Data (${this.state.classificationCountMap.get(filters.NODATA)})`}
                isSelected={!!this.state.filterMap.get(filters.NODATA)}
                onCheckboxChange={e => this.handleCheckboxChange(filters.NODATA)}
                key={filters.NODATA}
              />
            </div>
            <div className="metrics-filter btn">
              <Checkbox
                label={`Pass (${this.state.classificationCountMap.get(filters.PASS)})`}
                isSelected={!!this.state.filterMap.get(filters.PASS)}
                onCheckboxChange={e => this.handleCheckboxChange(filters.PASS)}
                key={filters.PASS}
              />
            </div>
          </div>
          <div className="metrics-container-content">
            {this.state.metricGroupNamesDescByWeight.map(name => (
              <MetricGroup
                key={name}
                metricGroupName={name}
                canaryConfig={config}
                metricSetPairsByIdMap={metricSetPairsByIdMap}
                canaryAnalysisResultByIdMap={canaryAnalysisResultByIdMap}
                idListByMetricGroupNameMap={idListByMetricGroupNameMap}
                groupScoreByMetricGroupNameMap={groupScoreByMetricGroupNameMap}
                thresholds={thresholds}
                filterMap={this.state.filterMap}
              />
            ))}
          </div>
          <div className="metrics-key-container">
            <div className="metrics-key-item">
              <div className="metrics-key-symbol dot fail"></div>
              <div className="metrics-key">Fail</div>
            </div>
            <div className="metrics-key-item">
              <div className="metrics-key-symbol dot no-data"></div>
              <div className="metrics-key">No Data</div>
            </div>
            <div className="metrics-key-item">
              <div className="metrics-key-symbol dot pass"></div>
              <div className="metrics-key">Pass</div>
            </div>
            <div className="metrics-key-item">
              <div className="metrics-key-symbol">
                <FontAwesomeIcon className="exclamation" size="1x" color="black" icon={faExclamation} />
              </div>
              <div className="metrics-key">Critical</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
