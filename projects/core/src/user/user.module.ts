import { ModuleWithProviders, NgModule } from '@angular/core';
import { UserStoreModule } from './store/user-store.module';
import { PageMetaResolver } from '../cms/page/page-meta.resolver';
import { FindProductPageMetaResolver } from './services/find-product-page-meta.resolver';

@NgModule({
  imports: [UserStoreModule],
})
export class UserModule {
  static forRoot(): ModuleWithProviders<UserModule> {
    return {
      ngModule: UserModule,
      providers: [
        {
          provide: PageMetaResolver,
          useExisting: FindProductPageMetaResolver,
          multi: true,
        },
      ],
    };
  }
}
