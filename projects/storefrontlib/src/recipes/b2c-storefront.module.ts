import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  provideConfig,
  provideDefaultConfig,
  provideDefaultConfigFactory,
} from '@spartacus/core';
import { CmsLibModule } from '../cms-components/cms-lib.module';
import { StorefrontConfig } from '../storefront-config';
import { b2cLayoutConfig, mediaConfig } from './config/index';
import { defaultCmsContentConfig } from './config/static-cms-structure/default-cms-content.config';
import { StorefrontModule } from './storefront.module';

@NgModule({
  imports: [
    StorefrontModule,

    // the cms lib module contains all components that added in the bundle
    CmsLibModule,
  ],
  providers: [
    provideDefaultConfig({
      pwa: {
        enabled: true,
        addToHomeScreen: true,
      },
    }),
    provideDefaultConfig(b2cLayoutConfig),
    provideDefaultConfig(mediaConfig),
    provideDefaultConfigFactory(defaultCmsContentConfig),
  ],
  exports: [StorefrontModule],
})
export class B2cStorefrontModule {
  static withConfig(
    config?: StorefrontConfig
  ): ModuleWithProviders<B2cStorefrontModule> {
    return {
      ngModule: B2cStorefrontModule,
      providers: [provideConfig(config)],
    };
  }
}
