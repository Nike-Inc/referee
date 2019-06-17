import * as React from 'react';
import { observer } from 'mobx-react';
import { connect, ConnectedComponent } from './connectedComponent';
import StackStore from '../stores/StackStore';

interface Stores {
  modalStore: StackStore<JSX.Element>;
}

@connect('modalStore')
@observer
export default class ModalViewer extends ConnectedComponent<{}, Stores> {
  render(): React.ReactNode {
    if (this.stores.modalStore.doesHaveElements) {
      return <div>{this.stores.modalStore.peek}</div>;
    } else {
      return <div />;
    }
  }
}
