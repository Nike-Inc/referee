import * as React from 'react';
import { observer } from 'mobx-react';
import { GroupTabsSection } from './GroupTabsSection';
import { Alert, Button } from 'react-bootstrap';
import { RefObject } from 'react';
import MetricSummaries from './MetricSummaries';
import TitledSection from '../../layout/titledSection';
import { CanaryMetricConfig } from '../../domain/kayenta';
import ConfigureMetricModel from './ConfigureMetricModal';

import './MetricsSection.scss';

export const MetricsSection = observer(
  ({
    groups,
    selectedGroup,
    isEditCurGroup,
    updateSelectedGroup,
    finishEditingCurrentGroup,
    editCurrentGroup,
    groupEdit,
    updateGroupName,
    createNewGroup,
    deleteGroup,
    metrics,
    editMetric,
    copyMetric,
    deleteMetric,
    pushModal,
    popModal,
    createOrUpdateMetric,
    touched,
    errors
  }: {
    groups: string[];
    selectedGroup: string;
    isEditCurGroup: boolean;
    updateSelectedGroup: (group: string) => void;
    finishEditingCurrentGroup: () => void;
    editCurrentGroup: () => void;
    groupEdit: string & RefObject<HTMLInputElement>;
    updateGroupName: (curName: string, newName: string) => void;
    createNewGroup: () => void;
    deleteGroup: (group: string) => void;
    metrics: CanaryMetricConfig[];
    editMetric: (metric: CanaryMetricConfig, groups: string[]) => void;
    copyMetric: (metricName: string) => void;
    deleteMetric: (metricName: string) => void;
    pushModal: (modal: JSX.Element) => void;
    popModal: () => void;
    createOrUpdateMetric: (newMetric: CanaryMetricConfig, existingMetric: CanaryMetricConfig | undefined) => void;
    touched: boolean;
    errors: string[];
  }): JSX.Element => {
    return (
      <TitledSection title="Metrics" additionalClassname="form-metrics-container">
        <div>
          <GroupTabsSection
            groups={groups}
            selectedGroup={selectedGroup}
            isEditCurGroup={isEditCurGroup}
            updateSelectedGroup={updateSelectedGroup}
            finishEditingCurrentGroup={finishEditingCurrentGroup}
            editCurrentGroup={editCurrentGroup}
            groupEdit={groupEdit}
            updateGroupName={updateGroupName}
            createNewGroup={createNewGroup}
            deleteGroup={deleteGroup}
          />
          <div className="metrics">
            <div className="metric-summaries-container">
              <MetricSummaries
                groups={groups}
                selectedGroup={selectedGroup}
                metrics={metrics}
                onEdit={editMetric}
                onCopy={copyMetric}
                onDelete={deleteMetric}
              />
              <div className="metric-summaries-footer">
                <Button
                  onClick={() => {
                    pushModal(
                      <ConfigureMetricModel
                        groups={groups}
                        cancel={popModal}
                        submit={(a, b) => {
                          createOrUpdateMetric(a, b);
                          popModal();
                        }}
                      />
                    );
                  }}
                  size="sm"
                  variant="outline-dark"
                >
                  Add Metric
                </Button>
              </div>
            </div>
          </div>
        </div>
        {touched && errors.map(error => <Alert variant="danger">{error}</Alert>)}
      </TitledSection>
    );
  }
);
