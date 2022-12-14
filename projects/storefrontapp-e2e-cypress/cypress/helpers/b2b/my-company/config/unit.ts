/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FULL_BASE_URL_EN_USD } from '../../../site-context-selector';
import { randomString } from '../../../user';
import { INPUT_TYPE, MyCompanyConfig, MY_COMPANY_FEATURE } from '../models';
import { costCenterConfig } from './cost-center.config';
import { userConfig } from './user';

export const unitShippingAddressConfig: MyCompanyConfig = {
  rows: [
    {
      inputType: INPUT_TYPE.NG_SELECT,
      createValue: `Cyprus`,
      updateValue: `Croatia`,
      formLabel: 'Country/Region',
    },
    {
      inputType: INPUT_TYPE.NG_SELECT,
      createValue: `Mr.`,
      updateValue: `Mrs.`,
      formLabel: 'Title',
    },
    {
      inputType: INPUT_TYPE.TEXT,
      createValue: `Jeff`,
      updateValue: `Fafa`,
      formLabel: 'First name',
    },
    {
      inputType: INPUT_TYPE.TEXT,
      createValue: `Maori`,
      updateValue: `Wapu`,
      formLabel: 'Last name',
    },
    {
      inputType: INPUT_TYPE.TEXT,
      createValue: `123 Uratiti`,
      updateValue: `456 Waiwhakamukau`,
      formLabel: 'Address',
      sortLabel: 'name',
    },
    {
      inputType: INPUT_TYPE.TEXT,
      createValue: `Mangawai`,
      updateValue: `Pukekoe`,
      formLabel: '2nd address',
    },
    {
      inputType: INPUT_TYPE.TEXT,
      createValue: `+54658632456`,
      updateValue: `+15463215496`,
      formLabel: 'Phone number',
    },
    {
      inputType: INPUT_TYPE.TEXT,
      createValue: `Taurunga`,
      updateValue: `Ranui`,
      formLabel: 'City',
    },
    {
      inputType: INPUT_TYPE.TEXT,
      createValue: `45632`,
      updateValue: `87645`,
      formLabel: 'Zip code',
    },
  ],
};

export const userRolesAndRightsConfig: MyCompanyConfig = {
  rows: [
    {
      formLabel: 'Roles',
      updateValue: 'Manager',
      inputType: INPUT_TYPE.CHECKBOX,
    },
    {
      formLabel: 'Rights',
      updateValue: 'View Unit-Level Orders',
      inputType: INPUT_TYPE.CHECKBOX,
    },
  ],
};

