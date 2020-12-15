import { Injectable } from '@angular/core';
import { combineLatest, defer, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { TranslationService } from '../../i18n/translation.service';
import { PageType } from '../../model/cms.model';
import { CmsService } from '../facade/cms.service';
import { BreadcrumbMeta, Page, PageRobotsMeta } from '../model/page.model';
import { PageMetaResolver } from './page-meta.resolver';
import { PageBreadcrumbResolver, PageTitleResolver } from './page.resolvers';
import { RoutingPageMetaResolver } from './routing/routing-page-meta.resolver';

/**
 * Resolves the page data for all Content Pages based on the `PageType.CONTENT_PAGE`.
 * More specific resolvers for content pages can be implemented by making them more
 * specific, for example by using the page template (see `CartPageMetaResolver`).
 *
 * The page title, and breadcrumbs are resolved in this implementation only.
 */
@Injectable({
  providedIn: 'root',
})
export class ContentPageMetaResolver
  extends PageMetaResolver
  implements PageTitleResolver, PageBreadcrumbResolver {
  constructor(
    protected cmsService: CmsService,
    protected translation: TranslationService,
    protected routingPageMetaResolver: RoutingPageMetaResolver
  ) {
    super();
    this.pageType = PageType.CONTENT_PAGE;
  }

  /**
   * Breadcrumb for the home page.
   */
  protected homeBreadcrumb$: Observable<
    BreadcrumbMeta[]
  > = this.translation
    .translate('common.home')
    .pipe(map((label) => [{ label: label, link: '/' }] as BreadcrumbMeta[]));

  /**
   * All the resolved breadcrumbs (including those from Angular child routes).
   */
  protected breadcrumbs$: Observable<BreadcrumbMeta[]> = combineLatest([
    this.homeBreadcrumb$,
    defer(() => this.routingPageMetaResolver.resolveBreadcrumbs()),
  ]).pipe(
    map(
      (breadcrumbs) => breadcrumbs.flat(),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  );

  /** helper to provide access to the current CMS page */
  protected cms$: Observable<Page> = defer(() =>
    this.cmsService.getCurrentPage().pipe(filter((p) => Boolean(p)))
  );

  protected title$ = this.cms$.pipe(map((p) => p.title));
  protected robots$: Observable<PageRobotsMeta[]> = this.cms$.pipe(
    map((page) => page.robots)
  );

  /**
   * Resolves the page title, which is driven by the backend.
   */
  resolveTitle(): Observable<string> {
    return this.title$;
  }

  /**
   * Resolves a single breadcrumb item to the home page for each `ContentPage`.
   * The home page label is resolved from the translation service.
   */
  resolveBreadcrumbs(): Observable<BreadcrumbMeta[]> {
    return this.breadcrumbs$;
  }

  /**
   * Returns robots for the content page.
   */
  resolveRobots(): Observable<PageRobotsMeta[]> {
    return this.robots$;
  }
}
