/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Customer360Activity } from '@spartacus/asm/customer-360/root';

export interface ActivityEntry extends Customer360Activity {
  typeLabel?: string;
  statusLabel?: string;
}

export enum TypeCodes {
  SavedCart = 'SAVED CART',
  Cart = 'CART',
  Ticket = 'TICKET',
  Order = 'ORDER'
}
