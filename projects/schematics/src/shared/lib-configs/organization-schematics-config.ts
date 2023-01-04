/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ORDER_FEATURE_NAME,
  ORGANIZATION_ACCOUNT_SUMMARY_FEATURE_NAME,
  ORGANIZATION_ADMINISTRATION_FEATURE_NAME,
  ORGANIZATION_ORDER_APPROVAL_FEATURE_NAME,
  SPARTACUS_ADMINISTRATION,
  SPARTACUS_ORGANIZATION,
  SPARTACUS_ORGANIZATION_ACCOUNT_SUMMARY,
  SPARTACUS_ORGANIZATION_ACCOUNT_SUMMARY_ASSETS,
  SPARTACUS_ORGANIZATION_ACCOUNT_SUMMARY_ROOT,
  SPARTACUS_ORGANIZATION_ADMINISTRATION_ASSETS,
  SPARTACUS_ORGANIZATION_ADMINISTRATION_ROOT,
  SPARTACUS_ORGANIZATION_ORDER_APPROVAL,
  SPARTACUS_ORGANIZATION_ORDER_APPROVAL_ASSETS,
  SPARTACUS_ORGANIZATION_ORDER_APPROVAL_ROOT,
  USER_PROFILE_FEATURE_NAME,
} from '../libs-constants';
import { SchematicConfig } from '../utils/lib-utils';

export const ORGANIZATION_FOLDER_NAME = 'organization';
export const ORGANIZATION_SCSS_FILE_NAME = 'organization.scss';

export const ADMINISTRATION_MODULE = 'AdministrationModule';
export const ADMINISTRATION_ROOT_MODULE = 'AdministrationRootModule';
export const ORGANIZATION_ADMINISTRATION_MODULE_NAME =
  'OrganizationAdministration';
export const ORGANIZATION_ADMINISTRATION_FEATURE_NAME_CONSTANT =
  'ORGANIZATION_ADMINISTRATION_FEATURE';
export const ORGANIZATION_TRANSLATIONS = 'organizationTranslations';
export const ORGANIZATION_TRANSLATION_CHUNKS_CONFIG =
  'organizationTranslationChunksConfig';

export const ORGANIZATION_ADMINISTRATION_SCHEMATICS_CONFIG: SchematicConfig = {
  library: {
    featureName: ORGANIZATION_ADMINISTRATION_FEATURE_NAME,
    mainScope: SPARTACUS_ORGANIZATION,
    featureScope: SPARTACUS_ADMINISTRATION,
    b2b: true,
  },
  folderName: ORGANIZATION_FOLDER_NAME,
  moduleName: ORGANIZATION_ADMINISTRATION_MODULE_NAME,
  featureModule: {
    name: ADMINISTRATION_MODULE,
    importPath: SPARTACUS_ADMINISTRATION,
  },
  rootModule: {
    name: ADMINISTRATION_ROOT_MODULE,
    importPath: SPARTACUS_ORGANIZATION_ADMINISTRATION_ROOT,
  },
  lazyLoadingChunk: {
    moduleSpecifier: SPARTACUS_ORGANIZATION_ADMINISTRATION_ROOT,
    namedImports: [ORGANIZATION_ADMINISTRATION_FEATURE_NAME_CONSTANT],
  },
  i18n: {
    resources: ORGANIZATION_TRANSLATIONS,
    chunks: ORGANIZATION_TRANSLATION_CHUNKS_CONFIG,
    importPath: SPARTACUS_ORGANIZATION_ADMINISTRATION_ASSETS,
  },
  styles: {
    scssFileName: ORGANIZATION_SCSS_FILE_NAME,
    importStyle: SPARTACUS_ORGANIZATION,
  },
  dependencyFeatures: [USER_PROFILE_FEATURE_NAME],
};

export const ORDER_APPROVAL_MODULE = 'OrderApprovalModule';
export const ORDER_APPROVAL_ROOT_MODULE = 'OrderApprovalRootModule';
export const ORGANIZATION_ORDER_APPROVAL_MODULE_NAME =
  'OrganizationOrderApproval';
export const ORGANIZATION_ORDER_APPROVAL_FEATURE_NAME_CONSTANT =
  'ORGANIZATION_ORDER_APPROVAL_FEATURE';
export const ORDER_APPROVAL_TRANSLATIONS = 'orderApprovalTranslations';
export const ORDER_APPROVAL_TRANSLATION_CHUNKS_CONFIG =
  'orderApprovalTranslationChunksConfig';

