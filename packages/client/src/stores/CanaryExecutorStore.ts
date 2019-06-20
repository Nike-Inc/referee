import { observable, action, computed } from 'mobx';
import KayentaCredential from '../domain/KayentaCredential';
import { CanaryExecutionRequest, CanaryScope } from '../domain/CanaryExecutionRequestTypes';
import CanaryExecutionFactory from '../util/CanaryExecutionFactory';
import { KvMap } from '../domain/CustomTypes';
import { validateCanaryExecution } from '../validation/executionValidators';

const METRICS_STORE = 'METRICS_STORE';
const OBJECT_STORE = 'OBJECT_STORE';

export default class CanaryExecutorStore {
  @observable
  private credentialsData: KayentaCredential[] = [];

  @observable
  applicationName = '';

  @observable
  metricsAccountName = '';

  @observable
  storageAccountName = '';

  @observable
  canaryExecutionRequestObject: CanaryExecutionRequest = CanaryExecutionFactory.createNewCanaryExecutionRequest();

  @observable
  touched: KvMap<boolean> = {};

  @observable
  hasTheRunButtonBeenClicked = false;

  @observable
  testingType = 'AA';

  @computed
  get errors(): KvMap<string> {
    return validateCanaryExecution(this.canaryExecutionRequestObject).errors;
  }

  @computed
  get isExecutionRequestValid(): boolean {
    return validateCanaryExecution(this.canaryExecutionRequestObject).isValid;
  }

  @computed
  get metricStoreAccounts(): string[] {
    const accounts = [];

    accounts.push(
      ...this.credentialsData
        .filter(credential => credential.supportedTypes.includes(METRICS_STORE))
        .map(credential => credential.name)
    );

    return accounts;
  }

  @computed
  get storageAccounts(): string[] {
    const accounts = [];

    accounts.push(
      ...this.credentialsData
        .filter(credential => credential.supportedTypes.includes(OBJECT_STORE))
        .map(credential => credential.name)
    );

    return accounts;
  }

  @action.bound
  setKayentaCredentials(credentialsData: KayentaCredential[]): void {
    this.credentialsData = credentialsData;
  }

  @action.bound
  updateApplicationName(value: string): void {
    this.applicationName = value;
  }

  @action.bound
  updateMetricsAccountName(value: string): void {
    this.metricsAccountName = value;
  }

  @action.bound
  updateStorageAccountName(value: string): void {
    this.storageAccountName = value;
  }

  @action.bound
  updateMarginalThreshold(value: number): void {
    this.canaryExecutionRequestObject.thresholds.marginal = value;
  }

  @action.bound
  updatePassThreshold(value: number): void {
    this.canaryExecutionRequestObject.thresholds.pass = value;
  }

  @action.bound
  updateCanaryScope(newScope: CanaryScope, type: string) {
    if (type === 'control') {
      this.canaryExecutionRequestObject.scopes.default.controlScope = newScope;
      if (this.testingType === 'AA') {
        this.canaryExecutionRequestObject.scopes.default.experimentScope = newScope;
      }
    } else if (type === 'experiment') {
      this.canaryExecutionRequestObject.scopes.default.experimentScope = newScope;
    }
  }

  @action.bound
  updateTestingType(value: string): void {
    this.testingType = value;
  }

  @action.bound
  touch(id: string): void {
    this.touched[id] = true;
  }

  @action.bound
  markHasTheRunButtonBeenClickedFlagAsTrue(): void {
    this.hasTheRunButtonBeenClicked = true;
  }
}
