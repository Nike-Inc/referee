import { TableOfContents, KeyOrMap, KvMap } from '../domain/CustomTypes';
import { action, observable } from 'mobx';

export default class DocsStore {
  @observable
  tableOfContents: TableOfContents | null = null;

  @observable
  content: string | null = null;

  @action.bound
  updateToc(tableOfContents: TableOfContents) {
    this.tableOfContents = tableOfContents;
  }

  @action.bound
  updateContent(content: string) {
    this.content = content;
  }
}
