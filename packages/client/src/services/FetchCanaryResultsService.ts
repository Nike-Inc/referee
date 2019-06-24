import { stores } from '../stores';
import { kayentaApiService } from './index';
import { delay } from 'q';
import { CanaryExecutionStatusResponse } from '../domain/CanaryExecutionStatusResponse';

const { configEditorStore, canaryExecutorStore, resultsStore } = stores;
let response: CanaryExecutionStatusResponse | any = {};
const SUCCESS = 'succeeded';

export default class FetchCanaryResultsService {
  async fetchCanaryResults(canaryExecutionId: string): Promise<void> {
    kayentaApiService.fetchCredentials().then(data => canaryExecutorStore.setKayentaCredentials(data));
    resultsStore.setCanaryExecutionId(canaryExecutionId);

    do {
      const data = async () => {
        await delay(1000);
        response = await kayentaApiService.fetchCanaryRunStatusAndResults(resultsStore.canaryExecutionId);
        resultsStore.updateStageStatus(response.stageStatus);
      };
      await data();
    } while (!response.complete);

    if (response.status === SUCCESS) {
      resultsStore.updateCanaryExecutionStatusResponse(response);
      configEditorStore.setCanaryConfigObject(response.config);
      canaryExecutorStore.setCanaryExecutionRequestObject(response.canaryExecutionRequest);
    }

    resultsStore.updateResultsRequestComplete();
  }
}
