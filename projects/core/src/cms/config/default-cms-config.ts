/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CmsConfig } from './cms-config';

export const defaultCmsModuleConfig: CmsConfig = {
  backend: {
    occ: {
      endpoints: {
        component: 'users/${userId}/cms/components/${id}',
        components: 'users/${userId}/cms/components',
        pages: 'users/${userId}/cms/pages',
        page: 'users/${userId}/cms/pages/${id}',
      },
    },
  },
  cmsComponents: {},
  componentsLoading: {
    pageSize: 50,
  },
};
