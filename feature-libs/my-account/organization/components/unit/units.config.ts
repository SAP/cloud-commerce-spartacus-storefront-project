import {
  AuthGuard,
  CmsConfig,
  ParamsMapping,
  RoutingConfig,
} from '@spartacus/core';
import { AdminGuard } from '@spartacus/my-account/organization/core';
import { TableConfig } from '@spartacus/storefront';
import { MAX_OCC_INTEGER_VALUE, ROUTE_PARAMS } from '../constants';
import { OrganizationItemService } from '../shared/organization-item.service';
import { OrganizationListService } from '../shared/organization-list/organization-list.service';
import { AssignCellComponent } from '../shared/organization-sub-list/assign-cell.component';
import { StatusCellComponent } from '../shared/organization-table/status/status-cell.component';
import { UnitCellComponent } from '../shared/organization-table/unit/unit-cell.component';
import { OrganizationTableType } from '../shared/organization.model';
import { UnitDetailsComponent } from './details/unit-details.component';
import { UnitFormComponent } from './form/unit-form.component';
import { ActiveUnitGuard } from './guards/active-unit.guard';
import { ExistUnitGuard } from './guards/exist-unit.guard';
import { UnitAddressDetailsComponent } from './links/addresses/details/unit-address-details.component';
import { UnitAddressFormComponent } from './links/addresses/form/unit-address-form.component';
import { LinkCellComponent } from './links/addresses/list/link-cell.component';
import { UnitAddressListComponent } from './links/addresses/list/unit-address-list.component';
import { UnitAssignedApproverListComponent } from './links/approvers/assigned/unit-assigned-approver-list.component';
import { UnitApproverListComponent } from './links/approvers/unit-approver-list.component';
import { UnitChildrenComponent } from './links/children/unit-children.component';
import { UnitCostCenterListComponent } from './links/cost-centers/unit-cost-centers.component';
import { UnitUserRolesCellComponent } from './links/users/list/unit-user-link-cell.component';
import { UnitUserListComponent } from './links/users/list/unit-user-list.component';
import { UnitUserRolesFormComponent } from './links/users/roles/unit-user-roles.component';
import { UnitListComponent } from './list/unit-list.component';
import { UnitItemService } from './services/unit-item.service';
import { UnitListService } from './services/unit-list.service';

const listPath = `organization/units/:${ROUTE_PARAMS.unitCode}`;
const paramsMapping: ParamsMapping = {
  unitCode: 'uid',
  addressId: 'id',
  userCode: 'customerId',
};

export const unitsRoutingConfig: RoutingConfig = {
  routing: {
    routes: {
      orgUnits: {
        paths: ['organization/units'],
      },
      orgUnitCreate: {
        paths: ['organization/units/create'],
      },
      orgUnitDetails: {
        paths: [listPath],
        paramsMapping,
      },
      orgUnitEdit: {
        paths: [`${listPath}/edit`],
        paramsMapping,
      },
      orgUnitChildren: {
        paths: [`${listPath}/children`],
        paramsMapping,
      },
      orgUnitCreateChild: {
        paths: [`${listPath}/children/create`],
        paramsMapping,
      },
      unitUserList: {
        paths: [`${listPath}/users`],
        paramsMapping,
      },
      unitUserRoles: {
        paths: [`${listPath}/users/:userCode/roles`],
        paramsMapping,
      },
      orgUnitApprovers: {
        paths: [`${listPath}/approvers`],
        paramsMapping,
      },
      orgUnitAssignApprovers: {
        paths: [`${listPath}/approvers/assign`],
        paramsMapping,
      },
      unitAddressList: {
        paths: [`${listPath}/addresses`],
        paramsMapping,
      },
      orgUnitAddressCreate: {
        paths: [`${listPath}/addresses/create`],
        paramsMapping,
      },
      unitAddressDetails: {
        paths: [`${listPath}/addresses/:addressId`],
        paramsMapping,
      },
      unitAddressEdit: {
        paths: [`${listPath}/addresses/:addressId/edit`],
        paramsMapping,
      },
      orgUnitCostCenters: {
        paths: [`${listPath}/cost-centers`],
        paramsMapping,
      },
    },
  },
};

export const unitsCmsConfig: CmsConfig = {
  cmsComponents: {
    ManageUnitsListComponent: {
      component: UnitListComponent,
      providers: [
        {
          provide: OrganizationListService,
          useExisting: UnitListService,
        },
        {
          provide: OrganizationItemService,
          useExisting: UnitItemService,
        },
      ],
      childRoutes: [
        {
          path: 'create',
          component: UnitFormComponent,
        },
        {
          path: `:${ROUTE_PARAMS.unitCode}`,
          component: UnitDetailsComponent,
          canActivate: [ExistUnitGuard],
          children: [
            {
              path: 'edit',
              component: UnitFormComponent,
              canActivate: [ActiveUnitGuard],
            },
            {
              path: 'children',
              component: UnitChildrenComponent,
              children: [
                {
                  path: 'create',
                  component: UnitFormComponent,
                },
              ],
            },
            {
              path: 'approvers',
              component: UnitAssignedApproverListComponent,
            },
            {
              path: 'approvers/assign',
              component: UnitApproverListComponent,
            },
            {
              path: 'users',
              component: UnitUserListComponent,
              children: [
                {
                  path: ':userCode/roles',
                  component: UnitUserRolesFormComponent,
                },
              ],
            },
            {
              path: 'cost-centers',
              component: UnitCostCenterListComponent,
            },
            {
              path: 'addresses',
              component: UnitAddressListComponent,
              children: [
                {
                  path: 'create',
                  component: UnitAddressFormComponent,
                },
                {
                  path: ':addressId',
                  component: UnitAddressDetailsComponent,
                },
                {
                  path: ':addressId/edit',
                  component: UnitAddressFormComponent,
                },
              ],
            },
          ],
        },
      ],

      guards: [AuthGuard, AdminGuard],
    },
  },
};

export function unitsTableConfigFactory(): TableConfig {
  return unitsTableConfig;
}

export const unitsTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.UNIT_USERS]: {
      cells: ['name', 'roles'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          roles: {
            dataComponent: UnitUserRolesCellComponent,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_CHILDREN]: {
      cells: ['name', 'active'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          active: {
            dataComponent: StatusCellComponent,
            linkable: false,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_APPROVERS]: {
      cells: ['name', 'orgUnit', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
          orgUnit: {
            linkable: false,
            dataComponent: UnitCellComponent,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_ASSIGNED_APPROVERS]: {
      cells: ['name', 'orgUnit', 'actions'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
          orgUnit: {
            dataComponent: UnitCellComponent,
          },
        },
      },
    },

    [OrganizationTableType.UNIT_COST_CENTERS]: {
      cells: ['name'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
      },
    },

    [OrganizationTableType.UNIT_ADDRESS]: {
      cells: ['formattedAddress'],
      options: {
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
        cells: {
          formattedAddress: {
            dataComponent: LinkCellComponent,
          },
        },
      },
    },
  },
};
