import ConfigEditorStore from './ConfigEditorStore';
import DocsStore from './DocsStore';
import StackStore from './StackStore';
import CanaryExecutorStore from './CanaryExecutorStore';
import ReportStore from './ReportStore';

export const stores = {
  configEditorStore: new ConfigEditorStore(),
  docsStore: new DocsStore(),
  modalStore: new StackStore(),
  canaryExecutorStore: new CanaryExecutorStore(),
  reportStore: new ReportStore()
};
