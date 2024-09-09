/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ROUTE_PARAMS } from '@spartacus/organization/administration/root';
import { ListService } from '../../../../shared/list/list.service';
import { UnitAddressListService } from './unit-address-list.service';
import { I18nModule } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { SubListComponent } from '../../../../shared/sub-list/sub-list.component';

@Component({
    selector: 'cx-org-unit-address-list',
    templateUrl: './unit-address-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'content-wrapper' },
    providers: [
        {
            provide: ListService,
            useExisting: UnitAddressListService,
        },
    ],
    standalone: true,
    imports: [
        SubListComponent,
        RouterLink,
        I18nModule,
    ],
})
export class UnitAddressListComponent {
  routerKey = ROUTE_PARAMS.addressCode;
}
