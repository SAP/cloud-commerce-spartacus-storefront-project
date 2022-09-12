/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule, Provider, Type } from '@angular/core';
import {
  checkoutB2BTranslationChunksConfig,
  checkoutB2BTranslations,
} from '@commerce-storefront-toolset/checkout/b2b/assets';
import { CheckoutB2BRootModule } from '@commerce-storefront-toolset/checkout/b2b/root';
import {
  checkoutTranslationChunksConfig,
  checkoutTranslations,
} from '@commerce-storefront-toolset/checkout/base/assets';
import {
  CheckoutRootModule,
  CHECKOUT_FEATURE,
} from '@commerce-storefront-toolset/checkout/base/root';
import {
  checkoutScheduledReplenishmentTranslationChunksConfig,
  checkoutScheduledReplenishmentTranslations,
} from '@commerce-storefront-toolset/checkout/scheduled-replenishment/assets';
import { CheckoutScheduledReplenishmentRootModule } from '@commerce-storefront-toolset/checkout/scheduled-replenishment/root';
import { provideConfig } from '@commerce-storefront-toolset/core';
import { environment } from '../../../../environments/environment';

const extensionModules: Type<any>[] = [];
const extensionProviders: Provider[] = [];

if (environment.b2b) {
  extensionModules.push(
    CheckoutB2BRootModule,
    CheckoutScheduledReplenishmentRootModule
  );

  extensionProviders.push(
    provideConfig({
      i18n: {
        resources: checkoutB2BTranslations,
        chunks: checkoutB2BTranslationChunksConfig,
      },
    })
  );
  extensionProviders.push(
    provideConfig({
      i18n: {
        resources: checkoutScheduledReplenishmentTranslations,
        chunks: checkoutScheduledReplenishmentTranslationChunksConfig,
      },
    })
  );
}

@NgModule({
  imports: [CheckoutRootModule, ...extensionModules],
  providers: [
    provideConfig({
      featureModules: {
        [CHECKOUT_FEATURE]: {
          module: () =>
            import('./checkout-wrapper.module').then(
              (m) => m.CheckoutWrapperModule
            ),
        },
      },
    }),
    provideConfig({
      i18n: {
        resources: checkoutTranslations,
        chunks: checkoutTranslationChunksConfig,
      },
    }),
    ...extensionProviders,
  ],
})
export class CheckoutFeatureModule {}
