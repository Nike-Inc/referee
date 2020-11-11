import ConfigEditorStore from './ConfigEditorStore';
import DocsStore from './DocsStore';
import ListStore from './ListStore';
import CanaryExecutorStore from './CanaryExecutorStore';
import ReportStore from './ReportStore';
import { create } from 'mobx-persist';

export const stores = {
  configEditorStore: new ConfigEditorStore(),
  docsStore: new DocsStore(),
  modalStore: new ListStore(),
  errorStore: new ListStore(),
  canaryExecutorStore: new CanaryExecutorStore(),
  reportStore: new ReportStore()
};

const hydrate = create({
  storage: localStorage,
  jsonify: true
});

hydrate('configEditor', stores.configEditorStore);
hydrate('canaryExecutor', stores.canaryExecutorStore);
