import { CanaryExecutionRequest } from '../domain/CanaryExecutionRequestTypes';

export default class CanaryExecutionFactory {
  static createNewCanaryExecutionRequest(): CanaryExecutionRequest {
    return {
      scopes: {
        default: {
          controlScope: {
            scope: 'excanarymicroservice-v003',
            location: 'us-west-2',
            step: 60,
            // start: '',
            // end: '',
            start: '2019-01-04T18:56:02.816Z',
            end: '2019-01-04T21:56:02.816Z',
            extendedScopeParams: {}
          },
          experimentScope: {
            scope: 'excanarymicroservice-v004',
            location: 'us-west-2',
            step: 60,
            start: '2019-01-04T18:56:02.816Z',
            end: '2019-01-04T21:56:02.816Z',
            extendedScopeParams: {}
          }
        }
      },
      thresholds: {
        marginal: 50.0,
        pass: 75.0
      }
    };
  }
}
