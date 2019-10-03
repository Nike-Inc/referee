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

export interface DisplayableError {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  heading: string;
  content: JSX.Element;
}
