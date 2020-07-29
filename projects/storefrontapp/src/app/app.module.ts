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
import {
  EventService,
  OrderPlacedEvent,
  TestConfigModule,
} from '@spartacus/core';
import {
  CartPageVisitedEvent,
  CategoryPageResultsEvent,
  HomePageVisitedEvent,
  JsonLdBuilderModule,
  PageVisitedEvent,
  ProductDetailsPageEvent,
  SearchPageResultsEvent,
  StorefrontComponent,
} from '@spartacus/storefront';
import { b2bFeature } from '../environments/b2b/b2b.feature';
import { b2cFeature } from '../environments/b2c/b2c.feature';
import { cdsFeature } from '../environments/cds/cds.feature';
import { environment } from '../environments/environment';
import { TestOutletModule } from '../test-outlets/test-outlet.module';

registerLocaleData(localeDe);
registerLocaleData(localeJa);
registerLocaleData(localeZh);

const devImports = [];
if (!environment.production) {
  devImports.push(StoreDevtoolsModule.instrument());
}

let additionalImports = [];

if (environment.cds) {
  additionalImports = [...additionalImports, ...cdsFeature.imports];
}

if (environment.b2b) {
  additionalImports = [...additionalImports, ...b2bFeature.imports];
} else {
  additionalImports = [...additionalImports, ...b2cFeature.imports];
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
export class AppModule {
  constructor(events: EventService) {
    events.get(PageVisitedEvent).subscribe((x) => console.log('page: ', x));
    events.get(HomePageVisitedEvent).subscribe((x) => console.log('home: ', x));
    events.get(CartPageVisitedEvent).subscribe((x) => console.log('cart: ', x));

    events
      .get(ProductDetailsPageEvent)
      .subscribe((x) => console.log('pdp: ', x));
    events
      .get(CategoryPageResultsEvent)
      .subscribe((x) => console.log('cat: ', x));
    // events.get(BrandPageVisited).subscribe((x) => console.log('brand: ', x));
    events
      .get(SearchPageResultsEvent)
      .subscribe((x) => console.log('search: ', x));

    events.get(OrderPlacedEvent).subscribe((x) => console.log('order: ', x));
  }
}
