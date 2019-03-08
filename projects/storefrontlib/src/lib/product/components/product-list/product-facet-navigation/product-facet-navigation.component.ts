import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { tap, filter } from 'rxjs/operators';
import {
  ProductSearchService,
  ProductSearchPage,
  Facet
} from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-product-facet-navigation',
  templateUrl: './product-facet-navigation.component.html',
  styleUrls: ['./product-facet-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFacetNavigationComponent implements OnInit {
  activeFacetValueCode: string;
  searchResult: ProductSearchPage;
  minPerFacet = 6;
  showAllPerFacetMap: Map<String, boolean>;
  queryCodec: HttpUrlEncodingCodec;
  private collapsedFacets = new Set<string>();
  searchResult$: Observable<ProductSearchPage>;
  updateParams$: Observable<Params>;

  get visibleFacets(): Facet[] {
    if (!this.searchResult.facets) {
      return [];
    }
    return this.searchResult.facets.filter(facet => facet.visible);
  }

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private productSearchService: ProductSearchService
  ) {
    this.showAllPerFacetMap = new Map<String, boolean>();
    this.queryCodec = new HttpUrlEncodingCodec();
  }

  ngOnInit() {
    this.updateParams$ = this.activatedRoute.params.pipe(
      tap(params => {
        this.activeFacetValueCode = params.categoryCode || params.brandCode;
      })
    );

    this.searchResult$ = this.productSearchService.getSearchResults().pipe(
      tap(searchResult => {
        this.searchResult = searchResult;
        if (this.searchResult.facets) {
          this.searchResult.facets.forEach(el => {
            this.showAllPerFacetMap.set(el.name, false);
          });
        }
      }),
      filter(searchResult => Object.keys(searchResult).length > 0)
    );
  }

  openFilterModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  toggleValue(query: string) {
    this.productSearchService.search(this.queryCodec.decodeValue(query));
  }

  showLess(facetName: String) {
    this.updateShowAllPerFacetMap(facetName, false);
  }

  showMore(facetName: String) {
    this.updateShowAllPerFacetMap(facetName, true);
  }

  private updateShowAllPerFacetMap(facetName: String, showAll: boolean) {
    this.showAllPerFacetMap.set(facetName, showAll);
  }

  isFacetCollapsed(facetName: string) {
    return this.collapsedFacets.has(facetName);
  }

  toggleFacet(facetName: string) {
    if (this.collapsedFacets.has(facetName)) {
      this.collapsedFacets.delete(facetName);
    } else {
      this.collapsedFacets.add(facetName);
    }
  }

  getVisibleFacetValues(facet) {
    return facet.values.slice(
      0,
      this.showAllPerFacetMap.get(facet.name)
        ? facet.values.length
        : this.minPerFacet
    );
  }
}
