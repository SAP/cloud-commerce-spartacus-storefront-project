/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { I18nModule, UrlModule } from '@commerce-storefront-toolset/core';
import { FormErrorsModule } from '@commerce-storefront-toolset/storefront';
import { FormModule } from '../../shared/form/form.module';
import { UserGroupFormComponent } from './user-group-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    UrlModule,
    I18nModule,
    ReactiveFormsModule,
    FormErrorsModule,
    FormModule,
  ],
  declarations: [UserGroupFormComponent],
})
export class UserGroupFormModule {}
