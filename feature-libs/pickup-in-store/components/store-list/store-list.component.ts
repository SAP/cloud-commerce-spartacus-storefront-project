import { Component, Input, OnInit } from '@angular/core';
import { PickupInStoreFacade } from '@spartacus/pickup-in-store/root';
import {
  StoreEntities,
  StoreFinderSearchQuery,
} from '@spartacus/storefinder/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-store-list',
  templateUrl: 'store-list.component.html',
})
export class StoreListComponent implements OnInit {
  isLoading$: Observable<boolean>;
  locations$: Observable<StoreEntities>;

  private _storeSearch: StoreFinderSearchQuery;
  @Input() set storeSearch(storeFinderSearchQuery: StoreFinderSearchQuery) {
    this._storeSearch = storeFinderSearchQuery;
    if (this._storeSearch) {
      // this.findStores(this._storeSearch);
    }
  }
  get storeSearch(): StoreFinderSearchQuery {
    return this._storeSearch;
  }

  constructor(
    // private readonly storeFinderService: StoreFinderService,
    private readonly pickupInStoreService: PickupInStoreFacade
  ) {}

  ngOnInit() {
    this.locations$ = this.pickupInStoreService.getStockEntities();
    this.isLoading$ =  this.pickupInStoreService.getStockLoading()
  }
}
