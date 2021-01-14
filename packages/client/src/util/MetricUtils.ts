import axios from 'axios';
import log from './LoggerFactory';
import { ofNullable } from './OptionalUtils';

export const trackEvent = async (event: EVENT, dimensions?: KvMap<string>): Promise<void> => {
    dimensions = ofNullable(dimensions).orElse({});
    try {
        await axios.post(`/metrics`, {
            name: event,
            dimensions: dimensions
        });
    } catch (e) {
        log.error(`Unable to send metric: ${event} with dimensions: ${dimensions}`, e);
    }
};

export enum EVENT {
  // A user creates a config with the config tool
  NEW_CONFIG = 'referee.canary_config_tool.new_config',
  LOAD_CONFIG = 'referee.canary_config_tool.load_config',
  PAGE_VIEW = 'referee.page_view'
}
