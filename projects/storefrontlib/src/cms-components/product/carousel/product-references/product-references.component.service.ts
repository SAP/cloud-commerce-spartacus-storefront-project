import { Injectable } from '@angular/core';
import {
  CmsProductReferencesComponent,
  ProductReference,
  ProductReferenceService,
  RoutingService,
} from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CmsComponentData } from '../../../../cms-structure/page/model/cms-component-data';

@Injectable()
export class ProductReferencesService {
  private title$: Observable<string>;
  private items$: Observable<ProductReference[]>;
  private displayProductTitles$: Observable<string>;
  private displayProductPrices$: Observable<string>;

  constructor(
    protected component: CmsComponentData<CmsProductReferencesComponent>,
    private referenceService: ProductReferenceService,
    private routerService: RoutingService
  ) {}

  getTitle(): Observable<string> {
    return this.title$;
  }

  fetchTitle(): void {
    this.title$ = this.component.data$.pipe(
      map(data => {
        return data.title;
      })
    );
  }

  getDisplayProductTitles(): Observable<boolean> {
    return this.displayProductTitles$.pipe(
      map(data => Boolean(JSON.parse(data.toLowerCase())))
    );
  }

  fetchDisplayProductTitles(): void {
    this.displayProductTitles$ = this.component.data$.pipe(
      map(data => {
        return data.displayProductTitles;
      })
    );
  }

  getDisplayProductPrices(): Observable<boolean> {
    return this.displayProductPrices$.pipe(
      map(data => Boolean(JSON.parse(data.toLowerCase())))
    );
  }

  fetchDisplayProductPrices(): void {
    this.displayProductPrices$ = this.component.data$.pipe(
      map(data => {
        return data.displayProductPrices;
      })
    );
  }

  getReferenceType(): Observable<string> {
    return this.component.data$.pipe(map(data => data.productReferenceTypes));
  }

  getProductCode(): Observable<string> {
    return this.routerService
      .getRouterState()
      .pipe(map(data => data.state.params.productCode));
  }

  getReferenceList(): Observable<ProductReference[]> {
    return this.items$;
  }

  setReferenceList(pageSize?: number): void {
    this.items$ = combineLatest(
      this.getProductCode(),
      this.getReferenceType()
    ).pipe(
      map(data => ({ productCode: data[0], referenceType: data[1] })),
      switchMap(data => {
        return this.referenceService.get(
          data.productCode,
          data.referenceType,
          pageSize
        );
      })
    );
  }
}
