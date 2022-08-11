/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutConfig } from '@spartacus/storefront';

export const defaultOrganizationLayoutConfig = {
  layoutSlots: {
    CompanyPageTemplate: {
      slots: ['BodyContent'],
    },
  },
} as LayoutConfig;
