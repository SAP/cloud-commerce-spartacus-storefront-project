/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { SavedCartConnector } from './connectors/saved-cart.connector';
import { SavedCartEventsModule } from './events/saved-cart-events.module';
import { facadeProviders } from './facade/facade-providers';
import { SavedCartStoreModule } from './store/saved-cart-store.module';

@NgModule({
  imports: [SavedCartStoreModule, SavedCartEventsModule],
  providers: [SavedCartConnector, ...facadeProviders],
})
export class SavedCartCoreModule {}
