import { observer } from 'mobx-react';
import TitledSection from '../../layout/titledSection';
import { InlineTextGroup } from '../../layout/InlineTextGroup';
import * as React from 'react';
import Select from 'react-select';
import './MetadataSection.scss';
import { FormLabel, Alert } from 'react-bootstrap';

export const MetadataSection = observer(
  ({
    name,
    metricsAccountName,
    storageAccountName,
    metricAccounts,
    storageAccounts,
    updateApplicationName,
    updateMetricsAccountName,
    updateStorageAccountName,
    touch,
    touched,
    errors,
    hasTheRunButtonBeenClicked
  }: {
    name: string;
    metricsAccountName: string;
    storageAccountName: string;
    metricAccounts: string[];
    storageAccounts: string[];
    updateApplicationName: (value: string) => void;
    updateMetricsAccountName: (value: string) => void;
    updateStorageAccountName: (value: string) => void;
    touch: (name: string) => void;
    touched: KvMap<boolean>;
    errors: KvMap<string>;
    hasTheRunButtonBeenClicked: boolean;
  }): JSX.Element => {
    return (
      <TitledSection title="Metadata" additionalClassname="metadata">
        <InlineTextGroup
          id="application-name"
          label="Application Name"
          placeHolderText="application name"
          value={name}
          onChange={(e: any) => {
            updateApplicationName(e.target.value);
          }}
          onBlur={() => {
            touch('application-name');
          }}
          touched={touched['application-name'] || hasTheRunButtonBeenClicked}
          error={errors['application']}
        />
        <div>
          <div className="dropdown-row">
            <FormLabel id="dropdown-label">Metrics Account</FormLabel>
            <div className="dropdown-content-container">
              <Select
                id="dropdown"
                label="Metrics Account"
                value={{ value: metricsAccountName, label: metricsAccountName }}
                options={metricAccounts.map(account => ({ value: account, label: account }))}
                onChange={(e: any) => {
                  updateMetricsAccountName(e.value);
                }}
              />
              <div className="error-container">
                {hasTheRunButtonBeenClicked && errors['metricsAccountName'] && (
                  <Alert variant="danger">{errors['metricsAccountName']}</Alert>
                )}
              </div>
            </div>
          </div>
          <div className="dropdown-row">
            <FormLabel id="dropdown-label">Storage Account</FormLabel>
            <div className="dropdown-content-container">
              <Select
                id="dropdown"
                label="Storage Account"
                value={{ value: storageAccountName, label: storageAccountName }}
                options={storageAccounts.map(account => ({ value: account, label: account }))}
                onChange={(e: any) => {
                  updateStorageAccountName(e.value);
                }}
              />
              <div className="error-container">
                {hasTheRunButtonBeenClicked && errors['storageAccountName'] && (
                  <Alert variant="danger">{errors['storageAccountName']}</Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </TitledSection>
    );
  }
);
