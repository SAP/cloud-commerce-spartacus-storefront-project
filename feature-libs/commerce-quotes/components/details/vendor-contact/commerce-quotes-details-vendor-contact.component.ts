/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { CommerceQuotesFacade } from '@spartacus/commerce-quotes/root';
import { ICON_TYPE } from '@spartacus/storefront';

@Component({
  selector: 'cx-commerce-quotes-details-vendor-contact',
  templateUrl: './commerce-quotes-details-vendor-contact.component.html',
})
export class CommerceQuotesDetailsVendorContactComponent {
  quoteDetails$ = this.commerceQuotesService.getQuoteDetails();
  showVendorContact = true;
  iconTypes = ICON_TYPE;

  constructor(protected commerceQuotesService: CommerceQuotesFacade) {}
}
