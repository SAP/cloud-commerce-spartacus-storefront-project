import { INPUT_TYPE } from '../../../helpers/b2b/my-company/models';
import { MyCompanyConfig } from '../../../helpers/b2b/my-company/models/my-company.config';
import { testMyCompanyFeatureFromConfig } from '../../../helpers/b2b/my-company/my-company.utils';
import { FULL_BASE_URL_EN_USD } from '../../../helpers/site-context-selector';
import { randomString } from '../../../helpers/user';

const config: MyCompanyConfig = {
  name: 'Unit',
  baseUrl: `${FULL_BASE_URL_EN_USD}/organization/units`,
  apiEndpoint: '/orgUnitsRootNodeTree',
  objectType: 'children',
  nestedTableRows: true,
  rows: [
    {
      label: 'Name',
      variableName: 'name',
      link: '/organization/user/',
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
      link: `/organization/units/`,
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
      link: `/organization/units/`,
      inputType: INPUT_TYPE.NG_SELECT,
      createValue: 'Rustic Services',
      updateValue: 'Rustic Retail',
      showInTable: false,
      formLabel: 'Parent business unit',
      showInDetails: true,
    },
  ],
};

testMyCompanyFeatureFromConfig(config);
