import * as React from 'react';
import { observer } from 'mobx-react';
import { PageEntry, TableOfContents, TableOfContentsEntry } from '../../domain/CustomTypes';
import Optional from 'optional-js';
import OptionalUtils from '../../util/OptionalUtils';
import * as H from 'history';
import capitalize from 'capitalize';
import { docsService } from '../../services';
import classNames from 'classnames';

import './TableOfContentsNav.scss';

export const TableOfContentsNav = observer(
  ({
    tableOfContents,
    history,
    path
  }: {
    tableOfContents: TableOfContents | null;
    history: H.History;
    path: string;
  }): JSX.Element => {
    return OptionalUtils.mapIfPresentOrElse(
      Optional.ofNullable(tableOfContents),
      (tableOfContents: TableOfContents) => {
        const headerHeight = document.getElementById('header-wrapper')!.clientHeight;
        const footerHeight = document.getElementById('footer')!.clientHeight;
        const windowHeight = window.outerHeight;
        return (
          <div
            className="table-of-contents"
            style={{
              position: 'sticky',
              top: `${headerHeight}px`,
              maxHeight: `${windowHeight - (headerHeight + footerHeight)}px`
            }}
          >
            <div className="toc-entry">
              <div
                className={classNames(['toc-entry-label', 'home', path === '' ? 'selected' : ''])}
                onClick={() => {
                  docsService.fetchAndUpdateDocContent('');
                  history.push('/docs/');
                  window.scrollTo(0, 0);
                }}
              >
                Home
              </div>
            </div>
            {tableOfContents.table_of_contents.map((tocEntry: TableOfContentsEntry) => {
              return <TocEntryComp key={tocEntry.directory} path={path} tocEntry={tocEntry} history={history} />;
            })}
            {/*Hiding FAQ page until content is developed*/}
            {/*<div className="toc-entry">*/}
            {/*<div*/}
            {/*className={classNames([*/}
            {/*'toc-entry-page',*/}
            {/*`faq` === path ? 'selected' : ''*/}
            {/*])}*/}
            {/*onClick={() => {*/}
            {/*docsService.fetchAndUpdateDocContent(`faq`);*/}
            {/*history.push(`/docs/faq`);*/}
            {/*window.scrollTo(0,0);*/}
            {/*}}*/}
            {/*>*/}
            {/*<b>FAQ</b>*/}
            {/*</div>*/}
            {/*</div>*/}
          </div>
        );
      },
      () => {
        return <div />;
      }
    );
  }
);

const TocEntryComp = observer(
  ({ tocEntry, history, path }: { tocEntry: TableOfContentsEntry; history: H.History; path: string }): JSX.Element => {
    return (
      <div className="toc-entry">
        <div className="toc-entry-label">{capitalize.words(tocEntry.directory.replace(/-/g, ' '))}</div>
        {tocEntry.pages.map((page: PageEntry) => {
          return (
            <div
              key={`${tocEntry.directory}/${page.filename}`}
              className={classNames([
                'toc-entry-page',
                `${tocEntry.directory}/${page.filename}` === path ? 'selected' : ''
              ])}
              onClick={() => {
                docsService.fetchAndUpdateDocContent(`${tocEntry.directory}/${page.filename}`);
                history.push(`/docs/${tocEntry.directory}/${page.filename}`);
                window.scrollTo(0, 0);
              }}
            >
              {Optional.ofNullable(page.display_name).orElse(capitalize.words(page.filename.replace(/-/g, ' ')))}
            </div>
          );
        })}
      </div>
    );
  }
);
