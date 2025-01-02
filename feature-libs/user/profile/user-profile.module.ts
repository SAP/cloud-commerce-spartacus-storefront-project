/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CaptchaModule } from '@spartacus/storefront';
import { UserProfileComponentsModule } from '@spartacus/user/profile/components';
import { UserProfileCoreModule } from '@spartacus/user/profile/core';
import { UserProfileOccModule } from '@spartacus/user/profile/occ';

@NgModule({
  imports: [
    UserProfileCoreModule,
    UserProfileOccModule,
    UserProfileComponentsModule,
    CaptchaModule,
  ],
})
export class UserProfileModule {}
