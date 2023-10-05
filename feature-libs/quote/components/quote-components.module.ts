/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { ListNavigationModule } from '@spartacus/storefront';
import { QuoteActionsByRoleModule } from './actions/by-role/quote-actions-by-role.module';
import { QuoteConfirmActionDialogModule } from './actions/confirm-dialog/quote-confirm-action-dialog.module';
import { QuoteActionLinksModule } from './actions/link/quote-action-links.module';
import { defaultQuoteUIConfig } from './config/default-quote-ui.config';
import { QuoteSellerEditModule } from './header/seller-edit/quote-seller-edit.module';
import { QuoteListModule } from './quote-list/quote-list.module';
import { QuoteRequestButtonModule } from './quote-request-button/quote-request-button.module';
import { QuoteDetailsEditModule } from './header/buyer-edit/quote-details-edit.module';
import { QuoteDetailsOverviewModule } from './header/overview/quote-details-overview.module';
import { QuoteDetailsCommentModule } from './comment/quote-details-comment.module';
import { QuoteDetailsCartModule } from './items/quote-details-cart.module';
import { QuoteDetailsCartSummaryModule } from './header';

@NgModule({
  imports: [
    CommonModule,
    QuoteListModule,
    QuoteDetailsEditModule,
    QuoteDetailsOverviewModule,
    QuoteDetailsCartModule,
    QuoteRequestButtonModule,
    QuoteActionLinksModule,
    QuoteActionsByRoleModule,
    QuoteDetailsCommentModule,
    QuoteSellerEditModule,
    ListNavigationModule,
    QuoteConfirmActionDialogModule,
    QuoteDetailsCartSummaryModule
  ],
  providers: [provideDefaultConfig(defaultQuoteUIConfig)],
})
export class QuoteComponentsModule {}
