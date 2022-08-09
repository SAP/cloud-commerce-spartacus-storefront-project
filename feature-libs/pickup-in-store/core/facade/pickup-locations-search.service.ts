import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PointOfService, PointOfServiceStock, Stock } from '@spartacus/core';
import {
  PatchDeliveryOptionPayload,
  PickupLocationsSearchFacade,
  StockLocationSearchParams,
} from '@spartacus/pickup-in-store/root';
import { Observable } from 'rxjs';
import { GetStoreDetailsById } from '../store/actions/pickup-location.action';
import {
  BrowserLocationActions,
  HideOutOfStockSelectors,
  PickupLocationActions,
  PickupLocationsSelectors,
  StateWithPickupLocations,
  StateWithStock,
  StockLevelActions,
  StockSelectors,
  ToggleHideOutOfStockOptionsAction,
} from '../store/index';

// TODO jsdoc

@Injectable()
export class PickupLocationsSearchService
  implements PickupLocationsSearchFacade
{
  constructor(
    protected readonly store: Store<StateWithStock & StateWithPickupLocations>
  ) {}

  stockLevelAtStore(productCode: string, storeName: string): void {
    this.store.dispatch(
      StockLevelActions.StockLevelAtStore({
        payload: { productCode, storeName },
      })
    );
  }

  getStockLevelAtStore(
    productCode: string,
    storeName: string
  ): Observable<Stock | undefined> {
    return this.store.pipe(
      select(StockSelectors.getStockAtStore(productCode, storeName))
    );
  }

  startSearch(searchParams: StockLocationSearchParams): void {
    this.store.dispatch(new StockLevelActions.StockLevel(searchParams));
  }

  hasSearchStarted(productCode: string): Observable<boolean> {
    return this.store.pipe(
      select(StockSelectors.hasSearchStartedForProductCode(productCode))
    );
  }

  isSearchRunning(): Observable<boolean> {
    return this.store.pipe(select(StockSelectors.getStockLoading));
  }

  getSearchResults(productCode: string): Observable<PointOfServiceStock[]> {
    return this.store.pipe(
      select(StockSelectors.getStoresWithStockForProductCode(productCode))
    );
  }

  clearSearchResults(): void {
    this.store.dispatch(new StockLevelActions.ClearStockData());
  }

  getHideOutOfStock(): Observable<boolean> {
    return this.store.pipe(
      select(HideOutOfStockSelectors.getHideOutOfStockState)
    );
  }

  setBrowserLocation(latitude: number, longitude: number): void {
    this.store.dispatch(
      BrowserLocationActions.AddBrowserLocation({
        payload: { latitude, longitude },
      })
    );
  }

  toggleHideOutOfStock(): void {
    this.store.dispatch(ToggleHideOutOfStockOptionsAction());
  }

  loadStoreDetails(storeName: string): void {
    this.store.dispatch(GetStoreDetailsById({ payload: storeName }));
  }

  getStoreDetails(name: string): Observable<PointOfService> {
    return this.store.pipe(
      select(PickupLocationsSelectors.getStoreDetailsByName(name))
    );
  }

  patchDeliveryOption(
    patchDeliveryOptionPayload: PatchDeliveryOptionPayload
  ): void {
    this.store.dispatch(
      PickupLocationActions.PatchDeliveryOption({
        payload: {
          ...patchDeliveryOptionPayload,
        },
      })
    );
  }
}
