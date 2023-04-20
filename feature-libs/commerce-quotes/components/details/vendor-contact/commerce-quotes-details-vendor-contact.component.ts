/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ViewChild } from '@angular/core';
import { CommerceQuotesFacade } from '@spartacus/commerce-quotes/root';
import { EventService } from '@spartacus/core';
import {
  ICON_TYPE,
  MessagingComponent,
  MessagingConfigs,
} from '@spartacus/storefront';

@Component({
  selector: 'cx-commerce-quotes-details-vendor-contact',
  templateUrl: './commerce-quotes-details-vendor-contact.component.html',
})
export class CommerceQuotesDetailsVendorContactComponent {
  quoteDetails$ = this.commerceQuotesService.getQuoteDetails();
  showVendorContact = true;
  iconTypes = ICON_TYPE;
  vendorplaceHolder: string = 'Vendor Contact Component';
  @ViewChild(MessagingComponent) messagingComponent: MessagingComponent;

  messagingConfigs: MessagingConfigs = this.prepareMessagingConfigs();
  constructor(
    protected commerceQuotesService: CommerceQuotesFacade,
    protected eventService: EventService
  ) {}
  onSend(event: { message: string }) {
    console.log('message :>> ', event.message);
  }
  protected prepareMessagingConfigs(): MessagingConfigs {
    return {
      charactersLimit: 20,
    };
  }
}
