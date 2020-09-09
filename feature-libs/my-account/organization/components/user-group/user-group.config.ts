import {
  AuthGuard,
  CmsConfig,
  ParamsMapping,
  RoutingConfig,
} from '@spartacus/core';
import { TableConfig } from '@spartacus/storefront';
import { MAX_OCC_INTEGER_VALUE, ROUTE_PARAMS } from '../constants';
import {
  ActiveLinkCellComponent,
  AssignCellComponent,
  OrganizationCellComponent,
} from '../shared';
import { OrganizationItemService } from '../shared/organization-item.service';
import { OrganizationListComponent } from '../shared/organization-list/organization-list.component';
import { OrganizationListService } from '../shared/organization-list/organization-list.service';
import { UnitCellComponent } from '../shared/organization-table/unit/unit-cell.component';
import { OrganizationTableType } from '../shared/organization.model';
import { UserGroupDetailsComponent } from './details/user-group-details.component';
import { UserGroupFormComponent } from './form';
import { UserGroupPermissionListComponent } from './permissions';
import { UserGroupAssignedPermissionListComponent } from './permissions/assigned/user-group-assigned-permission-list.component';
import { UserGroupListService } from './services';
import { UserGroupItemService } from './services/user-group-item.service';
import { UserGroupAssignedUserListComponent } from './users/assigned/user-group-assigned-user-list.component';
import { UserGroupUserListComponent } from './users/user-group-user-list.component';

const listPath = `organization/user-groups/:${ROUTE_PARAMS.userGroupCode}`;
const paramsMapping: ParamsMapping = {
  userGroupCode: 'uid',
};

// TODO: this doesn't work with lazy loaded feature
export const userGroupRoutingConfig: RoutingConfig = {
  routing: {
    routes: {
      userGroup: {
        paths: ['organization/user-groups'],
      },
      userGroupCreate: {
        paths: ['organization/user-groups/create'],
      },
      userGroupDetails: {
        paths: [listPath],
        paramsMapping,
      },
      userGroupEdit: {
        paths: [`${listPath}/edit`],
        paramsMapping,
      },
      userGroupUsers: {
        paths: [`${listPath}/users`],
        paramsMapping,
      },
      userGroupAssignUsers: {
        paths: [`${listPath}/users/assign`],
        paramsMapping,
      },
      userGroupPermissions: {
        paths: [`${listPath}/purchase-limits`],
        paramsMapping,
      },
      userGroupAssignPermissions: {
        paths: [`${listPath}/purchase-limits/assign`],
        paramsMapping,
      },
    },
  },
};

export const userGroupCmsConfig: CmsConfig = {
  cmsComponents: {
    ManageUserGroupsListComponent: {
      component: OrganizationListComponent,
      providers: [
        {
          provide: OrganizationListService,
          useExisting: UserGroupListService,
        },
        {
          provide: OrganizationItemService,
          useExisting: UserGroupItemService,
        },
      ],
      childRoutes: [
        {
          path: 'create',
          component: UserGroupFormComponent,
        },
        {
          path: `:${ROUTE_PARAMS.userGroupCode}`,
          component: UserGroupDetailsComponent,
          children: [
            {
              path: 'users',
              component: UserGroupAssignedUserListComponent,
            },
            {
              path: 'users/assign',
              component: UserGroupUserListComponent,
            },
            {
              path: 'purchase-limits',
              component: UserGroupAssignedPermissionListComponent,
            },
            {
              path: 'purchase-limits/assign',
              component: UserGroupPermissionListComponent,
            },
          ],
        },
        {
          path: `:${ROUTE_PARAMS.userGroupCode}/edit`,
          component: UserGroupFormComponent,
        },
      ],
      guards: [AuthGuard],
    },
  },
};

export function userGroupTableConfigFactory(): TableConfig {
  return userGroupTableConfig;
}

export const userGroupTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.USER_GROUP]: {
      cells: ['name', 'uid', 'unit'],
      options: {
        dataComponent: OrganizationCellComponent,
        cells: {
          name: {
            dataComponent: ActiveLinkCellComponent,
          },
          unit: {
            dataComponent: UnitCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_GROUP_ASSIGN_USERS]: {
      cells: ['uid', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
        },
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
      },
    },

    [OrganizationTableType.USER_GROUP_USERS]: {
      cells: ['uid', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_GROUP_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_GROUP_ASSIGN_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
        },
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
      },
    },
  },
};