export const unitConfig: MyCompanyConfig = {
  name: 'Unit',
  baseUrl: `${FULL_BASE_URL_EN_USD}/organization/units`,
  apiEndpoint: '/orgUnits',
  objectType: 'children',
  verifyStatusInDetails: true,
  selectOptionsEndpoint: [
    '*availableOrgUnitNodes*',
    '*orgUnitsAvailableApprovalProcesses*',
  ],
  rows: [
    {
      label: 'Name',
      variableName: 'name',
      inputType: INPUT_TYPE.TEXT,
      createValue: `unit-${randomString()}`,
      updateValue: `edited-unit-${randomString()}`,
      showInTable: true,
      showInDetails: true,
      formLabel: 'Name',
      sortLabel: 'Name',
    },
    {
      label: 'Status',
      variableName: 'Active',
      inputType: INPUT_TYPE.TEXT,
      createValue: 'Active',
      updateValue: 'Active',
      showInTable: true,
      showInDetails: true,
    },
    {
      label: 'ID',
      variableName: 'id',
      inputType: INPUT_TYPE.TEXT,
      createValue: `unit-${randomString()}`,
      updateValue: `edited-unit-${randomString()}`,
      showInTable: true,
      showInDetails: true,
      useInUrl: true,
      formLabel: 'ID',
    },
    {
      label: 'Approval process',
      variableName: 'approval',
      inputType: INPUT_TYPE.NG_SELECT,
      createValue: ``,
      updateValue: `Escalation Approval with Merchant Check`,
      showInTable: false,
      showInDetails: false,
      useInUrl: false,
      formLabel: 'Approval process',
    },
    {
      label: 'Parent Unit',
      variableName: 'orgUnit.name',
      link: `/organization/units/Custom%20Retail`,
      updatedLink: `/organization/units/Rustic%20Retail`,
      inputType: INPUT_TYPE.NG_SELECT,
      createValue: 'Custom Retail',
      updateValue: 'Rustic Retail',
      showInTable: false,
      formLabel: 'Parent business unit',
      showInDetails: true,
    },
  ],
  subCategories: [
    {
      name: 'Child Units',
      baseUrl: `/children`,
      apiEndpoint: '**/orgUnitsRootNodeTree**',
      objectType: 'children',
      createConfig: {
        rows: [
          {
            label: 'Name',
            variableName: 'name',
            inputType: INPUT_TYPE.TEXT,
            createValue: `unit-${randomString()}`,
            updateValue: `edited-unit-${randomString()}`,
            showInTable: true,
            showInDetails: true,
            formLabel: 'Name',
            sortLabel: 'name',
          },
          {
            label: 'Status',
            variableName: 'Active',
            inputType: INPUT_TYPE.TEXT,
            createValue: 'Active',
            updateValue: 'Active',
            showInTable: true,
            showInDetails: true,
          },
          {
            label: 'ID',
            variableName: 'id',
            inputType: INPUT_TYPE.TEXT,
            createValue: `unit-${randomString()}`,
            updateValue: `edited-unit-${randomString()}`,
            showInTable: true,
            showInDetails: true,
            useInUrl: true,
            formLabel: 'ID',
          },
          {
            label: 'Approval process',
            variableName: 'approval',
            inputType: INPUT_TYPE.NG_SELECT,
            createValue: ``,
            updateValue: `Escalation Approval with Merchant Check`,
            showInTable: false,
            showInDetails: false,
            useInUrl: false,
            formLabel: 'Approval process',
          },
        ],
      },
    },
    {
      name: 'Users',
      baseUrl: `/users`,
      apiEndpoint: '**/availableOrgCustomers**',
      objectType: 'members',
      createConfig: userConfig,
      rolesAndRightsConfig: userRolesAndRightsConfig,
    },
    {
      name: 'Approvers',
      baseUrl: `/approvers`,
      apiEndpoint: '**/availableOrgCustomers**',
      objectType: 'members',
      manageAssignments: true,
    },
    {
      name: 'Delivery Addresses',
      baseUrl: `/addresses`,
      apiEndpoint: '**/availableOrgCustomers**',
      objectType: 'members',
      createConfig: unitShippingAddressConfig,
      editConfig: unitShippingAddressConfig,
      updateEntity: '123 Uratiti, Mangawai, Taurunga, 45632',
      deleteEntity: '456 Waiwhakamukau, Pukekoe, Ranui, 87645',
    },
    {
      name: 'Cost Centers',
      baseUrl: `/cost-centers`,
      apiEndpoint: '**/availableOrgCustomers**',
      objectType: 'members',
      createConfig: costCenterConfig,
    },
  ],
  features: [
    MY_COMPANY_FEATURE.CREATE,
    MY_COMPANY_FEATURE.DISABLE,
    MY_COMPANY_FEATURE.UPDATE,
    MY_COMPANY_FEATURE.NESTED_LIST,
    MY_COMPANY_FEATURE.ASSIGNMENTS,
  ],
  coreFeatures: [
    MY_COMPANY_FEATURE.CREATE,
    MY_COMPANY_FEATURE.DISABLE,
    MY_COMPANY_FEATURE.UPDATE,
    MY_COMPANY_FEATURE.NESTED_LIST,
  ],
};
