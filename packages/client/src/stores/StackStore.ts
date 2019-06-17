import { observable, action, computed } from 'mobx';

export class EmptyStackError extends Error {}

/**
 * Array backed generic stack store
 */
export default class StackStore<T> {
  @observable
  data: T[] = [];

  private assertDataHasElements(): void {
    if (this.data.length < 1) {
      throw new EmptyStackError('Can not peek/pop an element off of an empty stack!');
    }
  }

  @action.bound
  push(element: T): void {
    this.data.push(element);
  }

  @action.bound
  pop(): T {
    this.assertDataHasElements();
    return this.data.pop()!;
  }

  @computed
  get peek(): T {
    this.assertDataHasElements();
    return this.data[0];
  }

  @computed
  get doesHaveElements(): boolean {
    return this.data.length > 0;
  }
}
