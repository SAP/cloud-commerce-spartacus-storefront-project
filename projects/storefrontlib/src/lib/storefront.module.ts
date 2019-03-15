import { NgModule, ModuleWithProviders } from '@angular/core';

import {
  AuthModule,
  ConfigModule,
  provideConfig,
  RoutingModule,
  StateModule,
  SmartEditModule,
  CxApiModule
} from '@spartacus/core';

import { StorefrontModuleConfig } from './storefront-config';

import { CmsLibModule } from './cms-lib/index';
import { CmsModule } from './cms/index';
import { OccModule } from './occ/index';
import { UiModule, UiFrameworkModule } from './ui/index';
import { provideConfigFromMetaTags } from './provide-config-from-meta-tags';
import { MultiStepCheckoutModule } from './checkout/index';
import { StoreFinderModule } from './store-finder/store-finder.module';

@NgModule({
  imports: [
    StateModule,
    RoutingModule,
    AuthModule.forRoot(),
    OccModule,
    StoreFinderModule,
    CmsLibModule,
    CmsModule,
    UiModule,
    UiFrameworkModule,
    ConfigModule.forRoot(),
    CxApiModule,
    SmartEditModule.forRoot(),
    MultiStepCheckoutModule
  ],
  exports: [UiModule],
  declarations: []
})
export class StorefrontModule {
  static withConfig(config?: StorefrontModuleConfig): ModuleWithProviders {
    return {
      ngModule: StorefrontModule,
      providers: [provideConfig(config), ...provideConfigFromMetaTags()]
    };
  }
}
