/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import '@spartacus/storefront';
import { Comment } from './quote.model';

declare module '@spartacus/cart/base/root' {
  interface OrderEntry {
    comments?: Comment[];
  }
}

declare module '@spartacus/storefront' {
  const enum LAUNCH_CALLER {
    REQUEST_QUOTE = 'REQUEST_QUOTE',
    ACTION_CONFIRMATION = 'ACTION_CONFIRMATION',
  }
}
