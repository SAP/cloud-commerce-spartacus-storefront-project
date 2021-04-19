import { ModuleWithProviders, NgModule } from '@angular/core';
import { PageMetaResolver } from '@spartacus/core';
import { CheckoutEventModule } from './events/checkout-event.module';
import { interceptors } from './http-interceptors/index';
import { CheckoutPageMetaResolver } from './services/checkout-page-meta.resolver';
import { CheckoutStoreModule } from './store/checkout-store.module';

@NgModule({
  imports: [CheckoutStoreModule, CheckoutEventModule],
})
export class CheckoutCoreModule {
  static forRoot(): ModuleWithProviders<CheckoutCoreModule> {
    return {
      ngModule: CheckoutCoreModule,
      providers: [
        ...interceptors,
        {
          provide: PageMetaResolver,
          useExisting: CheckoutPageMetaResolver,
          multi: true,
        },
      ],
    };
  }
}
