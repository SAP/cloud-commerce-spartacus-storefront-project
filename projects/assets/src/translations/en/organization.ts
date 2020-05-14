export const organization = {
  budgetsList: {
    assign: 'Assign',
    code: 'Code',
    name: 'Name',
    amount: 'Amount',
    startEndDate: 'Start - End',
    costCenter: 'Cost center',
    parentUnit: 'Parent Unit',
    sortByMostRecent: 'sortByMostRecent',
    noBudgets: 'No budgets',
    budgetManagement: 'Budget Management',
    searchBox: 'Find budget',
    create: 'Create new budget',
    sorting: {
      byUnitName: 'Unit Name',
      byName: 'Name',
      byCode: 'Code',
      byValue: 'Value',
    },
  },
  budget: {
    details: 'Budget details',
    id: 'ID',
    name: 'Budget Name',
    amount: 'Amount',
    currency: 'Currency',
    startDate: 'Start date',
    endDate: 'End date',
    parentUnit: 'Parent Unit',
    sortByMostRecent: 'sortByMostRecent',
    noBudgets: 'No budgets',
    edit: 'Edit',
    disable: 'Disable',
    enable: 'Enable',
    status: 'Status',
    back: 'Back to list',
    active: 'Active',
    deactivated: 'Deactivated',
    costCenters: 'Cost Centers',
    confirmDeactivation: {
      title: 'Disable Budget',
      message: 'Are you sure you want to disable this budget?',
    },
  },
  budgetForm: {
    create: 'Create Budget',
    edit: 'Edit Budget',
    update: 'Update Budget',
    code: {
      label: 'Budget ID',
      placeholder: 'Code',
    },
    name: {
      label: 'Budget name',
      placeholder: 'Name',
    },
    businessUnits: {
      label: 'Parent business unit',
      placeholder: 'Select business unit',
    },
    startDate: 'Start date',
    endDate: 'End date',
    currency: 'Currency',
    amount: {
      label: 'Budget amount',
      placeholder: 'Amount',
    },
  },
  budgetCostCenters: {
    header: 'Cost centers of {{code}}',
    back: 'Back',
    code: 'Code',
    name: 'Name',
  },
  permissionsList: {
    code: 'Code',
    permissionManagement: 'Persmission Management',
    threshold: 'Threshold Value',
    type: 'Type',
    timePeriod: 'Time Period',
    parentUnit: 'Parent Unit',
    sortByMostRecent: 'sortByMostRecent',
    sorting: {
      byUnitName: 'Unit Name',
      byName: 'Name',
      byCode: 'Code',
      byValue: 'Value',
    },
    create: 'Create new Permission',
    assign: 'Assign',
  },
  permission: {
    details: 'Permission details',
    id: 'ID',
    name: 'Permission Name',
    currency: 'Currency',
    parentUnit: 'Parent Unit',
    edit: 'Edit',
    disable: 'Disable',
    enable: 'Enable',
    status: 'Status',
    back: 'Back to list',
    active: 'Active',
    deactivated: 'Deactivated',
    threshold: 'Threshold Amount',
    confirmDeactivation: {
      title: 'Disable Permission',
      message: 'Are you sure you want to disable this permission?',
    },
  },
  permissionForm: {
    create: 'Create Permission',
    edit: 'Edit Permission',
    update: 'Update Permission',
    code: {
      label: 'Permission ID',
      placeholder: 'Code',
    },
    businessUnits: {
      label: 'Parent business unit',
      placeholder: 'Select business unit',
    },
    periodRange: 'Period range',
    type: 'Type',
    currency: 'Currency',
    threshold: {
      label: 'Permission threshold',
      placeholder: 'Amount',
    },
  },
  costCentersList: {
    code: 'Code',
    costCenterManagement: 'Cost Center Management',
    name: 'Name',
    currency: 'Currency',
    parentUnit: 'Parent Unit',
    sortByMostRecent: 'sortByMostRecent',
    sorting: {
      byUnitName: 'Unit Name',
      byName: 'Name',
      byCode: 'Code',
    },
    create: 'Create new Cost Center',
  },
  costCenter: {
    code: 'Code',
    details: 'Cost Center Details',
    name: 'Name',
    currency: 'Currency',
    parentUnit: 'Parent Unit',
    edit: 'Edit',
    disable: 'Disable',
    enable: 'Enable',
    status: 'Status',
    back: 'Back to list',
    active: 'Active',
    deactivated: 'Deactivated',
    budgets: 'Budgets',
    assignBudgets: 'Manage Budgets',
    confirmDeactivation: {
      title: 'Disable Cost Center',
      message: 'Are you sure you want to disable this cost center?',
    },
  },
  costCenterBudgets: {
    header: 'Budgets in {{code}}',
    back: 'Close',
    assignBudgets: 'Manage Budgets',
  },
  costCenterAssignBudgets: {
    header: 'Manage budgets in {{code}}',
    back: 'Close',
  },
  costCenterForm: {
    create: 'Create Cost Center',
    edit: 'Edit Cost Center',
    update: 'Update Cost Center',
    code: {
      label: 'Cost Center ID',
      placeholder: 'Code',
    },
    name: {
      label: 'Cost Center name',
      placeholder: 'Name',
    },
    businessUnits: {
      label: 'Parent business unit',
      placeholder: 'Select business unit',
    },
    currency: 'Currency',
  },
  orgUnitsList: {
    orgUnitManagement: 'Organization Units Management',
    create: 'Create new Unit',
  },
  orgUnit: {
    details: 'Unit Details',
    uid: 'ID',
    name: 'Name',
    approvalProcess: 'Approval process',
    parentUnit: 'Parent Unit',
    edit: 'Edit',
    disable: 'Disable',
    enable: 'Enable',
    status: 'Status',
    back: 'Back to list',
    active: 'Active',
    deactivated: 'Deactivated',
    assignRoles: 'Manage Roles',
    assignApprovers: 'Manage Approvers',
    manageAddresses: 'Manage Addresses',
    confirmDeactivation: {
      title: 'Disable Unit',
      message: 'Are you sure you want to disable this unit?',
    },
    children: 'Child Units',
    costCenters: 'Cost Centers',
  },
  orgUnitForm: {
    create: 'Create Unit',
    edit: 'Edit Unit',
    update: 'Update Unit',
    uid: {
      label: 'Unit ID',
      placeholder: 'ID',
    },
    name: {
      label: 'Unit name',
      placeholder: 'Name',
    },
    parentOrgUnit: {
      label: 'Parent business unit',
      placeholder: 'Select business unit',
    },
    approvalProcess: {
      label: 'Approval process',
      placeholder: 'Select approval process',
    },
  },
  unitAssignRoles: {
    header: 'Manage roles in {{code}}',
    back: 'Close',
  },
  unitAssignApprovers: {
    header: 'Manage approvers in {{code}}',
    back: 'Close',
  },
  unitManageAddresses: {
    header: 'Manage addresses in {{code}}',
    create: 'Create new Address',
    back: 'Back to unit',
    id: 'ID',
    name: 'Name',
    formattedAddress: 'Details',
  },
  unitAddressDetails: {
    header: 'Addresses details',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    id: 'ID',
    name: 'Name',
    unit: 'Unit',
    details: 'Details',
  },
  unitAddressCreate: {
    header: 'Address create',
    create: 'Create',
  },
  unitAddressEdit: {
    header: 'Address edit',
    update: 'Update',
  },
  unitAddressForm: {
    title: 'Title',
    firstName: {
      label: 'First name',
      placeholder: 'First Name',
    },
    lastName: {
      label: 'Last name',
      placeholder: 'Last Name',
    },
    address1: 'Address 1',
    address2: 'Address 2 (optional)',
    country: 'Country',
    city: {
      label: 'City',
      placeholder: 'City',
    },
    state: 'State',
    zipCode: {
      label: 'Zip code',
      placeholder: 'Postal Code/Zip',
    },
    phoneNumber: {
      label: 'Phone number (optional)',
      placeholder: '(555) 555 - 0123',
    },
    saveAsDefault: 'Save as default',
    chooseAddress: 'Choose address',
    streetAddress: 'Street Address',
    aptSuite: 'Apt, Suite',
    selectOne: 'Select One...',
  },
  unitCostCenters: {
    header: 'Cost centers in {{code}}',
    back: 'Close',
    create: 'Create',
    code: 'Code',
    name: 'Name',
  },
  unitChildren: {
    header: 'Child units in {{code}}',
    back: 'Close',
    create: 'Create',
    id: 'ID',
    name: 'Name',
  },
  usersList: {
    sorting: {
      byName: 'Name',
      byUnitName: 'Unit Name',
    },
    uid: 'Email',
    name: 'Name',
    roles: 'Roles',
    assign: 'Assign',
    parentUnit: 'Unit',
    admin: 'Administrator',
    manager: 'Manager',
    approver: 'Approver',
    customer: 'Customer',
  },
  userGroupsList: {
    assign: 'Assign',
    id: 'ID',
    name: 'Name',
    noOfUsers: 'No. of Users',
    parentUnit: 'Parent Unit',
    noUserGroups: 'No user groups',
    userGroupManagement: 'User Group Management',
    searchBox: 'Find user group',
    create: 'Create new user group',
    sorting: {
      byUnitName: 'Unit Name',
      byName: 'Name',
      byGroupID: 'Group ID',
    },
  },
  userGroup: {
    details: 'User Group details',
    id: 'ID',
    name: 'User Group Name',
    parentUnit: 'Parent Unit',
    edit: 'Edit',
    back: 'Back to list',
    assignPermissions: 'Manage Permissions',
    assignUsers: 'Manage Users',
  },
  userGroupForm: {
    create: 'Create User Group',
    edit: 'Edit User Group',
    update: 'Update User Group',
    code: {
      label: 'User Group ID',
      placeholder: 'Code',
    },
    name: {
      label: 'User Group name',
      placeholder: 'Name',
    },
    businessUnits: {
      label: 'Parent business unit',
      placeholder: 'Select business unit',
    },
  },
  userGroupAssignPermissions: {
    header: 'Manage permissions in {{code}}',
    back: 'Close',
  },
  userGroupAssignUsers: {
    header: 'Manage users in {{code}}',
    back: 'Close',
    unassignAll: 'Unassign All',
  },
};
