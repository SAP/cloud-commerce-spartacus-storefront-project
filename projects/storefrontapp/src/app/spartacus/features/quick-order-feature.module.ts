import { NgModule } from '@angular/core';
import {
  quickOrderTranslationChunksConfig,
  quickOrderTranslations,
} from '@spartacus/cart/quick-order/assets';
import { QuickOrderRootModule } from '@spartacus/cart/quick-order/root';
import { provideConfig } from '@spartacus/core';

@NgModule({
  imports: [QuickOrderRootModule],
  providers: [
    provideConfig({
      featureModules: {
        cartQuickOrder: {
          module: () =>
            import('@spartacus/cart/quick-order').then(
              (m) => m.QuickOrderModule
            ),
        },
      },
      i18n: {
        resources: quickOrderTranslations,
        chunks: quickOrderTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class QuickOrderFeatureModule {}
