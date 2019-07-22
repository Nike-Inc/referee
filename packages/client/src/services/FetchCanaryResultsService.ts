import { stores } from '../stores';
import { kayentaApiService } from './index';
import { delay } from 'q';
import { CanaryExecutionStatusResponse } from '../domain/Kayenta';

const { configEditorStore, canaryExecutorStore, reportStore } = stores;
let response: CanaryExecutionStatusResponse | any = {};
const SUCCESS = 'succeeded';

export default class FetchCanaryResultsService {
  async pollForCanaryExecutionComplete(canaryExecutionId: string): Promise<void> {
    kayentaApiService.fetchCredentials().then(data => canaryExecutorStore.setKayentaCredentials(data));
    canaryExecutorStore.setCanaryExecutionId(canaryExecutionId);

    do {
      const data = async () => {
        await delay(1000);
        response = await kayentaApiService.fetchCanaryExecutionStatusResponse(canaryExecutorStore.canaryExecutionId);
        canaryExecutorStore.updateStageStatus(response.stageStatus);
      };
      await data();
    } while (!response.complete);

    if (response.status === SUCCESS) {
      reportStore.updateFromCanaryResponse(response);
      configEditorStore.setCanaryConfigObject(response.config);
      canaryExecutorStore.setCanaryExecutionRequestObject(response.canaryExecutionRequest);
    }

    canaryExecutorStore.updateResultsRequestComplete();
  }
}
