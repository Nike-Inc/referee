import { LoggerFactory } from '../LoggerFactory';

describe('LoggerFactory', () => {
  it('should get root logger', () => {
    const expectedLoggerName = 'root';
    const logger = LoggerFactory.getRootLogger();
    expect(logger['name']).toBe(expectedLoggerName);
  });

  it('should get logger with empty name', () => {
    const expectedLoggerName = 'root';
    const logger = LoggerFactory.getLogger('');
    expect(logger['name']).toBe(expectedLoggerName);
  });

  it('should get logger with name', () => {
    const expectedLoggerName = 'test';
    const logger = LoggerFactory.getLogger(expectedLoggerName);
    expect(logger['name']).toBe(expectedLoggerName);
  });
});
