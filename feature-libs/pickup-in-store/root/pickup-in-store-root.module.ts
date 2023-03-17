/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { STORE_FINDER_FEATURE } from '@spartacus/storefinder/root';
import {
  CartPickupOptionsContainerModule,
  OrderConsignmentContainerModule,
  PdpPickupOptionsContainerModule,
  PickupInStoreOrderOverviewContainerModule,
} from './components/index';

import {
  PICKUP_IN_STORE_CORE_FEATURE,
  PICKUP_IN_STORE_FEATURE,
} from './feature-name';

export function defaultPickupInStoreComponentsConfig(): CmsConfig {
  return {
    featureModules: {
      [PICKUP_IN_STORE_FEATURE]: {
        cmsComponents: [
          'CheckoutReviewPickup',
          'MyPreferredStoreComponent',
          'OrderConfirmationPickUpComponent',
          'PickupInStoreDeliveryModeComponent',
        ],
        dependencies: [STORE_FINDER_FEATURE],
      },
      [PICKUP_IN_STORE_CORE_FEATURE]: PICKUP_IN_STORE_FEATURE,
    },
  };
}

@NgModule({
  imports: [
    CartPickupOptionsContainerModule,
    PdpPickupOptionsContainerModule,
    OrderConsignmentContainerModule,
    PickupInStoreOrderOverviewContainerModule,
  ],
  providers: [
    provideDefaultConfigFactory(defaultPickupInStoreComponentsConfig),
  ],
})
export class PickupInStoreRootModule {}
