import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeJa from '@angular/common/locales/ja';
import localeZh from '@angular/common/locales/zh';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TestConfigModule } from '@spartacus/core';
import {
  JsonLdBuilderModule,
  StorefrontComponent,
} from '@spartacus/storefront';
import { environment } from '../environments/environment';
import { b2bFeature } from '../environments/features/b2b/b2b.feature';
import { b2cFeature } from '../environments/features/b2c/b2c.feature';
import { cdsFeature } from '../environments/integrations/cds/cds.feature';
import { TestOutletModule } from '../test-outlets/test-outlet.module';

registerLocaleData(localeDe);
registerLocaleData(localeJa);
registerLocaleData(localeZh);

const devImports = [];
if (!environment.production) {
  devImports.push(StoreDevtoolsModule.instrument());
}

let additionalImports = [];

if (environment.b2b) {
  additionalImports = [...additionalImports, ...b2bFeature.imports];
} else {
  additionalImports = [...additionalImports, ...b2cFeature.imports];
}

if (environment.cds) {
  additionalImports = [...additionalImports, ...cdsFeature.imports];
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'spartacus-app' }),
    BrowserTransferStateModule,
    JsonLdBuilderModule,
    ...additionalImports,
    TestOutletModule, // custom usages of cxOutletRef only for e2e testing
    TestConfigModule.forRoot({ cookie: 'cxConfigE2E' }), // Injects config dynamically from e2e tests. Should be imported after other config modules.

    ...devImports,
  ],

  bootstrap: [StorefrontComponent],
})
export class AppModule {}
