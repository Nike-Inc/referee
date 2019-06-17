import { stores } from '../stores';
import axios from 'axios';

const { configEditorStore } = stores;

export default class TemplatesService {
  async fetchAndUpdateTemplateContent(): Promise<void> {
    const currentUrl = window.location.href;
    const pattern = new RegExp(/.+template=([\w.-]+)(.+)?/);
    let templateName = '';

    if (currentUrl.match(pattern) !== null) {
      const templateNameMatcher = pattern.exec(currentUrl);
      templateName = templateNameMatcher ? templateNameMatcher[1] : '';
      const fileName = `${templateName}.json`;

      axios.get(`${process.env.PUBLIC_URL}/templates/${fileName}`).then(response => {
        configEditorStore.setCanaryConfigObject(response.data);
      });
    }
  }
}
