import { CanaryExecutionRequest } from '../domain/Kayenta';

export default class CanaryExecutionFactory {
  static createNewCanaryExecutionRequest(): CanaryExecutionRequest {
    return {
      scopes: {
        default: {
          controlScope: {
            scope: '',
            location: '',
            step: 60,
            start: '',
            end: '',
            extendedScopeParams: {}
          },
          experimentScope: {
            scope: '',
            location: '',
            step: 60,
            start: '',
            end: '',
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
