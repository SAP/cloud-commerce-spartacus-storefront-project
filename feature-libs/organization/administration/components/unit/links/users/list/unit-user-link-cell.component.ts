/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { B2BUnit } from '@commerce-storefront-toolset/core';
import {
  OutletContextData,
  TableDataOutletContext,
} from '@commerce-storefront-toolset/storefront';
import { Observable } from 'rxjs';
import { ItemService } from '../../../../shared/item.service';
import { CellComponent } from '../../../../shared/table/cell.component';

@Component({
  selector: 'cx-org-unit-user-link-cell',
  template: `
    <a
      *ngIf="hasItem && (unitKey$ | async) as uid"
      [routerLink]="
        { cxRoute: 'orgUnitUserRoles', params: getRouterModel(uid) } | cxUrl
      "
    >
      {{ 'orgUser.roles' | cxTranslate }}
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitUserRolesCellComponent extends CellComponent {
  unitKey$: Observable<string> = this.itemService.key$;
  constructor(
    protected outlet: OutletContextData<TableDataOutletContext>,
    protected itemService: ItemService<B2BUnit>
  ) {
    super(outlet);
  }

  getRouterModel(uid: string): any {
    return { ...this.outlet.context, uid };
  }
}
