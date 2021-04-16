import { NgModuleFactory, StaticProvider, Type } from '@angular/core';
import { SERVER_REQUEST_ORIGIN, SERVER_REQUEST_URL } from '@spartacus/core';
import { OptimizedSsrEngine } from '../optimized-engine/optimized-ssr-engine';
import { SsrOptimizationOptions } from '../optimized-engine/ssr-optimization-options';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';

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
  callback: (err?: Error | null, html?: string) => void
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
  static get(
    ngExpressEngine: NgExpressEngine,
    optimizationOptions?: SsrOptimizationOptions
  ): NgExpressEngine {
    const result = decorateExpressEngine(ngExpressEngine, optimizationOptions);
    return result;
  }
}

export function decorateExpressEngine(
  ngExpressEngine: NgExpressEngine,
  optimizationOptions: SsrOptimizationOptions = {
    concurrency: 20,
    timeout: 3000,
  }
) {
  return function (setupOptions: NgSetupOptions) {
    const engineInstance = ngExpressEngine({
      ...setupOptions,
      providers: [
        // add spartacus related providers
        ...getServerRequestProviders(),
        ...(setupOptions.providers ?? []),
      ],
    });

    // apply optimization wrapper if optimization options were defined
    return optimizationOptions
      ? new OptimizedSsrEngine(engineInstance, optimizationOptions)
          .engineInstance
      : engineInstance;
  };
}

/**
 * Returns Spartacus providers to be passed to the Angular express engine (in SSR)
 *
 * @param options
 */
export function getServerRequestProviders(): StaticProvider[] {
  return [
    {
      provide: SERVER_REQUEST_URL,
      useFactory: getRequestUrl,
      deps: [REQUEST],
    },
    {
      provide: SERVER_REQUEST_ORIGIN,
      useFactory: getRequestOrigin,
      deps: [REQUEST],
    },
  ];
}

function getRequestUrl(req: Request): string {
  return getRequestOrigin(req) + req.originalUrl;
}

function getRequestOrigin(req: Request): string {
  // If express is resolving and trusting X-Forwarded-Host, we want to take it
  // into an account to properly generate request origin.
  const trustProxyFn = req.app.get('trust proxy fn');
  let forwardedHost = req.get('X-Forwarded-Host');
  if (forwardedHost && trustProxyFn(req.connection.remoteAddress, 0)) {
    if (forwardedHost.indexOf(',') !== -1) {
      // Note: X-Forwarded-Host is normally only ever a
      //       single value, but this is to be safe.
      forwardedHost = forwardedHost
        .substring(0, forwardedHost.indexOf(','))
        .trimRight();
    }
    return req.protocol + '://' + forwardedHost;
  } else {
    return req.protocol + '://' + req.get('host');
  }
}
