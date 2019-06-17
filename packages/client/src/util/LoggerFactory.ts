import { Logger, getLogger, LogLevelDesc } from 'loglevel';

/**
 * LoggerFactory with static methods for getting log instances
 */
export class LoggerFactory {
  /**
   * Gets the root logger, named 'referee-ui-root'
   * @returns The root logger
   */
  static getRootLogger(): Logger {
    return this.getLogger('root');
  }

  /**
   * Gets a named log instance, that can have its log level controlled via the local storage var for `loglevel:${name}`
   * @param name The log name
   * @returns The logger
   */
  static getLogger(name: string): Logger {
    if (!name) {
      return this.getRootLogger();
    }
    const loggerLevel: LogLevelDesc = (localStorage.getItem(`loglevel:${name}`) as LogLevelDesc) || 'info';
    const namedLog = getLogger(name);
    namedLog.setLevel(loggerLevel);
    return namedLog;
  }
}

const log = LoggerFactory.getRootLogger();

/**
 * Export the root log by default
 */
export default log;
