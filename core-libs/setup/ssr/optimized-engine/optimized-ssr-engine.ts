/* webpackIgnore: true */
import { Request, Response } from 'express';
import * as fs from 'fs';
import { NgExpressEngineInstance } from '../engine-decorator/ng-express-engine-decorator';
import { RenderingCache } from './rendering-cache';
import {
  RenderingStrategy,
  SsrOptimizationOptions,
} from './ssr-optimization-options';

/**
 * The rendered pages are kept in memory to be served on next request. If the `cache` is set to `false`, the
 * response is evicted as soon as the first successful response is successfully returned.
 */
export class OptimizedSsrEngine {
  protected currentConcurrency = 0;
  protected renderingCache = new RenderingCache(this.ssrOptions);
  private templateCache = new Map<string, string>();

  get engineInstance(): NgExpressEngineInstance {
    return this.renderResponse.bind(this);
  }

  constructor(
    protected expressEngine: NgExpressEngineInstance,
    protected ssrOptions?: SsrOptimizationOptions
  ) {}

  /**
   * When SSR page can not be returned in time, we're returning index.html of
   * the CSR application.
   * The CSR application is returned with the "Cache-Control: no-store" response-header. This notifies external cache systems to not use the CSR application for the subsequent request.
   */
  protected fallbackToCsr(
    response: Response,
    filePath: string,
    callback: (err?: Error | null, html?: string) => void
  ) {
    response.set('Cache-Control', 'no-store');
    callback(undefined, this.getDocument(filePath));
  }

  protected getRenderingKey(request: Request): string {
    return this.ssrOptions?.renderKeyResolver
      ? this.ssrOptions.renderKeyResolver(request)
      : request.originalUrl;
  }

  protected getRenderingStrategy(request: Request): RenderingStrategy {
    return this.ssrOptions?.renderingStrategyResolver
      ? this.ssrOptions.renderingStrategyResolver(request)
      : RenderingStrategy.DEFAULT;
  }

  protected shouldRender(request: Request): boolean {
    const concurrencyLimitExceed = this.ssrOptions?.concurrency
      ? this.currentConcurrency >= this.ssrOptions.concurrency
      : false;

    const isRendering = this.renderingCache.isRendering(
      this.getRenderingKey(request)
    );

    if (isRendering) {
      this.log(`CSR fallback: rendering in progress (${request?.originalUrl})`);
    } else if (concurrencyLimitExceed) {
      this.log(
        `CSR fallback: Concurrency limit exceeded (${this.ssrOptions.concurrency})`
      );
    }

    return (
      (!isRendering &&
        !concurrencyLimitExceed &&
        this.getRenderingStrategy(request) !== RenderingStrategy.ALWAYS_CSR) ||
      this.getRenderingStrategy(request) === RenderingStrategy.ALWAYS_SSR
    );
  }

  protected shouldTimeout(request: Request): boolean {
    return (
      !!this.ssrOptions?.timeout ||
      this.getRenderingStrategy(request) === RenderingStrategy.ALWAYS_SSR
    );
  }

  protected getTimeout(request: Request): number {
    return this.getRenderingStrategy(request) === RenderingStrategy.ALWAYS_SSR
      ? this.ssrOptions?.forcedSsrTimeout ?? 60000
      : this.ssrOptions?.timeout ?? 0;
  }

  protected returnCachedRender(
    request: Request,
    callback: (err?: Error | null, html?: string) => void
  ): boolean {
    const key = this.getRenderingKey(request);

    if (this.renderingCache.isReady(key)) {
      const cached = this.renderingCache.get(key);
      callback(cached.err, cached.html);

      if (!this.ssrOptions?.cache) {
        // we drop cached rendering if caching is disabled
        this.renderingCache.clear(key);
      }
      return true;
    }
    return false;
  }

  protected renderResponse(
    filePath: string,
    options: any,
    callback: (err?: Error | null, html?: string) => void
  ): void {
    const request: Request = options.req;
    const response: Response = options.res || options.req.res;

    const renderingKey = this.getRenderingKey(request);

    if (!this.returnCachedRender(request, callback)) {
      if (this.shouldRender(request)) {
        this.currentConcurrency++;
        let waitingForRender;

        if (this.shouldTimeout(request)) {
          // establish timeout for rendering
          const timeout = this.getTimeout(request);
          waitingForRender = setTimeout(() => {
            waitingForRender = undefined;
            this.fallbackToCsr(response, filePath, callback);
            this.log(
              `SSR rendering exceeded timeout ${timeout}, fallbacking to CSR for ${request?.originalUrl}`,
              false
            );
          }, timeout);
        } else {
          this.fallbackToCsr(response, filePath, callback);
        }

        // start rendering
        this.renderingCache.setAsRendering(renderingKey);

        // setting the timeout for hanging renders that might not ever finish due to various reasons
        // releasing concurrency slots by decreasing the `this.currentConcurrency--`.
        let maxRenderTimeout: NodeJS.Timeout | undefined = setTimeout(() => {
          this.currentConcurrency--;
          this.renderingCache.clear(renderingKey);
          maxRenderTimeout = undefined;

          this.log(
            `Rendering of ${request?.originalUrl} was not able to complete. This might cause memory leaks!`,
            false
          );
        }, this.ssrOptions?.maxRenderTime ?? 300000); // 300000ms == 5 minutes

        this.log(`Rendering started (${request?.originalUrl})`);
        this.expressEngine(filePath, options, (err, html) => {
          if (!maxRenderTimeout) {
            // ignore this render's result because it exceeded maxRenderTimeout
            this.log(
              `Rendering of ${request.originalUrl} completed after the specified maxRenderTime, therefore it was ignored.`
            );
            return;
          }
          clearTimeout(maxRenderTimeout);
          this.currentConcurrency--;

          this.log(`Rendering completed (${request?.originalUrl})`);

          if (waitingForRender) {
            // if request is still waiting for render, return it
            clearTimeout(waitingForRender);
            callback(err, html);

            // store the render only if caching is enabled
            if (this.ssrOptions?.cache) {
              this.renderingCache.store(renderingKey, err, html);
            } else {
              this.renderingCache.clear(renderingKey);
            }
          } else {
            // store the render for future use
            this.renderingCache.store(renderingKey, err, html);
          }
        });
      } else {
        // if there is already rendering in progress, return the fallback
        this.fallbackToCsr(response, filePath, callback);
      }
    } else {
      this.log(`Render from cache (${request?.originalUrl})`);
    }
  }

  protected log(message: string, debug = true) {
    if (!debug || this.ssrOptions.debug) {
      console.log(message);
    }
  }

  /** Retrieve the document from the cache or the filesystem */
  protected getDocument(filePath: string): string {
    let doc = this.templateCache.get(filePath);

    if (!doc) {
      // fs.readFileSync could be missing in a browser, specifically
      // in a unit tests with { node: { fs: 'empty' } } webpack configuration
      doc = fs?.readFileSync ? fs.readFileSync(filePath, 'utf-8') : '';
      this.templateCache.set(filePath, doc);
    }

    return doc;
  }
}
