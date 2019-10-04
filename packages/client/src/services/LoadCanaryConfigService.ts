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
      // @ts-ignore
      contents = await navigator.clipboard.readText();
      const unvalidatedJsonObject = JSON.parse(contents);
      // TODO validate object with yup
      trackEvent(EVENT.LOAD_CONFIG, { source: 'clipboard' });
      return unvalidatedJsonObject as CanaryConfig;
    } catch (e) {
      log.error('Failed to read and deserialize clipboard contents -', e);
      alert('Failed to read and deserialize clipboard contents, see console'); // TODO temp, need to add error message system
    }
    return null;
  }

  async loadCanaryFromTemplate(): Promise<void> {
    const currentUrl = window.location.href;
    const pattern = new RegExp(/.+template=([\w.-]+)(.+)?/);
    let templateName = '';

    if (currentUrl.match(pattern) !== null) {
      const templateNameMatcher = pattern.exec(currentUrl);
      templateName = templateNameMatcher ? templateNameMatcher[1] : '';
      const fileName = `${templateName}.json`;

      axios.get(`${process.env.PUBLIC_URL}/templates/${fileName}`).then(response => {
        configEditorStore.setCanaryConfigObject(response.data);
        trackEvent(EVENT.LOAD_CONFIG, {
          source: 'template',
          template: templateName,
          name: safeGet(() => response.data.name).orElse('UNKNOWN')
        });
      });
    }
  }
}
