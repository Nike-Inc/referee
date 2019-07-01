import * as React from 'react';
import { CanaryMetricConfig } from '../../domain/kayenta';
import { Button, Table } from 'react-bootstrap';

import './MetricSummaries.scss';

interface MetricProps {
  selectedGroup: string;
  groups: string[];
  metrics: CanaryMetricConfig[];
  onEdit: (metric: CanaryMetricConfig, groups: string[]) => void;
  onCopy: (name: string) => void;
  onDelete: (name: string) => void;
}

export default class MetricSummaries extends React.Component<MetricProps> {
  render(): React.ReactNode {
    const { selectedGroup, groups, metrics, onEdit, onCopy, onDelete } = this.props;
    return (
      <div className="metric-summaries">
        {metrics.length < 1 && (
          <div className="no-metrics-label">
            There are no metrics in this group. Click the add metric button to create a new metric configuration.
          </div>
        )}
        {metrics.length > 0 && (
          <Table>
            <thead>
              <tr>
                <th>Metric Name</th>
                <th>Groups</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {metrics
                .filter(metric => (selectedGroup === 'all' ? true : metric.groups.includes(selectedGroup)))
                .map(metric => (
                  <tr key={metric.name}>
                    <td>{metric.name}</td>
                    <td>{metric.groups.join(', ')}</td>
                    <td>
                      <Button
                        onClick={() => {
                          onEdit(metric, groups);
                        }}
                        size="sm"
                        variant="outline-dark"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          onCopy(metric.name);
                        }}
                        size="sm"
                        variant="outline-dark"
                      >
                        Copy
                      </Button>
                      <Button
                        onClick={() => {
                          onDelete(metric.name);
                        }}
                        size="sm"
                        variant="outline-danger"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  }
}
