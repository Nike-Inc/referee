import { CanaryExecutionStatusResponse } from '../domain/CanaryExecutionStatusResponse';
import uuid from 'uuid/v1';

export default class CanaryExecutionStatusResponseFactory {
  static createNewCanaryExecutionStatusResponse(): CanaryExecutionStatusResponse {
    return {
      application: '',
      configurationAccountName: '',
      storageAccountName: '',

      complete: false,
      status: '',
      exception: {},
      stageStatus: {},

      buildTimeIso: '',
      buildTimeMillis: 0,
      startTimeIso: '',
      startTimeMillis: 0,
      endTimeIso: '',
      endTimeMillis: 0,

      canaryConfigId: '',
      config: {
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
      },
      canaryExecutionRequest: {
        scopes: {
          default: {
            controlScope: {
              scope: 'default',
              location: 'us-west-2',
              step: 60,
              // start: '',
              // end: '',
              start: '2019-01-04T18:56:02.816Z',
              end: '2019-01-04T21:56:02.816Z',
              extendedScopeParams: {
                _scope_key: 'default'
              }
            },
            experimentScope: {
              scope: 'default',
              location: 'us-west-2',
              step: 60,
              start: '2019-01-04T18:56:02.816Z',
              end: '2019-01-04T21:56:02.816Z',
              extendedScopeParams: {
                _scope_key: 'default'
              }
            }
          }
        },
        thresholds: {
          marginal: 50.0,
          pass: 75.0
        }
      },

      metricSetPairListId: '',
      parentPipelineExecutionId: '',
      pipelineId: '',
      result: {
        canaryDuration: {
          nano: 0,
          negative: false,
          seconds: 0,
          units: {},
          zero: false
        },
        judgeResult: {
          groupScores: {
            classification: '',
            classificationReason: '',
            name: '',
            score: 0
          },
          judgeName: '',
          results: {
            classification: '',
            classificationReason: '',
            id: '',
            name: '',
            critical: false,
            groups: [''],
            controlMetadata: {},
            experimentMetadata: {},
            resultMetadata: {},
            tags: {}
          },
          score: {
            classification: '',
            classificationReason: '',
            score: 0
          }
        }
      }
    };
  }
}
