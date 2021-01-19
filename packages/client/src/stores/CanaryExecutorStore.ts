import { observable, action, computed, toJS } from 'mobx';
import { CanaryExecutionRequest, CanaryScope, KayentaCredential } from '../domain/Kayenta';
import CanaryExecutionFactory from '../util/CanaryExecutionFactory';
import {
  validateAdditionalParameters,
  validateCanaryExecution,
  validateExtendedScopeParams
} from '../validation/executionValidators';
import { ofNullable, trimToEmpty } from '../util/OptionalUtils';
import log from '../util/LoggerFactory';
import { persist } from 'mobx-persist';

const METRICS_STORE = 'METRICS_STORE';
const OBJECT_STORE = 'OBJECT_STORE';

export default class CanaryExecutorStore {
  @observable
  private credentialsData: KayentaCredential[] = [];

  @persist
  @observable
  applicationName = '';

  @persist
  @observable
  metricsAccountName = '';

  @persist
  @observable
  storageAccountName = '';

  @persist('object')
  @observable
  private internalCanaryExecutionRequestObject: CanaryExecutionRequest = CanaryExecutionFactory.createNewCanaryExecutionRequest();

  @observable
  controlExtendedScopes: KvPair[] = [];

  @observable
  experimentExtendedScopes: KvPair[] = [];

  @observable
  touched: KvMap<boolean> = {};

  @observable
  hasTheRunButtonBeenClicked = false;

  @persist
  @observable
  testingType = 'AA';

  @observable
  canaryExecutionId = '';

  @observable
  resultsRequestComplete = false;

  @observable
  stageStatus = [];

  @observable
  isAccordionExpanded = false;

  getExtendedScopeParams(type: string) {
    return type === 'control' ? this.controlExtendedScopes : this.experimentExtendedScopes;
  }

  private replaceExtendedScopeParams(type: string, params: KvPair[]) {
    if (type === 'control') {
      this.controlExtendedScopes = observable.array(params);
    } else {
      this.experimentExtendedScopes = observable.array(params);
    }
  }

  @computed
  get errors(): KvMap<string> {
    const canaryExecutionRequestObjectErrors = validateCanaryExecution(this.internalCanaryExecutionRequestObject)
      .errors;
    const controlESErrors = validateExtendedScopeParams('control', this.controlExtendedScopes).errors;
    const experimentESErrors = validateExtendedScopeParams('experiment', this.experimentExtendedScopes).errors;
    const additionalParametersErrors = validateAdditionalParameters(
      this.applicationName,
      this.metricsAccountName,
      this.storageAccountName
    ).errors;
    return Object.assign(
      {},
      canaryExecutionRequestObjectErrors,
      controlESErrors,
      experimentESErrors,
      additionalParametersErrors
    );
  }

  @computed
  get isExecutionRequestValid(): boolean {
    let isValid = true;

    if (!validateCanaryExecution(this.internalCanaryExecutionRequestObject).isValid) {
      isValid = false;
    }

    if (
      !(
        validateExtendedScopeParams('control', this.controlExtendedScopes).isValid &&
        validateExtendedScopeParams('experiment', this.experimentExtendedScopes).isValid
      )
    ) {
      isValid = false;
    }

    if (!validateAdditionalParameters(this.applicationName, this.metricsAccountName, this.storageAccountName).isValid) {
      isValid = false;
    }

    return isValid;
  }

  @computed
  get canaryExecutionRequestObject(): CanaryExecutionRequest {
    const mutableRequestCopy = toJS(this.internalCanaryExecutionRequestObject);
    // reduce array of key value pairs to a js dict object
    mutableRequestCopy.scopes.default.controlScope.extendedScopeParams = this.controlExtendedScopes.reduce(
      (extendedScopeParams, kvPair) => {
        extendedScopeParams[kvPair.key] = kvPair.value;
        return extendedScopeParams;
      },
      {} as KvMap<string>
    );
    // reduce array of key value pairs to a js dict object
    mutableRequestCopy.scopes.default.experimentScope.extendedScopeParams = this.experimentExtendedScopes.reduce(
      (extendedScopeParams, kvPair) => {
        extendedScopeParams[kvPair.key] = kvPair.value;
        log.info(extendedScopeParams);
        return extendedScopeParams;
      },
      {} as KvMap<string>
    );
    return mutableRequestCopy;
  }

  @computed
  get metricStoreAccounts(): string[] {
    const accounts: string[] = [];

    accounts.push(
      ...this.credentialsData
        .filter(credential => credential.supportedTypes.includes(METRICS_STORE))
        .map(credential => credential.name)
    );

    return accounts;
  }

  @computed
  get storageAccounts(): string[] {
    const accounts: string[] = [];

    accounts.push(
      ...this.credentialsData
        .filter(credential => credential.supportedTypes.includes(OBJECT_STORE))
        .map(credential => credential.name)
    );

    return accounts;
  }

  @action.bound
  addNewExtendedScopeParam(scopeType: string): void {
    this.getExtendedScopeParams(scopeType).push({ key: '', value: '' });
  }

  @action.bound
  updateExtendedScopeParamKey(scopeType: string, index: number, value: string): void {
    this.getExtendedScopeParams(scopeType)[index].key = value;
  }

  @action.bound
  updateExtendedScopeParamValue(scopeType: string, index: number, value: string): void {
    this.getExtendedScopeParams(scopeType)[index].value = value;
  }

  @action.bound
  deleteExtendedScopeParam(scopeType: string, index: number): void {
    this.replaceExtendedScopeParams(scopeType, [
      ...this.getExtendedScopeParams(scopeType).slice(0, index),
      ...this.getExtendedScopeParams(scopeType).slice(index + 1)
    ]);
  }

  @action.bound
  setKayentaCredentials(credentialsData: KayentaCredential[]): void {
    this.credentialsData = credentialsData;
    // Set the storage account name to the first cred that is an object store, if the storage account name has not already been set.
    this.storageAccountName = trimToEmpty(this.storageAccountName)
      .or(() => ofNullable(credentialsData.find(c => c.supportedTypes.includes(OBJECT_STORE))).map<string>(c => c.name))
      .orElse('');
  }

  @action.bound
  setCanaryExecutionRequestObject(value: CanaryExecutionRequest): void {
    this.internalCanaryExecutionRequestObject = value;
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
    this.internalCanaryExecutionRequestObject.thresholds.marginal = value;
  }

  @action.bound
  updatePassThreshold(value: number): void {
    this.internalCanaryExecutionRequestObject.thresholds.pass = value;
  }

  @action.bound
  updateCanaryScope(newScope: CanaryScope, type: string) {
    if (type === 'control') {
      this.internalCanaryExecutionRequestObject.scopes.default.controlScope = newScope;
      if (this.testingType === 'AA') {
        this.internalCanaryExecutionRequestObject.scopes.default.experimentScope = newScope;
      }
    } else if (type === 'experiment') {
      this.internalCanaryExecutionRequestObject.scopes.default.experimentScope = newScope;
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
}
