import { Component, Input } from '@angular/core';
import { PointOfService } from '@spartacus/core';
import { ICON_TYPE } from '@spartacus/storefront';

@Component({
  selector: 'cx-store',
  templateUrl: './store.component.html',
})
export class StoreComponent {
  @Input()
  storeDetails: PointOfService = {};

  iconTypes = ICON_TYPE;

  openHoursOpen = false;

  selectStore(): boolean {
    console.log('Store Selected');
    // return false to prevent this button adding to cart
    return false;
  }

  toggleOpenHours(): void {
    this.openHoursOpen = !this.openHoursOpen;
  }
}
