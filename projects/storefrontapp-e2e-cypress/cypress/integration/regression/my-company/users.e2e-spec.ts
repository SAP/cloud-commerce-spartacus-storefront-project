import { CONTEXT_URL_EN_USD } from '../../../helpers/site-context-selector';
import { testMyCompanyFeatureFromConfig } from '../../../helpers/my-company/my-company';
import { MyCompanyConfig } from '../../../helpers/my-company/models/MyCompanyConfig';
import { randomString } from '../../../helpers/user';

const config: MyCompanyConfig = {
  name: 'User',
  baseUrl: `${CONTEXT_URL_EN_USD}/organization/users`,
  apiEndpoint: '/users/current/orgCustomers',
  objectType: 'users',
  entityIdField: 'customerId',
  rows: [
    {
      label: 'Name',
      variableName: 'name',
      link: '/organization/users/',
      inputType: 'text',
      createValue: `Test Entity ${randomString()}`,
      updateValue: `Edited Test Entity ${randomString()}`,
      sortLabel: 'name',
      showInTable: true,
      showInDetails: false,
    },
    {
      label: 'Status',
      variableName: 'nic',
      inputType: 'text',
      createValue: 'Active',
      updateValue: 'Active',
      showInTable: true,
      showInDetails: false,
    },
    {
      label: 'Email',
      variableName: 'email',
      inputType: 'text',
      createValue: `${randomString()}@testing.com`,
      updateValue: `edited-${randomString()}@testing.com`,
      showInTable: true,
      showInDetails: true,
      formLabel: 'Email',
    },
    {
      label: 'Roles',
      variableName: 'roles',
      // inputType: 'ngSelect',
      createValue: '-',
      updateValue: '-',
      showInTable: true,
      showInDetails: true,
    },
    {
      label: 'Unit',
      variableName: 'orgUnit.name',
      sortLabel: 'unit',
      inputType: 'ngSelect',
      createValue: 'Services West',
      updateValue: 'Rustic',
      showInTable: true,
      showInDetails: true,
      formLabel: 'Unit',
    },
    {
      label: 'Title',
      variableName: 'titleCode',
      formLabel: 'Title',
      inputType: 'ngSelect',
      createValue: 'Mr.',
      updateValue: 'Mrs.',
      showInTable: false,
    },

    {
      label: 'First name',
      variableName: 'firstName',
      formLabel: 'First name',
      inputType: 'text',
      createValue: `Test Entity Name ${randomString()}`,
      updateValue: `Edited Entity Name ${randomString()}`,
      showInDetails: false,
      showInTable: false,
      useInHeader: true,
    },
    {
      label: 'Last name',
      variableName: 'lastName',
      formLabel: 'Last name',
      inputType: 'text',
      createValue: `Test Entity Last Name ${randomString()}`,
      updateValue: `Edited Entity Last Name ${randomString()}`,
      showInDetails: false,
      showInTable: false,
      useInHeader: true,
    },
  ],
  subCategories: [
    {
      name: 'Approvers',
      baseUrl: `/approvers`,
      apiEndpoint: '**/approvers**',
      selector: 'approver',
      objectType: 'users',
      rows: [
        {
          label: 'Name',
          variableName: 'name',
          link: '/organization/user/',
        },
        {
          label: 'Email',
          sortByUrl: '?sort=byUid',
          variableName: 'uid',
        },
        {
          label: 'Roles',
          variableName: 'roles',
        },
        {
          label: 'Parent Unit',
          sortByUrl: '?sort=byGroupID',
          variableName: 'orgUnit.name',
          link: `/organization/units/`,
        },
      ],
    },
    {
      name: 'User groups',
      baseUrl: `/user-groups`,
      apiEndpoint: '**/orgUserGroups**',
      selector: 'user-group',
      objectType: 'orgUnitUserGroups',
      rows: [
        {
          label: 'Name',
          variableName: 'name',
          link: '/organization/user-groups/',
        },
        {
          label: 'Code',
          sortByUrl: '?sort=byUnitName',
          variableName: 'uid',
        },
        {
          label: 'Parent Unit',
          sortByUrl: '?sort=byGroupID',
          variableName: 'orgUnit.name',
          link: `/organization/units/`,
        },
      ],
    },
    {
      name: 'Purchase limits',
      baseUrl: `/purchase-limits`,
      apiEndpoint: '**/availableOrderApprovalPermissions**',
      selector: 'permission',
      objectType: 'orderApprovalPermissions',
      rows: [
        {
          label: 'Code',
          variableName: 'code',
          // link: '/organization/purchase-limit/',
          sortByUrl: '',
        },
        { label: 'Limit', variableName: 'orderApprovalPermissionType.name' },
        {
          label: 'Unit',
          variableName: 'orgUnit.name',
          link: `/organization/unit/`,
          sortByUrl: '?sort=byUnitName',
        },
      ],
    },
  ],
};

testMyCompanyFeatureFromConfig(config);
