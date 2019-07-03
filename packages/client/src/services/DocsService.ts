import { stores } from '../stores';
import axios from 'axios';
import yaml from 'js-yaml';
import OptionalUtils from '../util/OptionalUtils';
import { validateToc } from '../validation/tocValidators';
import log from '../util/LoggerFactory';
import path from 'path-browserify';
import Optional from 'optional-js';
import hljs from 'highlight.js';
import marked from 'marked';
import { observer } from 'mobx-react';

const { docsStore } = stores;

const docCache: Map<string, string> = new Map();

const renderer = new marked.Renderer();

renderer.image = function(src, title, alt) {
  const curPath = window.location.pathname.replace(/(.*\/).*/, '$1');
  const subbedPath = curPath.replace('docs', 'static/docs');
  const resolvedSrc = path.resolve(subbedPath, src);
  const finalSrc = window.location.origin + resolvedSrc;
  log.debug(
    `src: ${src}, curPath: ${curPath}, subbedPath: ${subbedPath}, resolvedSrc: ${resolvedSrc} \nResolved image to load: ${finalSrc}`
  );
  console.log(title);
  let res = '<img src="' + finalSrc + '" alt="' + alt;

  Optional.ofNullable(/height=&#39;(.*?)&#39;/.exec(title)).ifPresent(matches => {
    log.debug(`Calculated height: ${matches[1]}`);
    res += '" height="' + matches[1];
  });

  Optional.ofNullable(/width=&#39;(.*?)&#39;/.exec(title)).ifPresent(matches => {
    log.debug(`Calculated width: ${matches[1]}`);
    res += '" width="' + matches[1];
  });

  Optional.ofNullable(/class=&#39;(.*?)&#39;/.exec(title)).ifPresent(matches => {
    log.debug(`Calculated class: ${matches[1]}`);
    res += '" class="' + matches[1];
  });

  return res + '">';
};

marked.setOptions({
  renderer: renderer,
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

export default class DocsService {
  async fetchAndUpdateToc(): Promise<void> {
    if (docsStore.tableOfContents == null) {
      try {
        const response = await axios.get(`${process.env.PUBLIC_URL}/docs/table-of-contents.yaml`);
        const tocData: any = yaml.safeLoad(response.data);
        const validationResults = validateToc(tocData);

        // TODO wire up error component rather than crash entire site.
        if (!validationResults.isValid) {
          throw new Error(
            `docs/table-of-contents.yaml was not valid errors: ${JSON.stringify(validationResults.errors)}`
          );
        }

        docsStore.updateToc(tocData);
      } catch (e) {
        log.error('Failed to load table of contents for docs, dont worry, docs are probably not enabled');
      }
    }
  }

  fetchAndUpdateDocContent(path: string): void {
    const resolvedPath = OptionalUtils.trimToNull(path).orElse(
      OptionalUtils.safeGet(() => docsStore.tableOfContents!.home).orElse('index')
    );

    const markdown = resolvedPath.endsWith('.md') ? resolvedPath : `${resolvedPath}.md`;

    if (docCache.has(markdown)) {
      log.debug(`${markdown} - in mem cache hit, using that`);
      docsStore.updateContent(docCache.get(markdown) as string);
    } else {
      axios.get(`${process.env.PUBLIC_URL}/docs/${markdown}`).then(response => {
        const renderedContent = marked.parse(Optional.ofNullable(response.data).orElse(' '));
        docCache.set(markdown, renderedContent);
        docsStore.updateContent(renderedContent);
      });
    }
  }
}
