import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PointOfServiceStock } from '@spartacus/core';
import { ICON_TYPE } from '@spartacus/storefront';

@Component({
  selector: 'cx-store',
  templateUrl: './store.component.html',
})
export class StoreComponent {
  @Input()
  storeDetails: PointOfServiceStock = {};
  @Output()
  storeSelected: EventEmitter<PointOfServiceStock> = new EventEmitter<PointOfServiceStock>();

  iconTypes = ICON_TYPE;

  openHoursOpen = false;

  selectStore(): boolean {
    this.storeSelected.emit(this.storeDetails);
    // return false to prevent this button adding to cart
    return false;
  }

  toggleOpenHours(): void {
    this.openHoursOpen = !this.openHoursOpen;
  }
}
