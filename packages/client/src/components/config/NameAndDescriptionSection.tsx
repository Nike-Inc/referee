import * as React from 'react';
import { observer } from 'mobx-react';
import TitledSection from '../../layout/titledSection';
import { TextInputGroup } from '../../layout/TextInputGroup';
import './NameAndDescriptionSection.scss';
import { SelectInputGroup } from '../../layout/SelectInputGroup';
import { metricSourceTypes } from '../../metric-sources';

export const NameAndDescriptionSection = observer(
  ({
    metricSourceType,
    name,
    description,
    updateMetricSourceType,
    updateConfigName,
    updateConfigDescription,
    touch,
    touched,
    errors,
    hasTheCopyOrSaveButtonBeenClicked,
    hasConfiguredMetrics
  }: {
    metricSourceType: string;
    name: string;
    description: string;
    updateMetricSourceType: (value: string) => void;
    updateConfigName: (value: string) => void;
    updateConfigDescription: (value: string) => void;
    touch: (name: string) => void;
    touched: KvMap<boolean>;
    errors: KvMap<string>;
    hasTheCopyOrSaveButtonBeenClicked: boolean;
    hasConfiguredMetrics: boolean
  }): JSX.Element => {
    return (
      <TitledSection title="Metadata" additionalClassname="name-and-description">
        <SelectInputGroup
          options={metricSourceTypes}
          name="metric-source-type"
          label="Metric Source Type"
          value={metricSourceType}
          onChange={(value: string) => {
            updateMetricSourceType(value);
          }}
          disabled={hasConfiguredMetrics}
          disabledMessage="You must delete all metrics from the metrics section to change the metric source type"
          onBlur={() => {
            touch('metricSourceType');
          }}
          touched={touched['metricSourceType']}
          error={errors['metricSourceType']}
        />
        <TextInputGroup
          name="config-name"
          label="Configuration Name"
          value={name}
          onChange={(e: any) => {
            updateConfigName(e.target.value);
          }}
          onBlur={() => {
            touch('metricGroupName');
          }}
          touched={touched['metricGroupName'] || hasTheCopyOrSaveButtonBeenClicked}
          error={errors['metricGroupName']}
        />
        <TextInputGroup
          name="config-description"
          label="Configuration Description"
          value={description}
          area={true}
          rows="1"
          onChange={(e: any) => {
            updateConfigDescription(e.target.value);
          }}
          onBlur={() => {
            touch('description');
          }}
          touched={touched['description'] || hasTheCopyOrSaveButtonBeenClicked}
          error={errors['description']}
        />
      </TitledSection>
    );
  }
);
