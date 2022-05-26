import { NgModule } from '@angular/core';
import { CartOutlets } from '@spartacus/cart/base/root';
import {
  CmsConfig,
  provideConfig,
  provideDefaultConfigFactory,
} from '@spartacus/core';
import { OutletPosition, provideOutlet } from '@spartacus/storefront';
import { defaultPickupOptionsDialogLayoutConfig } from './components/pickup-delivery-option-dialog/pickup-delivery-option-dialog-layout.config';
import { PickupDeliveryOptionsComponent } from './components/pickup-delivery-options/pickup-delivery-options.component';
import { PickupInStoreComponentsModule } from './components/pickup-in-store-components.module';
import {
  PICKUP_IN_STORE_CORE_FEATURE,
  PICKUP_IN_STORE_FEATURE,
} from './feature-name';

export function defaultPickupInStoreComponentsConfig(): CmsConfig {
  return {
    featureModules: {
      [PICKUP_IN_STORE_CORE_FEATURE]: PICKUP_IN_STORE_FEATURE,
    },
  };
}

@NgModule({
  imports: [PickupInStoreComponentsModule],
  providers: [
    provideDefaultConfigFactory(defaultPickupInStoreComponentsConfig),
    provideOutlet({
      id: CartOutlets.ADD_TO_CART_CONTAINER,
      position: OutletPosition.REPLACE,
      component: PickupDeliveryOptionsComponent,
    }),
    provideConfig(defaultPickupOptionsDialogLayoutConfig),
  ],
})
export class PickupInStoreRootModule {}
