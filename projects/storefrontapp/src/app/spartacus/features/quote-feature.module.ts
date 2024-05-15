/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { I18nConfig, provideConfig } from '@spartacus/core';
import {
  quoteTranslationChunksConfig,
  quoteTranslations,
} from '@spartacus/quote/assets';
import {
  QUOTE_CART_GUARD_FEATURE,
  QUOTE_FEATURE,
  QUOTE_REQUEST_FEATURE,
  QuoteRootModule,
} from '@spartacus/quote/root';
// import { CPQ_QUOTE_FEATURE_NAME } from '@spartacus/schematics';

@NgModule({
  imports: [QuoteRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [QUOTE_FEATURE]: {
          module: () => import('@spartacus/quote').then((m) => m.QuoteModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: quoteTranslations,
        chunks: quoteTranslationChunksConfig,
      },
    }),
    provideConfig({
      featureModules: {
        [QUOTE_CART_GUARD_FEATURE]: {
          module: () =>
            import('@spartacus/quote/components/cart-guard').then(
              (m) => m.QuoteCartGuardComponentModule
            ),
        },
      },
    }),
    provideConfig({
      featureModules: {
        [QUOTE_REQUEST_FEATURE]: {
          module: () =>
            import('@spartacus/quote/components/request-button').then(
              (m) => m.QuoteRequestButtonModule
            ),
        },
      },
    }),
    // provideConfig({
    //   featureModules: {
    //     [CPQ_QUOTE_FEATURE_NAME]: {
    //       module: () =>
    //         import('@spartacus/cpq-quote/root').then(
    //           (m) => m.CpqQuoteRootdModule
    //         ),
    //     },
    //   },
    // }),
  ],
})
export class QuoteFeatureModule {}