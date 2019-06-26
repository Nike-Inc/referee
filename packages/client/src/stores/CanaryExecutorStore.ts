import { observable, action, computed } from 'mobx';
import {
  CanaryExecutionRequest,
  CanaryExecutionStatusResponse,
  CanaryScope,
  KayentaCredential
} from '../domain/Kayenta';
import CanaryExecutionFactory from '../util/CanaryExecutionFactory';
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

  @observable
  canaryExecutionId = '';

  @observable
  canaryExecutionStatusResponse?: CanaryExecutionStatusResponse;

  @observable
  resultsRequestComplete = false;

  @observable
  stageStatus = [];

  @observable
  isAccordionExpanded = false;

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
  setCanaryExecutionRequestObject(value: CanaryExecutionRequest): void {
    this.canaryExecutionRequestObject = value;
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

  @action.bound
  setCanaryExecutionId(canaryExecutionId: string): void {
    this.canaryExecutionId = canaryExecutionId;
  }

  @action.bound
  updateResultsRequestComplete(): void {
    this.resultsRequestComplete = true;
  }

  @action.bound
  clearResultsRequestComplete(): void {
    this.resultsRequestComplete = false;
  }

  @action.bound
  toggleIsAccordionExpanded(): void {
    this.isAccordionExpanded = !this.isAccordionExpanded;
  }

  @action.bound
  resetIsAccordionExpanded(): void {
    this.isAccordionExpanded = false;
  }

  @action.bound
  updateStageStatus(value: any): void {
    this.stageStatus = value;
  }

  @action.bound
  updateCanaryExecutionStatusResponse(canaryExecutionStatusResponse: CanaryExecutionStatusResponse): void {
    this.canaryExecutionStatusResponse = canaryExecutionStatusResponse;
  }
}
