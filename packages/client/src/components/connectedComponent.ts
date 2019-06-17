import { Component } from 'react';
import { inject } from 'mobx-react';

export class ConnectedComponent<T, S, X = {}> extends Component<T, X> {
  public get stores(): S {
    return (this.props as any) as S;
  }
}

export const connect = (...args: string[]): any => inject(...args);
