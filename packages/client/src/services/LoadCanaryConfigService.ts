import { stores } from '../stores';
import axios from 'axios';
import { CanaryConfig } from '../domain/Kayenta';
import log from '../util/LoggerFactory';
import { EVENT, trackEvent } from '../util/MetricUtils';
import { safeGet } from '../util/OptionalUtils';

const { configEditorStore } = stores;

export default class LoadCanaryConfigService {
  async loadCanaryFromClipboard(): Promise<CanaryConfig | null> {
    let contents: string = '{}';

    try {
      contents = await navigator.clipboard.readText();
      const unvalidatedJsonObject = JSON.parse(contents);
      // TODO validate object with yup
      trackEvent(EVENT.LOAD_CONFIG, { source: 'clipboard' });
      alert('Successfully loaded canary config from clipboard');
      return unvalidatedJsonObject as CanaryConfig;
    } catch (e) {
      log.error('Failed to read and deserialize clipboard contents -', e);
      alert('Failed to read and deserialize clipboard contents, see console'); // TODO temp, need to add error message system
    }
    return null;
  }

  async loadCanaryFromTemplate(): Promise<void> {
    const currentUrl = window.location.href;

    if (this.isBlankConfig(currentUrl)) {
      return;
    }
    try {
      const templateName = this.getTemplateName(currentUrl);
      const fileName = `${templateName}.json`;

      const templateCanaryConfig = await this.fetchTemplateContent(fileName);
      configEditorStore.setCanaryConfigObject(templateCanaryConfig);
      trackEvent(EVENT.LOAD_CONFIG, {
        source: 'template',
        template: templateName,
        name: safeGet(() => templateCanaryConfig.name).orElse('UNKNOWN')
      });
    } catch (e) {
      log.error('Failed to fetch canary config template');
      alert(`Failed to fetch canary config template:\n${e}`);
    }
  }

  isBlankConfig(url: string): boolean {
    const pattern = /.+config\/edit$/;
    return url.match(pattern) !== null;
  }

  getTemplateName(url: string): string {
    const pattern = /.+template=([\w.-]+)(.+)?/;

    if (url.match(pattern) == null) {
      throw new Error(`Template URL does not match pattern: ${url}`);
    }

    const templateNameMatcher = pattern.exec(url);
    return templateNameMatcher ? templateNameMatcher[1] : '';
  }

  async fetchTemplateContent(fileName: string): Promise<CanaryConfig> {
    try {
      const response = await axios.get(`${process.env.PUBLIC_URL}/templates/${fileName}`);
      return response.data;
    } catch (e) {
      log.error(`Failed to fetch canary config template: ${fileName}`, e);
      throw e;
    }
  }
}
