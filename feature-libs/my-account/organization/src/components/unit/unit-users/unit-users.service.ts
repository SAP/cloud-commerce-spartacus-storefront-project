import { Injectable } from '@angular/core';
import {
  BaseOrganizationListService,
  OrganizationTableType,
} from '../../shared';
import { EntitiesModel, OrgUnitService, B2BUser } from '@spartacus/core';
import { TableService, TableStructure } from '@spartacus/storefront';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitUsersService extends BaseOrganizationListService<B2BUser> {
  protected tableType = OrganizationTableType.UNIT_USERS;

  constructor(
    protected tableService: TableService,
    protected orgUnitService: OrgUnitService
  ) {
    super(tableService);
  }

  protected load(
    structure: TableStructure,
    code: string,
    roleId: string
  ): Observable<EntitiesModel<B2BUser>> {
    const config = structure.pagination;
    return this.orgUnitService.getUsers(code, roleId, config);
  }
}
