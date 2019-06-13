import { NgModule } from '@angular/core';
import { ProcessModule } from '../process/process.module';
import { UserService } from './facade/index';
import { UserStoreModule } from './store/user-store.module';
import { PageMetaResolver } from '../cms/page/page-meta.resolver';
import { FindProductSearchPageMetaResolver } from './services/find-product-search-page-meta.resolver';

@NgModule({
  imports: [UserStoreModule, ProcessModule],
  providers: [
    UserService,
    {
      provide: PageMetaResolver,
      useExisting: FindProductSearchPageMetaResolver,
      multi: true,
    },
  ],
})
export class UserModule {}
