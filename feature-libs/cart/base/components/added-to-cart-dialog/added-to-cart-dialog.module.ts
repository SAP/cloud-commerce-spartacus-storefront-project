/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import {
  IconModule,
  ItemCounterModule,
  ModalModule,
  OutletModule,
  PromotionsModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { CartItemContextDirectiveModule } from '../cart-shared/cart-item/model/cart-item-context-directive/cart-item-context.directive.module';
import { CartSharedModule } from '../cart-shared/cart-shared.module';
import { AddedToCartDialogEventListener } from './added-to-cart-dialog-event.listener';
import { AddedToCartDialogComponent } from './added-to-cart-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CartSharedModule,
    RouterModule,
    SpinnerModule,
    PromotionsModule,
    UrlModule,
    IconModule,
    I18nModule,
    ItemCounterModule,
    ModalModule,
    CartItemContextDirectiveModule,
    OutletModule,
  ],
  declarations: [AddedToCartDialogComponent],
  exports: [AddedToCartDialogComponent],
})
export class AddedToCartDialogModule {
  constructor(_addToCartDialogEventListener: AddedToCartDialogEventListener) {
    // Intentional empty constructor
  }
}
