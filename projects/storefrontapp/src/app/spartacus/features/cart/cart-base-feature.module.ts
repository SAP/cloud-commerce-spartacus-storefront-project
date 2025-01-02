/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import {
    cartBaseTranslationChunksConfig,
    cartBaseTranslations,
} from '@spartacus/cart/base/assets';
import {
    ADD_TO_CART_FEATURE,
    CART_BASE_FEATURE,
    CartBaseRootModule,
    MINI_CART_FEATURE,
} from '@spartacus/cart/base/root';
import { provideConfig } from '@spartacus/core';

@NgModule({
  imports: [CartBaseRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [CART_BASE_FEATURE]: {
          module: () =>
            import('./cart-base-wrapper.module').then(
              (m) => m.CartBaseWrapperModule
            ),
        },
      },
    }),
    provideConfig({
      featureModules: {
        [MINI_CART_FEATURE]: {
          module: () =>
            import('@spartacus/cart/base/components/mini-cart').then(
              (m) => m.MiniCartModule
            ),
        },
      },
    }),
    provideConfig({
      featureModules: {
        [ADD_TO_CART_FEATURE]: {
          module: () =>
            import('@spartacus/cart/base/components/add-to-cart').then(
              (m) => m.AddToCartModule
            ),
        },
      },
    }),
    provideConfig({
      i18n: {
        resources: cartBaseTranslations,
        chunks: cartBaseTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class CartBaseFeatureModule {}
