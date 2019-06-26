import { action, observable } from 'mobx';
import { TableOfContents } from '../domain/Referee';

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
