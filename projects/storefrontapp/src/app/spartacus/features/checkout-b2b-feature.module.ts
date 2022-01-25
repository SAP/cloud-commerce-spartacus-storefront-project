import { NgModule } from '@angular/core';
import {
  checkoutB2BTranslationChunksConfig,
  checkoutB2BTranslations,
} from '@spartacus/checkout/b2b/assets';
import {
  CheckoutB2BAuthGuard,
  CheckoutB2BStepsSetGuard,
} from '@spartacus/checkout/b2b/components';
import {
  CheckoutB2BRootModule,
  CHECKOUT_B2B_FEATURE,
} from '@spartacus/checkout/b2b/root';
import {
  checkoutTranslationChunksConfig,
  checkoutTranslations,
} from '@spartacus/checkout/base/assets';
import {
  CheckoutAuthGuard,
  CheckoutStepsSetGuard,
} from '@spartacus/checkout/base/components';
import { provideConfig } from '@spartacus/core';

@NgModule({
  imports: [CheckoutB2BRootModule],
  providers: [
    provideConfig({
      i18n: {
        resources: checkoutTranslations,
        chunks: checkoutTranslationChunksConfig,
      },
    }),
    provideConfig({
      i18n: {
        resources: checkoutB2BTranslations,
        chunks: checkoutB2BTranslationChunksConfig,
      },
    }),

    {
      provide: CheckoutAuthGuard,
      useExisting: CheckoutB2BAuthGuard,
    },
    {
      provide: CheckoutStepsSetGuard,
      useExisting: CheckoutB2BStepsSetGuard,
    },

    provideConfig({
      featureModules: {
        [CHECKOUT_B2B_FEATURE]: {
          module: () =>
            import('./checkout-b2b-feature-custom.module').then(
              (m) => m.CheckoutB2BFeatureCustomModule
            ),
        },
      },
    }),
  ],
})
export class CheckoutB2BFeatureModule {}
