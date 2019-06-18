import { action, observable } from 'mobx';
import { CanaryExecutionResponse } from '../domain/CanaryExecutionResponse';

export default class CanaryExecutorResultsStore {
  @observable
  canaryExecutionId = '';

  @action.bound
  setCanaryExecutionId(canaryExecutionResponseObject: CanaryExecutionResponse): void {
    this.canaryExecutionId = canaryExecutionResponseObject.canaryExecutionId;
  }
}
