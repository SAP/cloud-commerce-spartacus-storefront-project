/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OpfQuickBuyTransactionService } from '@spartacus/opf/quick-buy/core';
import { ApplePayComponent } from './apple-pay.component';
import { ApplePayService } from './apple-pay.service';

@NgModule({
  imports: [CommonModule],
  declarations: [ApplePayComponent],
  exports: [ApplePayComponent],
  providers: [ApplePayService, OpfQuickBuyTransactionService],
})
export class OpfApplePayModule {}
