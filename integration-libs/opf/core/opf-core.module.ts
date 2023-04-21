/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { MODULE_INITIALIZER } from '@spartacus/core';
import { OpfCheckoutConnector, OtpConnector } from './connectors';
import { facadeProviders } from './facade/facade-providers';
import { OpfStatePersistenceService } from './services/opf-state-persistence.service';
import { OpfStoreModule } from './store/opf-store.module';

export function opfStatePersistenceFactory(
  opfStatePersistenceService: OpfStatePersistenceService
): () => void {
  const result = () => opfStatePersistenceService.initSync();
  return result;
}

@NgModule({
  imports: [OpfStoreModule],
  providers: [
    {
      provide: MODULE_INITIALIZER,
      useFactory: opfStatePersistenceFactory,
      deps: [OpfStatePersistenceService],
      multi: true,
    },
    ...facadeProviders,
    OpfCheckoutConnector,
    OtpConnector,
  ],
})
export class OpfCoreModule {}
