import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { Request } from 'express';
import { REQUEST } from '../../tokens/express.tokens';
import { EXPRESS_SERVER_LOGGER, ExpressServerLogger } from '../loggers';
import { ExpressLoggerService } from './express-logger.service';

const mockRequest: Partial<Request> = { url: 'test/url' };

class MockServerLogger implements ExpressServerLogger {
  log = jest.fn();
  warn = jest.fn();
  error = jest.fn();
  info = jest.fn();
  debug = jest.fn();
}

describe('ExpressLoggerService', () => {
  let request: Request;
  let logger: ExpressServerLogger;
  let loggerService: ExpressLoggerService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      {}
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpressLoggerService,
        { provide: REQUEST, useValue: mockRequest },
        { provide: EXPRESS_SERVER_LOGGER, useClass: MockServerLogger },
      ],
    });

    request = TestBed.inject(REQUEST);
    logger = TestBed.inject(EXPRESS_SERVER_LOGGER);
    loggerService = TestBed.inject(ExpressLoggerService);
  });

  describe('log', () => {
    it('should log', () => {
      const log = jest.spyOn(logger, 'log');

      loggerService.log('test');

      expect(log).toHaveBeenCalledWith('test', { request });
    });

    it('should warn', () => {
      const warn = jest.spyOn(logger, 'warn');

      loggerService.warn('test');

      expect(warn).toHaveBeenCalledWith('test', { request });
    });

    it('should error', () => {
      const error = jest.spyOn(logger, 'error');

      loggerService.error('test');

      expect(error).toHaveBeenCalledWith('test', { request });
    });

    it('should info', () => {
      const info = jest.spyOn(logger, 'info');

      loggerService.info('test');

      expect(info).toHaveBeenCalledWith('test', { request });
    });

    it('should debug', () => {
      const debug = jest.spyOn(logger, 'debug');

      loggerService.debug('test');

      expect(debug).toHaveBeenCalledWith('test', { request });
    });
  });

  describe('formatLogMessage', () => {
    it('should format log message', () => {
      const result = loggerService['formatLogMessage']('some %s', 'test');

      expect(result).toEqual('some test');
    });
  });
});
