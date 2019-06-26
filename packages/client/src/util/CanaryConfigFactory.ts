import uuid from 'uuid/v1';

import { CanaryConfig } from '../domain/Kayenta';

export default class CanaryConfigFactory {
  static createNewCanaryConfig(): CanaryConfig {
    return {
      configVersion: '1',
      name: `canary-config-${uuid()}`,
      description: '',
      applications: ['ad-hoc'],
      judge: {
        name: 'NetflixACAJudge-v1.0',
        judgeConfigurations: {}
      },
      templates: {},
      metrics: [],
      classifier: {
        groupWeights: {}
      }
    };
  }
}
