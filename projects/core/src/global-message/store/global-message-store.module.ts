/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { StateModule } from '../../state/state.module';
import { GLOBAL_MESSAGE_FEATURE } from './global-message-state';
import { reducerProvider, reducerToken } from './reducers/index';

@NgModule({
  imports: [
    StateModule,
    StoreModule.forFeature(GLOBAL_MESSAGE_FEATURE, reducerToken),
  ],
  providers: [reducerProvider],
})
export class GlobalMessageStoreModule {}
