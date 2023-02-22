/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';

import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import {
  unitsCmsConfig,
  userCmsConfig,
  UserListService,
} from '@spartacus/organization/administration/components';
import { B2BUserService } from '@spartacus/organization/administration/core';
import { CdcB2BUserService } from './cdc-b2b-user.service';
import { CdcUserListService } from './cdc-user-list.service';

@NgModule({
  providers: [
    { provide: B2BUserService, useClass: CdcB2BUserService },
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ManageUsersListComponent: {
          providers: [
            {
              provide: UserListService,
              useExisting: CdcUserListService,
            },
            userCmsConfig.cmsComponents?.ManageUsersListComponent?.providers ||
              [],
          ],
        },
      },
    }),
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ManageUnitsListComponent: {
          providers: [
            {
              provide: B2BUserService,
              useExisting: CdcB2BUserService,
            },
            unitsCmsConfig.cmsComponents?.ManageUnitsListComponent?.providers ||
              [],
          ],
        },
      },
    }),
  ],
})
export class CdcAdministrationModule {}
