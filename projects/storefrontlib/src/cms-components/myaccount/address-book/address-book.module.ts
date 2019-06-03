import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  I18nModule,
  UserService,
} from '@spartacus/core';
import { CardModule } from '../../../shared/components/card/card.module';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { AddressFormModule } from '../../checkout/components/shipping-address/address-form/address-form.module';
import { AddressBookComponent } from './address-book.component';
import { AddressBookComponentService } from './address-book.component.service';
import { AddressCardComponent } from './address-card/address-card.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        AccountAddressBookComponent: {
          selector: 'cx-address-book',
          providers: [
            {
              provide: AddressBookComponentService,
              useClass: AddressBookComponentService,
              deps: [UserService],
            },
          ],
          guards: [AuthGuard],
        },
      },
    }),
    CardModule,
    AddressFormModule,
    SpinnerModule,
    I18nModule,
  ],
  declarations: [AddressBookComponent, AddressCardComponent],
  exports: [AddressBookComponent, AddressCardComponent],
  providers: [UserService, AddressBookComponentService],
  entryComponents: [AddressBookComponent],
})
export class AddressBookModule {}
