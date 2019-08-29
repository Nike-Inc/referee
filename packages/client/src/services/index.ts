import DocsService from './DocsService';
import TemplatesService from './TemplatesService';
import KayentaApiService from './KayentaApiService';
import LoadCanaryConfigService from './LoadCanaryConfigService';
import FetchCanaryResultsService from './FetchCanaryResultsService';
import MetricsService from "./MetricsService";

export const docsService = new DocsService();
export const metricsService = new MetricsService();
export const templateService = new TemplatesService();
export const loadCanaryConfigService = new LoadCanaryConfigService();
export const kayentaApiService = new KayentaApiService();
export const fetchCanaryResultsService = new FetchCanaryResultsService();
