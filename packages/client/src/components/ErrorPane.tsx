import * as React from 'react';
import { observer } from 'mobx-react';
import { connect, ConnectedComponent } from './connectedComponent';
import ListStore from '../stores/ListStore';
import { DisplayableError } from '../domain/Referee';
import { Alert } from 'react-bootstrap';
import { ofNullable } from '../util/OptionalUtils';

import './ErrorPane.scss';

interface Stores {
  errorStore: ListStore<DisplayableError>;
}

@connect('errorStore')
@observer
export default class ErrorPane extends ConnectedComponent<{}, Stores> {
  render(): React.ReactNode {
    const { errorStore } = this.stores;
    if (errorStore.doesHaveElements) {
      return (
        <div>
          {errorStore.data.map((error, index) => (
            <Alert
              variant={ofNullable(error.variant).orElse('danger')}
              onClose={() => errorStore.removeIndex(index)}
              dismissible
            >
              <Alert.Heading>{error.heading}</Alert.Heading>
              {error.content}
            </Alert>
          ))}
        </div>
      );
    } else {
      return <div />;
    }
  }
}
