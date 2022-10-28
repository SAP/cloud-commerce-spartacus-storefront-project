/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CommerceQuotesListEventListener } from './commerce-quotes-list-event.listener';

@NgModule({})
export class CommerceQuotesEventModule {
  constructor(
    _commerceQuotesListEventListener: CommerceQuotesListEventListener
  ) {}
}
