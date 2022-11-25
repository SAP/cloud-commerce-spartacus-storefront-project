/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { HttpErrorHandler, PageMetaResolver } from '@spartacus/core';
import { CustomerTicketingConnector } from './connectors';
import { facadeProviders } from './facade/facade-providers';
import { BadTicketRequestHandler } from './http-interceptors/handlers/bad-ticket-request.handler';
import { CustomerTicketingPageMetaResolver } from './services';

@NgModule({
  providers: [
    ...facadeProviders,
    CustomerTicketingConnector,
    CustomerTicketingPageMetaResolver,
    {
      provide: HttpErrorHandler,
      useExisting: BadTicketRequestHandler,
      multi: true,
    },
    {
      provide: PageMetaResolver,
      useExisting: CustomerTicketingPageMetaResolver,
      multi: true,
    },
  ],
})
export class CustomerTicketingCoreModule {}
