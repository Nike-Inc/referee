import { action, observable } from 'mobx';
import { CanaryExecutionStatusResponse } from '../domain/CanaryExecutionStatusResponse';

export default class CanaryExecutorResultsStore {
  @observable
  canaryExecutionId = '';

  @observable
  canaryExecutionStatusResponse: CanaryExecutionStatusResponse | undefined;

  @observable
  resultsRequestComplete = false;

  @observable
  stageStatus = [];

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
  updateStageStatus(value: any): void {
    this.stageStatus = value;
  }

  @action.bound
  updateCanaryExecutionStatusResponse(canaryExecutionStatusResponse: CanaryExecutionStatusResponse): void {
    this.canaryExecutionStatusResponse = canaryExecutionStatusResponse;
  }
}
