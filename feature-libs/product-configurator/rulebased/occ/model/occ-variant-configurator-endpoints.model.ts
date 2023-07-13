/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OccEndpoint } from '@spartacus/core';
declare module '@spartacus/core' {
  interface OccEndpoints {
    /**
     * Endpoint for reading a variant configuration attached to a given quote entry
     */
    readVariantConfigurationOverviewForQuoteEntry?: string | OccEndpoint;
  }
}
