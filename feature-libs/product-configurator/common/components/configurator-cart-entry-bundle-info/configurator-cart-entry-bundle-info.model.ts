/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * An interface representing the CPQ Line item from order entry.
 */
export interface LineItem {
  name?: string;
  formattedQuantity?: string;
  formattedPrice?: string;
}