export const ORGANIZATION_ORDER_APPROVAL_SCHEMATICS_CONFIG: SchematicConfig = {
  library: {
    featureName: ORGANIZATION_ORDER_APPROVAL_FEATURE_NAME,
    mainScope: SPARTACUS_ORGANIZATION,
    featureScope: SPARTACUS_ORGANIZATION_ORDER_APPROVAL,
    b2b: true,
  },
  folderName: ORGANIZATION_FOLDER_NAME,
  moduleName: ORGANIZATION_ORDER_APPROVAL_MODULE_NAME,
  featureModule: {
    name: ORDER_APPROVAL_MODULE,
    importPath: SPARTACUS_ORGANIZATION_ORDER_APPROVAL,
  },
  rootModule: {
    name: ORDER_APPROVAL_ROOT_MODULE,
    importPath: SPARTACUS_ORGANIZATION_ORDER_APPROVAL_ROOT,
  },
  lazyLoadingChunk: {
    moduleSpecifier: SPARTACUS_ORGANIZATION_ORDER_APPROVAL_ROOT,
    namedImports: [ORGANIZATION_ORDER_APPROVAL_FEATURE_NAME_CONSTANT],
  },
  i18n: {
    resources: ORDER_APPROVAL_TRANSLATIONS,
    chunks: ORDER_APPROVAL_TRANSLATION_CHUNKS_CONFIG,
    importPath: SPARTACUS_ORGANIZATION_ORDER_APPROVAL_ASSETS,
  },
  styles: {
    scssFileName: ORGANIZATION_SCSS_FILE_NAME,
    importStyle: SPARTACUS_ORGANIZATION,
  },
  dependencyFeatures: [USER_PROFILE_FEATURE_NAME, ORDER_FEATURE_NAME],
};

export const ORGANIZATION_ACCOUNT_SUMMARY_MODULE_NAME =
  'organizationAccountSummary';
export const ACCOUNT_SUMMARY_MODULE = 'AccountSummaryModule';
export const ACCOUNT_SUMMARY_ROOT_MODULE = 'AccountSummaryRootModule';
export const ORGANIZATION_ACCOUNT_SUMMARY_FEATURE_NAME_CONSTANT =
  'ORGANIZATION_ACCOUNT_SUMMARY_FEATURE';
export const ACCOUNT_SUMMARY_TRANSLATIONS = 'accountSummaryTranslations';
export const ACCOUNT_SUMMARY_TRANSLATION_CHUNKS_CONFIG =
  'accountSummaryTranslationChunksConfig';

export const ORGANIZATION_ACCOUNT_SUMMARY_SCHEMATICS_CONFIG: SchematicConfig = {
  library: {
    featureName: ORGANIZATION_ACCOUNT_SUMMARY_FEATURE_NAME,
    mainScope: SPARTACUS_ORGANIZATION,
    featureScope: SPARTACUS_ORGANIZATION_ACCOUNT_SUMMARY,
    b2b: true,
  },
  folderName: ORGANIZATION_FOLDER_NAME,
  moduleName: ORGANIZATION_ACCOUNT_SUMMARY_MODULE_NAME,
  featureModule: {
    name: ACCOUNT_SUMMARY_MODULE,
    importPath: SPARTACUS_ORGANIZATION_ACCOUNT_SUMMARY,
  },
  rootModule: {
    name: ACCOUNT_SUMMARY_ROOT_MODULE,
    importPath: SPARTACUS_ORGANIZATION_ACCOUNT_SUMMARY_ROOT,
  },
  lazyLoadingChunk: {
    moduleSpecifier: SPARTACUS_ORGANIZATION_ACCOUNT_SUMMARY_ROOT,
    namedImports: [ORGANIZATION_ACCOUNT_SUMMARY_FEATURE_NAME_CONSTANT],
  },
  i18n: {
    resources: ACCOUNT_SUMMARY_TRANSLATIONS,
    chunks: ACCOUNT_SUMMARY_TRANSLATION_CHUNKS_CONFIG,
    importPath: SPARTACUS_ORGANIZATION_ACCOUNT_SUMMARY_ASSETS,
  },
  styles: {
    scssFileName: ORGANIZATION_SCSS_FILE_NAME,
    importStyle: SPARTACUS_ORGANIZATION,
  },
  dependencyFeatures: [ORGANIZATION_ADMINISTRATION_FEATURE_NAME],
};
