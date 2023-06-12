import { PrerenderingServerLogger } from './prerendering-server-logger';

describe('PrerenderingServerLogger', () => {
  const logger = new PrerenderingServerLogger();
  jest.useFakeTimers().setSystemTime(new Date('2023-05-26'));

  describe('log', () => {
    it('should log message', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      logger.log('test', { request: {} });

      expect(logSpy).toHaveBeenCalledWith(
        logger['createLogMessage']('test', { request: {} })
      );
    });

    it('should warn message', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      logger.warn('test', { request: {} });

      expect(warnSpy).toHaveBeenCalledWith(
        logger['createLogMessage']('test', { request: {} })
      );
    });

    it('should error message', () => {
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      logger.error('test', { request: {} });

      expect(errorSpy).toHaveBeenCalledWith(
        logger['createLogMessage']('test', { request: {} })
      );
    });

    it('should info message', () => {
      const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});

      logger.info('test', { request: {} });

      expect(infoSpy).toHaveBeenCalledWith(
        logger['createLogMessage']('test', { request: {} })
      );
    });

    it('should debug message', () => {
      const debugSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => {});

      logger.debug('test', { request: {} });

      expect(debugSpy).toHaveBeenCalledWith(
        logger['createLogMessage']('test', { request: {} })
      );
    });
  });

  describe('create log message', () => {
    it('should return object extended with timestamp', () => {
      const log = logger['createLogMessage']('test', {});

      expect(log).toContain('timestamp');
    });
  });
});
