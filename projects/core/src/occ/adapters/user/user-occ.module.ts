import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UserOrderAdapter } from '../../../user/connectors/order/user-order.adapter';
import { OccUserOrderAdapter } from './occ-user-order.adapter';
import { UserDetailsAdapter } from '../../../user/connectors/details/user-details.adapter';
import { OccUserDetailsAdapter } from './occ-user-details.adapter';
import { UserAddressAdapter } from '../../../user/connectors/address/user-address.adapter';
import { OccUserAddressAdapter } from './occ-user-address.adapter';
import { UserAccountAdapter } from '../../../user/connectors/account/user-account.adapter';
import { OccUserAccountAdapter } from './occ-user-account.adapter';
import { UserPaymentAdapter } from '../../../user/connectors/payment/user-payment.adapter';
import { OccUserPaymentAdapter } from './occ-user-payment.adapter';
import { OccUserConsentAdapter } from './occ-user-consent.adapter';
import { UserConsentAdapter } from '../../../user/connectors/consent/user-consent.adapter';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    { provide: UserDetailsAdapter, useClass: OccUserDetailsAdapter },
    { provide: UserAddressAdapter, useClass: OccUserAddressAdapter },
    { provide: UserAccountAdapter, useClass: OccUserAccountAdapter },
    { provide: UserConsentAdapter, useClass: OccUserConsentAdapter },
    {
      provide: UserPaymentAdapter,
      useClass: OccUserPaymentAdapter,
    },
    { provide: UserOrderAdapter, useClass: OccUserOrderAdapter },
  ],
})
export class UserOccModule {}
