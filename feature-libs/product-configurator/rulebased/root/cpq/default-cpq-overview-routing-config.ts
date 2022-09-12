/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoutingConfig } from '@commerce-storefront-toolset/core';

export const defaultCpqOverviewRoutingConfig: RoutingConfig = {
  routing: {
    routes: {
      configureOverviewCLOUDCPQCONFIGURATOR: {
        paths: [
          'configure-overview/cpq/:ownerType/entityKey/:entityKey/displayOnly/:displayOnly',
          'configure-overview/cpq/:ownerType/entityKey/:entityKey',
        ],
      },
    },
  },
};
