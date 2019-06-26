export interface TableOfContents {
  home: string;
  table_of_contents: TableOfContentsEntry[];
}

export interface TableOfContentsEntry {
  directory: string;
  pages: PageEntry[];
}

export interface PageEntry {
  filename: string;
  display_name?: string;
}

export interface ValidationResultsWrapper {
  errors: KvMap<string>;
  isValid: boolean;
}

export interface JudgedMetric {
  name: string;
  groupName: string;
  metrics: any;
  judgementsResult: any;
}
