import { NgModuleFactory, StaticProvider, Type } from '@angular/core';
import { SERVER_REQUEST_URL } from './ssr.providers';

/**
 * These are the allowed options for the engine
 */
export interface NgSetupOptions {
  bootstrap: Type<{}> | NgModuleFactory<{}>;
  providers?: StaticProvider[];
}

/**
 * These are the allowed options for the render
 */
export interface RenderOptions extends NgSetupOptions {
  req: {
    protocol: string;
    originalUrl: string;
    get: (_: string) => string;
  }; // Request;
  res?: any; // Response;
  url?: string;
  document?: string;
}

export type NgExpressEngineInstance = (
  filePath: string,
  options: RenderOptions,
  callback: (err?: Error | null | undefined, html?: string | undefined) => void
) => void;

export type NgExpressEngine = (
  setupOptions: NgSetupOptions
) => NgExpressEngineInstance;

/**
 * The wrapper over the standard ngExpressEngine, that provides tokens for Spartacus
 * @param ngExpressEngine
 */
export class NgExpressEngineDecorator {
  /**
   * Returns the higher order ngExpressEngine with provided tokens for Spartacus
   *
   * @param ngExpressEngine
   */
  static get(ngExpressEngine: NgExpressEngine): NgExpressEngine {
    const result = function cxNgExpressEngine(
      setupOptions: NgSetupOptions
    ): NgExpressEngineInstance {
      return (filePath, options, callback) => {
        const engineInstance = ngExpressEngine({
          ...setupOptions,
          providers: [
            ...getProviders(options.req),
            ...(setupOptions.providers || []),
          ],
        });
        return engineInstance(filePath, options, callback);
      };
    };
    return result;
  }
}

function getProviders(req: any): StaticProvider[] {
  return [
    {
      provide: SERVER_REQUEST_URL,
      useValue: getRequestUrl(req),
    },
  ];
}

function getRequestUrl(req: any): string {
  return req.protocol + '://' + req.get('host') + req.originalUrl;
}
