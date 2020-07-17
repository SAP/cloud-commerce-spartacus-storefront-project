import { AuthGuard, CmsConfig, RoutingConfig } from '@spartacus/core';
import { ManageUnitsListComponent } from './unit-list';
import { UnitCreateComponent } from './unit-create';
import { SplitViewDeactivateGuard, TableConfig } from '@spartacus/storefront';
import { UnitDetailsComponent } from './unit-details';
import { UnitEditComponent } from './unit-edit';
import { UnitUsersComponent } from './unit-users';
import { OrganizationTableType } from '../shared';

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
        paths: ['organization/units/:code'],
        paramsMapping: { code: 'uid' },
      },
      orgUnitEdit: {
        paths: ['organization/units/:code/edit'],
        paramsMapping: { code: 'uid' },
      },
      orgUnitUsers: {
        paths: ['organization/units/:code/users'],
        paramsMapping: { code: 'uid' },
      },

      // orgUnitAssignRoles: {
      //   paths: ['organization/unit/assign-roles/:code/:roleId'],
      // },
      // orgUnitApprovers: {
      //   paths: ['organization/unit/approvers/:code'],
      // },
      // orgUnitAssignApprovers: {
      //   paths: ['organization/unit/assign-approvers/:code'],
      // },
      // orgUnitManageAddresses: {
      //   paths: ['organization/unit/addresses/:code'],
      // },
      // orgUnitChildren: {
      //   paths: ['organization/unit/children/:code'],
      // },
      // orgUnitCostCenters: {
      //   paths: ['organization/unit/cost-centers/:code'],
      // },
      // orgUnitAddressEdit: {
      //   paths: ['organization/unit/address/edit/:code/:id'],
      // },
      // orgUnitAddressDetails: {
      //   paths: ['organization/unit/address/:code/:id'],
      // },
      // orgUnitAddressCreate: {
      //   paths: ['organization/unit/addresses/create/:code'],
      // },
    },
  },
};

export const unitsCmsConfig: CmsConfig = {
  cmsComponents: {
    ManageUnitsListComponent: {
      component: ManageUnitsListComponent,
      childRoutes: [
        {
          path: 'create',
          component: UnitCreateComponent,
          canDeactivate: [SplitViewDeactivateGuard],
        },
        {
          path: ':code',
          component: UnitDetailsComponent,
          canDeactivate: [SplitViewDeactivateGuard],
          children: [
            {
              path: 'edit',
              component: UnitEditComponent,
              canDeactivate: [SplitViewDeactivateGuard],
            },
            {
              path: 'users',
              component: UnitUsersComponent,
              canDeactivate: [SplitViewDeactivateGuard],
            },
          ],
        },
      ],

      guards: [AuthGuard],
    },
  },
};

export const unitsTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.UNIT_USERS]: [
      {
        headers: [{ key: 'summary' }],
        hideHeader: true,
      },
    ],
  },
};
