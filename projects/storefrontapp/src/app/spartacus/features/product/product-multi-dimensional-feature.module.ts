/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { provideConfig } from '@spartacus/core';
import {
  productMultidimensionalTranslationChunksConfig,
  productMultidimensionalTranslations,
} from '@spartacus/product/multi-dimensional/assets';
import {
  PRODUCT_MULTIDIMENSIONAL_FEATURE,
  VariantsMultiDimensionalRootModule,
} from '@spartacus/product/multi-dimensional/root';

@NgModule({
  imports: [VariantsMultiDimensionalRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [PRODUCT_MULTIDIMENSIONAL_FEATURE]: {
          module: () =>
            import('@spartacus/product/multi-dimensional').then(
              (m) => m.ProductMultiDimensionalModule
            ),
        },
      },
      i18n: {
        resources: productMultidimensionalTranslations,
        chunks: productMultidimensionalTranslationChunksConfig,
      },
    }),
  ],
})
export class ProductMultiDimensionalFeatureModule {}
