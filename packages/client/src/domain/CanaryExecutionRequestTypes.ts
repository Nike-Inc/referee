export interface CanaryExecutionRequest {
  scopes: {
    default: {
      controlScope: CanaryScope;
      experimentScope: CanaryScope;
    };
  };
  thresholds: {
    marginal: number;
    pass: number;
  };
}

export interface CanaryScope {
  scope: string;
  location: string;
  step: number;
  start: string;
  end: string;
  extendedScopeParams: {};
}
