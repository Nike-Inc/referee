import React from 'react';
import { observer } from 'mobx-react';
import './IndividualMetricView.scss';
import { Line } from 'react-chartjs-2';
import NumberFormat from 'react-number-format';
import { CanaryAnalysisResult, CanaryConfig, CanaryMetricConfig, MetricSetPair } from '../../domain/Kayenta';
import humanFormat from 'human-format';
import { defaultGraphDataMapper, metricSourceIntegrations } from '../../metricSources';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Optional from 'optional-js';
import { mapIfPresent, mapIfPresentOrElse, ofNullable, safeGet } from '../../util/OptionalUtils';
import { SIGNAL_FX_SERVICE_TYPE } from '../../metricSources/SignalFx';
import classNames from 'classnames';
import { Popover } from '../../layout/Popover';

interface IndividualMetricViewProps {
  config: CanaryConfig;
  selectedMetric: string;
  metricSourceType: string;
  lifetime: number;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
}

const roundToFourDecimalPlaces = (num: number) => Math.round(num * 10000) / 10000;

const ROUNDING_POSITION: number = 4;

export const filterNansFromData = (data: number[]): number[] => {
  return data.filter(value => {
    return !(value.toString() === 'NaN');
  });
};

export const calculateTimeLabels = (
  selectedMetric: string,
  metricSourceType: string,
  lifetime: number,
  metricSetPairsByIdMap: KvMap<MetricSetPair>,
  filteredControlDataPointsLength: number,
  startTimeMillis: number,
  stepMillis: number
): number[] => {
  let timeLabels: number[] = [];

  if (metricSourceType === SIGNAL_FX_SERVICE_TYPE) {
    const { controlTimeLabels } = mapIfPresent(
      Optional.ofNullable(metricSourceIntegrations()[metricSourceType].graphData),
      graphDataMapper => {
        return safeGet(() => graphDataMapper(metricSetPairsByIdMap[selectedMetric].attributes));
      }
    );
    timeLabels = controlTimeLabels;
  }

  if (!timeLabels || !timeLabels.length) {
    const defaultTimeLabels = defaultGraphDataMapper(
      lifetime,
      filteredControlDataPointsLength,
      startTimeMillis,
      stepMillis
    );
    timeLabels = defaultTimeLabels.controlTimeLabels;
  }
  return timeLabels;
};

