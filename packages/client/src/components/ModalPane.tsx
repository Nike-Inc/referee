import * as React from 'react';
import { observer } from 'mobx-react';
import { connect, ConnectedComponent } from './connectedComponent';
import ListStore from '../stores/ListStore';

interface Stores {
  modalStore: ListStore<JSX.Element>;
}

@connect('modalStore')
@observer
export default class ModalPane extends ConnectedComponent<{}, Stores> {
  render(): React.ReactNode {
    if (this.stores.modalStore.doesHaveElements) {
      return <div>{this.stores.modalStore.peek}</div>;
    } else {
      return <div />;
    }
  }
}
