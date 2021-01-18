import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  isDevMode,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { UnifiedInjector } from '../../lazy-loading/unified-injector';
import { resolveApplicable } from '../../util/applicable';
import { uniteLatest } from '../../util/rxjs/unite-latest';
import { Page, PageMeta } from '../model/page.model';
import { PageMetaConfig } from '../page/config/page-meta.config';
import { PageMetaResolver } from '../page/page-meta.resolver';
import { CmsService } from './cms.service';

@Injectable({
  providedIn: 'root',
})
export class PageMetaService {
  private resolvers$: Observable<
    PageMetaResolver[]
  > = this.unifiedInjector
    .getMulti(PageMetaResolver)
    .pipe(shareReplay({ bufferSize: 1, refCount: true })) as Observable<
    PageMetaResolver[]
  >;

  /**
   * @deprecated from 4.0 we'll extend the constructor to access the `PageMetaConfig` and `platformId`.
   */
  // TODO(#10467): Remove and migrate deprecated constructors
  constructor(
    cms: CmsService,
    unifiedInjector?: UnifiedInjector,
    config?: PageMetaConfig,
    platformId?: string
  );
  constructor(
    protected cms: CmsService,
    protected unifiedInjector?: UnifiedInjector,
    @Optional() protected pageMetaConfig?: PageMetaConfig,
    @Optional() @Inject(PLATFORM_ID) protected platformId?: string
  ) {}

  /**
   * The list of resolver interfaces will be evaluated for the pageResolvers.
   *
   * @deprecated since 3.1, use the configured resolvers instead from `PageMetaConfig.resolvers`.
   */
  // TODO(#10467): Remove and migrate property
  protected resolverMethods: { [key: string]: string } = {
    title: 'resolveTitle',
    heading: 'resolveHeading',
    description: 'resolveDescription',
    breadcrumbs: 'resolveBreadcrumbs',
    image: 'resolveImage',
    robots: 'resolveRobots',
  };

  protected meta$: Observable<PageMeta | null> = defer(() =>
    this.cms.getCurrentPage()
  ).pipe(
    filter(Boolean),
    switchMap((page: Page) => this.getMetaResolver(page)),
    switchMap((metaResolver: PageMetaResolver) =>
      metaResolver ? this.resolve(metaResolver) : of(null)
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /**
   * Returns the observed page meta data for the current page.
   *
   * The data is resolved by various PageResolvers, which are configurable.
   */
  getMeta(): Observable<PageMeta | null> {
    return this.meta$;
  }

  /**
   * If a `PageResolver` has implemented a resolver interface, the resolved data
   * is merged into the `PageMeta` object.
   * @param metaResolver
   */
  protected resolve(metaResolver: PageMetaResolver): Observable<PageMeta> {
    const resolverMethods = this.getResolverMethods();
    const resolvedData: Observable<PageMeta>[] = Object.keys(resolverMethods)
      .filter((key) => metaResolver[resolverMethods[key]])
      .map((key) => {
        return metaResolver[resolverMethods[key]]().pipe(
          map((data) => ({
            [key]: data,
          }))
        );
      });

    return uniteLatest(resolvedData).pipe(
      map((data) => Object.assign({}, ...data))
    );
  }

  /**
   * Returns an object with resolvers. The object properties represent the `PageMeta` property, i.e.:
   *
   * ```
   * {
   *   title: 'resolveTitle',
   *   robots: 'resolveRobots'
   * }
   * ```
   *
   * This list of resolvers is filtered for CSR vs SSR processing since not all resolvers are
   * relevant during browsing.
   */
  protected getResolverMethods(): { [property: string]: string } {
    let resolverMethods = {};
    const configured = this.pageMetaConfig?.pageMeta?.resolvers;
    if (configured) {
      configured
        // filter the resolvers to avoid unnecessary processing in CSR
        .filter((resolver) => {
          return (
            // always resolve in SSR
            !isPlatformBrowser(this.platformId) ||
            // resolve in CSR when it's not disabled
            !resolver.disabledInCsr ||
            // resolve in CSR when resolver is enabled in devMode
            (isDevMode() && this.pageMetaConfig?.pageMeta?.enableInDevMode)
          );
        })
        .forEach(
          (resolver) => (resolverMethods[resolver.property] = resolver.method)
        );
    } else {
      resolverMethods = this.resolverMethods;
    }
    return resolverMethods;
  }

  /**
   * Return the resolver with the best match, based on a score
   * generated by the resolver.
   *
   * Resolvers match by default on `PageType` and `page.template`.
   */
  protected getMetaResolver(page: Page): Observable<PageMetaResolver> {
    return this.resolvers$.pipe(
      map((resolvers) => resolveApplicable(resolvers, [page], [page]))
    );
  }
}
