import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  provideConfig,
  provideDefaultConfig,
  provideDefaultConfigFactory,
  OrganizationModule,
} from '@spartacus/core';
import { CmsLibModule } from '../cms-components/cms-lib.module';
import { StorefrontConfig } from '../storefront-config';
import { b2bLayoutConfig, mediaConfig } from './config/index';
import { defaultCmsContentConfig } from './config/static-cms-structure/default-cms-content.config';
import { StorefrontModule } from './storefront.module';

@NgModule({
  imports: [
    OrganizationModule.forRoot(),
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
    provideDefaultConfig(b2bLayoutConfig),
    provideDefaultConfig(mediaConfig),
    provideDefaultConfigFactory(defaultCmsContentConfig),
  ],
  exports: [StorefrontModule],
})
export class B2bStorefrontModule {
  static withConfig(
    config?: StorefrontConfig
  ): ModuleWithProviders<B2bStorefrontModule> {
    return {
      ngModule: B2bStorefrontModule,
      providers: [provideConfig(config)],
    };
  }
}
