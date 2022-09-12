/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { EntitiesModel, PaginationModel } from '@commerce-storefront-toolset/core';
import {
  B2BUnitNode,
  OrgUnitService,
} from '@commerce-storefront-toolset/organization/administration/core';
import { TableService } from '@commerce-storefront-toolset/storefront';
import { Observable } from 'rxjs';
import { SubListService } from '../../../shared/sub-list/sub-list.service';
import { OrganizationTableType } from '../../../shared/organization.model';

@Injectable({
  providedIn: 'root',
})
export class UnitChildrenService extends SubListService<B2BUnitNode> {
  protected tableType = OrganizationTableType.UNIT_CHILDREN;
  protected _domainType = OrganizationTableType.UNIT;

  constructor(
    protected tableService: TableService,
    protected orgUnitService: OrgUnitService
  ) {
    super(tableService);
  }

  // method to be adjusted for proper children list when ready
  protected load(
    _pagination: PaginationModel,
    code: string
  ): Observable<EntitiesModel<B2BUnitNode>> {
    return this.orgUnitService.getChildUnits(code);
  }
}
