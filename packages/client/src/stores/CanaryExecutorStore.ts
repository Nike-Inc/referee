import { observable, action, computed } from 'mobx';
import KayentaCredential from '../domain/KayentaCredential';

const METRICS_STORE = 'METRICS_STORE';

export default class CanaryExecutorStore {
  @observable
  private credentialsData: KayentaCredential[] = [];

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

  @action.bound
  setKayentaCredentials(credentialsData: KayentaCredential[]): void {
    this.credentialsData = credentialsData;
  }
}
