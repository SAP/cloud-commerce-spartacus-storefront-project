/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { PageLayoutModule, CmsPageGuard } from '@spartacus/storefront';
import { CommonModule } from '@angular/common';
import { TestOutletSlotComponent } from './test-outlet-slot.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
    CommonModule,
    PageLayoutModule,
    RouterModule.forChild([
        {
            path: 'test/outlet/slot',
            component: TestOutletSlotComponent,
            canActivate: [CmsPageGuard],
        },
    ]),
    TestOutletSlotComponent,
],
})
export class TestOutletSlotModule {}
