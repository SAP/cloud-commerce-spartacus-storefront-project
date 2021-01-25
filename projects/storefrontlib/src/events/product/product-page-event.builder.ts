import { Injectable } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { ActionsSubject } from '@ngrx/store';
import {
  createFrom,
  EventService,
  ProductActions,
  ProductSearchService,
  ProductService,
  SearchboxService,
} from '@spartacus/core';
import { EMPTY, Observable, of } from 'rxjs';
import {
  filter,
  map,
  skip,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { PageEvent } from '../page/page.events';
import {
  CategoryPageResultsEvent,
  ProductDetailsPageEvent,
  SearchPageResultsEvent,
  SearchProductSelectedEvent,
  SearchSuggestionSelectedEvent,
} from './product-page.events';

@Injectable({
  providedIn: 'root',
})
export class ProductPageEventBuilder {
  constructor(
    protected eventService: EventService,
    protected productService: ProductService,
    protected productSearchService: ProductSearchService,
    protected searchBoxService: SearchboxService, // TODO deprecation yay!
    protected actionsSubject: ActionsSubject
  ) {
    this.register();
  }

  protected register(): void {
    this.eventService.register(
      SearchPageResultsEvent,
      this.buildSearchPageResultsEvent()
    );
    this.eventService.register(
      ProductDetailsPageEvent,
      this.buildProductDetailsPageEvent()
    );
    this.eventService.register(
      CategoryPageResultsEvent,
      this.buildCategoryResultsPageEvent()
    );
    this.eventService.register(
      SearchSuggestionSelectedEvent,
      this.buildSuggestionSelectedSearchPageEvent()
    );
    this.eventService.register(
      SearchProductSelectedEvent,
      this.buildProductSelectedEvent()
    );
  }

  protected buildProductDetailsPageEvent(): Observable<
    ProductDetailsPageEvent
  > {
    return this.eventService.get(PageEvent).pipe(
      filter((pageEvent) => pageEvent.semanticRoute === 'product'),
      switchMap((pageEvent) =>
        this.productService.get(pageEvent.context.id).pipe(
          filter((product) => Boolean(product)),
          take(1),
          map((product) =>
            createFrom(ProductDetailsPageEvent, {
              ...pageEvent,
              categories: product.categories,
              code: product.code,
              name: product.name,
              price: product.price,
            })
          )
        )
      )
    );
  }

  protected buildCategoryResultsPageEvent(): Observable<
    CategoryPageResultsEvent
  > {
    const searchResults$ = this.productSearchService.getResults().pipe(
      // skipping the initial value, and preventing emission of the previous search state
      skip(1)
    );

    return this.eventService.get(PageEvent).pipe(
      switchMap((pageEvent) => {
        if (pageEvent?.semanticRoute !== 'category') {
          return EMPTY;
        }

        return searchResults$.pipe(
          map((searchResults) => ({
            ...pageEvent,
            ...{
              categoryCode: pageEvent?.context?.id,
              numberOfResults: searchResults?.pagination?.totalResults,
              categoryName: searchResults.breadcrumbs?.[0].facetValueName,
            },
          })),
          map((categoryPage) =>
            createFrom(CategoryPageResultsEvent, categoryPage)
          )
        );
      })
    );
  }

  protected buildSearchPageResultsEvent(): Observable<SearchPageResultsEvent> {
    const searchResults$ = this.productSearchService.getResults().pipe(
      // skipping the initial value, and preventing emission of the previous search state
      skip(1)
    );

    return this.eventService.get(PageEvent).pipe(
      switchMap((pageEvent) => {
        if (pageEvent?.semanticRoute !== 'search') {
          return EMPTY;
        }

        return searchResults$.pipe(
          map((searchResults) => ({
            ...pageEvent,
            ...{
              searchTerm: searchResults?.freeTextSearch,
              numberOfResults: searchResults?.pagination?.totalResults,
            },
          })),
          map((searchPage) => createFrom(SearchPageResultsEvent, searchPage))
        );
      })
    );
  }

  protected buildSuggestionSelectedSearchPageEvent(): Observable<
    SearchSuggestionSelectedEvent
  > {
    const searchResults$ = this.productSearchService.getResults().pipe(
      // skipping the initial value, and preventing emission of the previous search state
      skip(1),
      switchMap((searchResults) => {
        return of(searchResults).pipe(
          withLatestFrom(this.searchBoxService.getSuggestionResults())
        );
      }),
      filter(
        ([searchResults, suggestions]) =>
          Boolean(searchResults?.freeTextSearch) &&
          suggestions?.filter(
            (suggestion) => suggestion.value === searchResults?.freeTextSearch
          ).length > 0
      )
    );

    const freeTextSearch$ = this.getAction(
      ProductActions.GET_PRODUCT_SUGGESTIONS
    );

    return this.eventService.get(PageEvent).pipe(
      withLatestFrom(freeTextSearch$),
      switchMap(([pageEvent, suggestionAction]) => {
        if (pageEvent?.semanticRoute !== 'search') {
          return EMPTY;
        }

        return searchResults$.pipe(
          map(([searchResults, suggestions]) =>
            createFrom(SearchSuggestionSelectedEvent, {
              freeText: suggestionAction.payload?.term,
              selectedSuggestion: searchResults.freeTextSearch,
              searchSuggestions: suggestions,
            })
          )
        );
      })
    );
  }

  protected buildProductSelectedEvent(): Observable<
    SearchProductSelectedEvent
  > {
    const searchResults$ = this.searchBoxService.getResults();

    return this.eventService.get(PageEvent).pipe(
      filter((pageEvent) => pageEvent.semanticRoute === 'product'),
      switchMap((pageEvent) => {
        return this.productService.get(pageEvent.context.id).pipe(
          filter((product) => Boolean(product)),
          take(1),
          switchMap((product) => {
            return of(product).pipe(withLatestFrom(searchResults$));
          }),
          filter(
            ([product, searchResults]) =>
              searchResults.products?.filter(
                (suggestionProduct) => suggestionProduct.code === product.code
              ).length > 0
          ),
          map(([product, searchResults]) =>
            createFrom(SearchProductSelectedEvent, {
              freeText: searchResults.freeTextSearch,
              selectedCode: product.code,
            })
          )
        );
      })
    );
  }

  protected getAction(
    actionType: string | string[]
  ): Observable<{ type: string; payload?: any }> {
    return this.actionsSubject.pipe(ofType(...[].concat(actionType)));
  }
}
