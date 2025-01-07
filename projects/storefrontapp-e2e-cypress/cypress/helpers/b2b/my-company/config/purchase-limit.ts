/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FULL_BASE_URL_EN_USD } from '../../../site-context-selector';
import { randomString } from '../../../user';
import { INPUT_TYPE, MyCompanyConfig, MY_COMPANY_FEATURE } from '../models';

export const purchaseLimitConfigs: MyCompanyConfig[] = [
  {
    name: 'Purchase Limit',
    baseUrl: `${FULL_BASE_URL_EN_USD}/organization/purchase-limits`,
    apiEndpoint: '/users/current/orderApprovalPermissions',
    objectType: 'orderApprovalPermissions',
    selectOptionsEndpoint: [
      '*orderApprovalPermissionTypes*',
      '*availableOrgUnitNodes*',
    ],
    verifyStatusInDetails: true,
    rows: [
      {
        label: 'Code',
        sortLabel: 'Name',
        variableName: 'uid',
        inputType: INPUT_TYPE.TEXT,
        createValue: `test-entity-${randomString()}`,
        updateValue: `edited-entity-${randomString()}`,
        formLabel: 'Code',
        showInTable: true,
        showInDetails: true,
        useInUrl: true,
      },
      {
        label: 'Status',
        variableName: 'uid',
        inputType: INPUT_TYPE.TEXT,
        createValue: 'Active',
        updateValue: 'Active',
        showInTable: true,
        showInDetails: true,
      },
      {
        label: 'Limit',
        variableName: 'threshold',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: `Budget Exceeded Permission`,
        showInTable: true,
        formLabel: 'Type',
        showInDetails: true,
        detailsLabel: 'Type',
      },
      {
        label: 'Parent Unit',
        variableName: 'orgUnit.name',
        link: `/organization/units/Custom%20Retail`,
        updatedLink: `/organization/units/Rustic%20Retail`,
        sortLabel: 'Unit',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: 'Custom Retail',
        updateValue: 'Rustic Retail',
        showInTable: true,
        formLabel: 'Parent Unit',
        showInDetails: true,
      },
    ],
    features: [
      MY_COMPANY_FEATURE.CREATE,
      MY_COMPANY_FEATURE.DISABLE,
      MY_COMPANY_FEATURE.UPDATE,
      MY_COMPANY_FEATURE.LIST,
      ,
    ],
    coreFeatures: [MY_COMPANY_FEATURE.CREATE, MY_COMPANY_FEATURE.DISABLE],
  },
  {
    name: 'Purchase Limit',
    nameSuffix: ' - Allowed Order Threshold (per order)',
    baseUrl: `${FULL_BASE_URL_EN_USD}/organization/purchase-limits`,
    apiEndpoint: '/users/current/orderApprovalPermissions',
    objectType: 'orderApprovalPermissions',
    selectOptionsEndpoint: ['*orderApprovalPermissionTypes*'],
    rows: [
      {
        label: 'Code',
        sortLabel: 'Name',
        variableName: 'uid',
        inputType: INPUT_TYPE.TEXT,
        createValue: `test-entity-${randomString()}`,
        updateValue: `edited-entity-${randomString()}`,
        formLabel: 'Code',
        showInTable: true,
        showInDetails: true,
        useInUrl: true,
      },
      {
        label: 'Status',
        variableName: 'uid',
        inputType: INPUT_TYPE.TEXT,
        createValue: 'Active',
        updateValue: 'Active',
        showInTable: true,
        showInDetails: true,
      },
      {
        label: 'Limit',
        variableName: 'threshold',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: `Allowed Order Threshold (per order)`,
        showInTable: false,
        formLabel: 'Type',
        showInDetails: true,
        detailsLabel: 'Type',
      },
      {
        label: 'Limit',
        variableName: 'currency',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: `US Dollar`,
        showInTable: false,
        formLabel: 'Currency',
        showInDetails: false,
      },
      {
        label: 'Threshold',
        variableName: 'threshold',
        inputType: INPUT_TYPE.TEXT,
        createValue: '10000',
        updateValue: '20000',
        showInTable: false,
        formLabel: 'Threshold',
        showInDetails: true,
        selector: '[formcontrolname=threshold]',
      },
      {
        label: 'Parent Unit',
        variableName: 'orgUnit.name',
        link: `/organization/units/Custom%20Retail`,
        updatedLink: `/organization/units/Rustic%20Retail`,
        sortLabel: 'Unit',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: 'Custom Retail',
        updateValue: 'Rustic Retail',
        showInTable: true,
        formLabel: 'Parent Unit',
        showInDetails: true,
      },
    ],
    features: [
      MY_COMPANY_FEATURE.CREATE,
      MY_COMPANY_FEATURE.DISABLE,
      MY_COMPANY_FEATURE.UPDATE,
    ],
    coreFeatures: [MY_COMPANY_FEATURE.CREATE, MY_COMPANY_FEATURE.DISABLE],
  },
  {
    name: 'Purchase Limit',
    nameSuffix: ' - Allowed Order Threshold (per timespan)',
    baseUrl: `${FULL_BASE_URL_EN_USD}/organization/purchase-limits`,
    apiEndpoint: '/users/current/orderApprovalPermissions',
    objectType: 'orderApprovalPermissions',
    selectOptionsEndpoint: ['*orderApprovalPermissionTypes*'],
    rows: [
      {
        label: 'Code',
        sortLabel: 'Name',
        variableName: 'uid',
        inputType: INPUT_TYPE.TEXT,
        createValue: `test-entity-${randomString()}`,
        updateValue: `edited-entity-${randomString()}`,
        formLabel: 'Code',
        showInTable: true,
        showInDetails: true,
        useInUrl: true,
      },
      {
        label: 'Status',
        variableName: 'uid',
        inputType: INPUT_TYPE.TEXT,
        createValue: 'Active',
        updateValue: 'Active',
        showInTable: true,
        showInDetails: true,
      },
      {
        label: 'Limit',
        variableName: 'threshold',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: `Allowed Order Threshold (per timespan)`,
        showInTable: false,
        formLabel: 'Type',
        showInDetails: true,
        detailsLabel: 'Type',
      },
      {
        label: 'Period',
        variableName: 'period',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: `MONTH`,
        updateValue: 'YEAR',
        showInTable: false,
        formLabel: 'Period',
        showInDetails: true,
      },
      {
        label: 'Limit',
        variableName: 'currency',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: `US Dollar`,
        showInTable: false,
        formLabel: 'Currency',
        showInDetails: false,
      },
      {
        label: 'Threshold',
        variableName: 'threshold',
        inputType: INPUT_TYPE.TEXT,
        createValue: '10000',
        updateValue: '20000',
        showInTable: false,
        formLabel: 'Threshold',
        showInDetails: true,
        selector: '[formcontrolname=threshold]',
      },
      {
        label: 'Parent Unit',
        variableName: 'orgUnit.name',
        link: `/organization/units/Custom%20Retail`,
        updatedLink: `/organization/units/Rustic%20Retail`,
        sortLabel: 'Unit',
        inputType: INPUT_TYPE.NG_SELECT,
        createValue: 'Custom Retail',
        updateValue: 'Rustic Retail',
        showInTable: true,
        formLabel: 'Parent Unit',
        showInDetails: true,
      },
    ],
    features: [
      MY_COMPANY_FEATURE.CREATE,
      MY_COMPANY_FEATURE.DISABLE,
      MY_COMPANY_FEATURE.UPDATE,
    ],
    coreFeatures: [MY_COMPANY_FEATURE.CREATE, MY_COMPANY_FEATURE.DISABLE],
  },
];
