import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { RoutingService } from '../../routing/facade/routing.service';
import { PageType } from '../../occ/occ-models/occ.models';
import { ProductSearchService } from '../facade/product-search.service';
import { PageMetaResolver } from '../../cms/page/page-meta.resolver';
import { PageMeta } from '../../cms/model/page.model';

@Injectable({
  providedIn: 'root',
})
export class SearchPageMetaResolver extends PageMetaResolver
  implements PageMetaResolver {
  constructor(
    protected routingService: RoutingService,
    protected productSearchService: ProductSearchService
  ) {
    super();
    this.pageType = PageType.CONTENT_PAGE;
    this.pageTemplate = 'SearchResultsListPageTemplate';
  }

  resolve(): Observable<PageMeta> {
    return combineLatest(
      this.productSearchService.getSearchResults().pipe(
        filter(data => !!(data && data.pagination)),
        map(results => results.pagination.totalResults)
      ),
      this.routingService.getRouterState().pipe(
        map(state => state.state.params['query']),
        filter(Boolean)
      )
    ).pipe(
      switchMap(([t, q]: [number, string]) => this.resolveTitle(t, q)),
      map(title => ({ title }))
    );
  }

  resolveTitle(total: number, part: string): Observable<string> {
    return of(`${total} results for "${part}"`);
  }
}
