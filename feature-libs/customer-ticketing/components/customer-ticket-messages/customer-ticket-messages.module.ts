import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { CustomerTicketMessagesComponent } from './customer-ticket-messages.component';
import { IconModule } from '@spartacus/storefront';

@NgModule({
  imports: [CommonModule, I18nModule, UrlModule, IconModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        SupportTicketUpdateComponent: {
          component: CustomerTicketMessagesComponent,
          gurds: [AuthGuard],
        },
      },
    }),
  ],
  declarations: [CustomerTicketMessagesComponent],
  exports: [CustomerTicketMessagesComponent],
})
export class CustomerTicketMessagesModule {}
