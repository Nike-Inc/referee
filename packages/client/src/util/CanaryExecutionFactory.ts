import { CanaryExecutionRequest } from '../domain/CanaryExecutionRequestTypes';

export default class CanaryExecutionFactory {
  static createNewCanaryExecutionRequest(): CanaryExecutionRequest {
    return {
      scopes: {
        default: {
          controlScope: {
            scope: 'default',
            location: 'us-west-2',
            step: 60,
            start: '',
            end: '',
            extendedScopeParams: {
              _scope_key: 'default'
            }
          },
          experimentScope: {
            scope: 'default',
            location: 'us-west-2',
            step: 60,
            start: '',
            end: '',
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
    };
  }
}