@observer
export default class IndividualMetricView extends React.Component<IndividualMetricViewProps> {
  render(): React.ReactNode {
    const {
      config,
      selectedMetric,
      metricSourceType,
      lifetime,
      canaryAnalysisResultByIdMap,
      metricSetPairsByIdMap
    } = this.props;

    const controlData = safeGet(() => metricSetPairsByIdMap[selectedMetric].values.control).orElse([]);
    const filteredControlDataPointsLength: number = filterNansFromData(controlData).length;
    const experimentData = safeGet(() => metricSetPairsByIdMap[selectedMetric].values.experiment).orElse([]);
    const startTimeMillis = safeGet(() => metricSetPairsByIdMap[selectedMetric].scopes.control.startTimeMillis).orElse(
      0
    );
    const stepMillis = safeGet(() => metricSetPairsByIdMap[selectedMetric].scopes.control.stepMillis).orElse(0);

    const timeLabels: number[] = calculateTimeLabels(
      selectedMetric,
      metricSourceType,
      lifetime,
      metricSetPairsByIdMap,
      filteredControlDataPointsLength,
      startTimeMillis,
      stepMillis
    );

    const data = {
      labels: timeLabels.slice(),
      datasets: [
        {
          label: 'Baseline',
          backgroundColor: 'rgb(6, 89, 137)',
          borderColor: 'rgb(6, 89, 137)',
          borderWidth: 2,
          fill: false,
          data: controlData.slice().map(n => roundToFourDecimalPlaces(n))
        },
        {
          label: 'Canary',
          backgroundColor: 'rgb(240, 111, 31)',
          borderColor: 'rgb(240, 111, 31)',
          borderWidth: 2,
          fill: false,
          data: experimentData.slice().map(n => roundToFourDecimalPlaces(n))
        }
      ]
    };

    const metricName = safeGet(() => canaryAnalysisResultByIdMap[selectedMetric].name).orElse('');
    const canaryMetricConfig: CanaryMetricConfig = ofNullable(
      config.metrics.find(canaryMetricConfig => canaryMetricConfig.name === metricName)
    ).orElseThrow(() => new Error(`Failed to find CanaryMetricConfig for ${metricName}`));

    return (
      <div className="individual-metric-view">
        {filteredControlDataPointsLength < 50 && (
          <div className="info-card warning-border">
            <div className="info-content">
              This metric has fewer than 50 data points
              <Popover
                header="What is this?"
                text="In order to produce statistically accurate results, your metrics need to report at least 50 data
                points per interval (DPI). Reporting less than 50 DPI will produce warnings in your canary result."
                color="black"
              />
            </div>
          </div>
        )}
        {safeGet(() => canaryAnalysisResultByIdMap[selectedMetric].classification).isPresent() && (
          <div
            className={classNames('info-card', {
              'pass-border': canaryAnalysisResultByIdMap[selectedMetric].classification === 'Pass',
              'fail-border': canaryAnalysisResultByIdMap[selectedMetric].classification !== 'Pass'
            })}
          >
            <div className="info-content">
              This {canaryMetricConfig.analysisConfigurations.canary.critical && 'critical '} metric has{' '}
              {canaryAnalysisResultByIdMap[selectedMetric].classification === 'Pass' ? 'passed' : 'failed'}
            </div>
          </div>
        )}
        <div className="graph-card">
          <div className="metric-graph-title">
            {safeGet(() => canaryAnalysisResultByIdMap[selectedMetric].name).orElse('')}
          </div>
          <div className="metric-graph-data">
            <LineGraph data={data} />
          </div>
        </div>
        <div className="cards-row">
          {canaryAnalysisResultByIdMap[selectedMetric] && (
            <DataTable
              selectedMetric={selectedMetric}
              metricSourceType={metricSourceType}
              lifetime={lifetime}
              canaryAnalysisResultByIdMap={canaryAnalysisResultByIdMap}
            />
          )}
          {mapIfPresent(Optional.ofNullable(metricSourceIntegrations()[metricSourceType].queryMapper), queryMapper => {
            const { control, experiment, displayLanguage } = mapIfPresentOrElse(
              Optional.ofNullable(metricSetPairsByIdMap[selectedMetric]),
              map => {
                return queryMapper(map.attributes);
              },
              () => {
                // TODO add card here that pops up saying there has been an error displaying the data
                return {
                  control: '',
                  experiment: '',
                  displayLanguage: ''
                };
              }
            );
            const lang = Optional.ofNullable(displayLanguage).orElse('none');
            return <QueryCards lang={lang} control={control} experiment={experiment} />;
          })}
        </div>
      </div>
    );
  }
}

const LineGraph = ({ data }: { data: {} }): JSX.Element => {
  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontFamily: 'Helvetica Neue',
            fontColor: 'rgb(0,0,0, 0.8)',
            fontSize: 15
          }
        },
        elements: {
          point: {
            radius: 1
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          titleFontSize: 15,
          bodyFontSize: 15
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          gridLines: {
            color: 'rgb(0,0,0)'
          },
          xAxes: [
            {
              stacked: true,
              // TODO update axis type for non-time stamp labels
              type: 'time',
              time: {
                unit: 'minute',
                tooltipFormat: 'll HH:mm:ss'
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10,
                fontColor: 'rgb(0,0,0, 0.8)',
                minRotation: 20,
                fontSize: 15
              },
              gridLines: {
                color: 'rgb(0,0,0, 0.3)'
              }
            }
          ],
          yAxes: [
            {
              stacked: false,
              beginAtZero: true,
              ticks: {
                fontColor: 'rgb(0,0,0, 0.8)',
                fontSize: 15,
                callback(value: number) {
                  if (value > 1000) {
                    return humanFormat(value);
                  }
                  return value;
                }
              },
              gridLines: {
                color: 'rgb(0,0,0, 0.3)'
              }
            }
          ]
        }
      }}
    />
  );
};

