import * as React from 'react';
import { observer } from 'mobx-react';
import './IndividualMetricView.scss';
import { Line } from 'react-chartjs-2';
import NumberFormat from 'react-number-format';
import { CanaryAnalysisResult, MetricSetPair } from '../../domain/Kayenta';
import humanFormat from 'human-format';
import { metricSourceIntegrations } from '../../metricSources';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Optional from 'optional-js';
import { mapIfPresent, mapIfPresentOrElse, safeGet } from '../../util/OptionalUtils';

interface IndividualMetricViewProps {
  selectedMetric: string;
  metricSourceType: string;
  lifetime: number;
  canaryAnalysisResultByIdMap: KvMap<CanaryAnalysisResult>;
  metricSetPairsByIdMap: KvMap<MetricSetPair>;
}

const ROUNDING_POSITION: number = 4;
const MIN_TO_MS_CONVERSION: number = 60000;

@observer
export default class IndividualMetricView extends React.Component<IndividualMetricViewProps> {
  render(): React.ReactNode {
    const {
      selectedMetric,
      metricSourceType,
      lifetime,
      canaryAnalysisResultByIdMap,
      metricSetPairsByIdMap
    } = this.props;

    const baselineData = safeGet(() => metricSetPairsByIdMap[selectedMetric].values.control).orElse([]);
    const canaryData = safeGet(() => metricSetPairsByIdMap[selectedMetric].values.experiment).orElse([]);
    const startTimeMillis = safeGet(() => metricSetPairsByIdMap[selectedMetric].scopes.control.startTimeMillis).orElse(
      0
    );
    const stepMillis = safeGet(() => metricSetPairsByIdMap[selectedMetric].scopes.control.stepMillis).orElse(0);

    // Temporary fix to create x axis labels by filtering NaNs out of data until we determine more robust solution
    const filteredControlDataPoints = baselineData.filter(function(value) {
      return !(value.toString() === 'NaN');
    });

    const timeLabels: number[] = [];
    let scale: number = 0;
    if (lifetime > 0 && filteredControlDataPoints.length > 0) {
      const lifetimeMillis: number = lifetime * MIN_TO_MS_CONVERSION;
      scale = Math.round(lifetimeMillis / filteredControlDataPoints.length);
    } else {
      scale = stepMillis;
    }
    for (let i = 0, j = startTimeMillis; i < filteredControlDataPoints.length; i++, j += scale) {
      timeLabels.push(j);
    }

    const data = {
      labels: timeLabels.slice(),
      datasets: [
        {
          label: 'Canary',
          backgroundColor: 'rgb(255,225,0)',
          borderColor: 'rgb(161,161,161, 0.2)',
          data: canaryData.slice()
        },
        {
          label: 'Baseline',
          backgroundColor: 'rgb(211, 211, 211)',
          borderColor: 'rgb(211, 211, 211)',
          data: baselineData.slice()
        }
      ]
    };

    return (
      <div className="individual-metric-view">
        <div className="graph-card">
          <div className="metric-graph-title">{canaryAnalysisResultByIdMap[selectedMetric].name}</div>
          <div className="metric-graph-data">
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
                    radius: 0
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
          </div>
        </div>
        <div className="cards-row">
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
          {mapIfPresent(Optional.ofNullable(metricSourceIntegrations[metricSourceType].queryMapper), queryMapper => {
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
          })}
        </div>
      </div>
    );
  }
}