const DataTable = ({
  selectedMetric,
  metricSourceType,
  lifetime,
  canaryAnalysisResultByIdMap
}: {
  selectedMetric: string;
  metricSourceType: string;
  lifetime: number;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
}): JSX.Element => {
  return (
    <div className="data-table-card">
      <div className="data-table">
        <div className="data-table-column">
          <div className="data-table-column-title"></div>
          <div className="data-table-row-title">Count</div>
          <div className="data-table-row-title">Average</div>
          <div className="data-table-row-title">Min</div>
          <div className="data-table-row-title">Max</div>
          <div className="data-table-row-title">Std Dev</div>
        </div>

        <div className="data-table-column">
          <div className="data-table-column-title">Baseline</div>
          <div className="data-table-row-item">
            {canaryAnalysisResultByIdMap[selectedMetric].controlMetadata.stats.count}
          </div>
          <NumberFormat
            className="data-table-row-item"
            value={parseFloat(
              canaryAnalysisResultByIdMap[selectedMetric].controlMetadata.stats.mean.toFixed(ROUNDING_POSITION)
            )}
            thousandSeparator
          />
          <NumberFormat
            className="data-table-row-item"
            value={parseFloat(
              canaryAnalysisResultByIdMap[selectedMetric].controlMetadata.stats.min.toFixed(ROUNDING_POSITION)
            )}
            thousandSeparator
          />
          <NumberFormat
            className="data-table-row-item"
            value={parseFloat(
              canaryAnalysisResultByIdMap[selectedMetric].controlMetadata.stats.max.toFixed(ROUNDING_POSITION)
            )}
            thousandSeparator
          />
          <NumberFormat
            className="data-table-row-item"
            value={parseFloat(
              canaryAnalysisResultByIdMap[selectedMetric].controlMetadata.stats.std.toFixed(ROUNDING_POSITION)
            )}
            thousandSeparator
          />
        </div>

        <div className="data-table-column">
          <div className="data-table-column-title">Canary</div>
          <div className="data-table-row-item">
            {canaryAnalysisResultByIdMap[selectedMetric].experimentMetadata.stats.count}
          </div>
          <NumberFormat
            className="data-table-row-item"
            value={parseFloat(
              canaryAnalysisResultByIdMap[selectedMetric].experimentMetadata.stats.mean.toFixed(ROUNDING_POSITION)
            )}
            thousandSeparator
          />
          <NumberFormat
            className="data-table-row-item"
            value={parseFloat(
              canaryAnalysisResultByIdMap[selectedMetric].experimentMetadata.stats.min.toFixed(ROUNDING_POSITION)
            )}
            thousandSeparator
          />
          <NumberFormat
            className="data-table-row-item"
            value={parseFloat(
              canaryAnalysisResultByIdMap[selectedMetric].experimentMetadata.stats.max.toFixed(ROUNDING_POSITION)
            )}
            thousandSeparator
          />
          <NumberFormat
            className="data-table-row-item"
            value={parseFloat(
              canaryAnalysisResultByIdMap[selectedMetric].experimentMetadata.stats.std.toFixed(ROUNDING_POSITION)
            )}
            thousandSeparator
          />
        </div>
      </div>
    </div>
  );
};

const QueryCards = ({
  lang,
  control,
  experiment
}: {
  lang: string;
  control: string;
  experiment: string;
}): JSX.Element => {
  return (
    <div className="queries-card">
      <div className="query-section">
        <div className="query-section-title">Baseline Query</div>
        <div className="query-section-content">
          <SyntaxHighlighter language={lang} wrapLines={true}>
            {control}
          </SyntaxHighlighter>
        </div>
      </div>
      <div className="query-section">
        <div className="query-section-title">Canary Query</div>
        <div className="query-section-content">
          <SyntaxHighlighter language={lang} wrapLines={true}>
            {experiment}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};
