/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// We need this import for augmentation of OccEndpoints to pick up
import { CartOccEndpoints } from '@commerce-storefront-toolset/cart/base/occ';
import { OccConfig } from '@commerce-storefront-toolset/core';
import { OrderOccEndpoints } from '@commerce-storefront-toolset/order/occ';
import { UserAccountOccEndpoints } from '@commerce-storefront-toolset/user/account/occ';
import { UserProfileOccEndpoints } from '@commerce-storefront-toolset/user/profile/occ';

// While it is not strictly required to define checkout endpoints in a separate `UserAccountOccEndpoints`
// variable, type augmentation does require that this file imports `UserAccountOccEndpoints`.
// A good way to make sure the `UserAccountOccEndpoints` import is not removed by mistake is to use
// `UserAccountOccEndpoints` in the code.
const defaultB2bUserAccountOccEndpoints: UserAccountOccEndpoints = {
  user: 'orgUsers/${userId}',
};

const defaultB2bUserProfileOccEndpoints: UserProfileOccEndpoints = {
  userUpdateProfile: 'users/${userId}',
  userCloseAccount: 'users/${userId}',
};

const defaultB2bCartOccEndpoints: CartOccEndpoints = {
  addEntries: 'orgUsers/${userId}/carts/${cartId}/entries?quantity=${quantity}',
};

const defaultB2bOrderOccEndpoints: OrderOccEndpoints = {
  placeOrder: 'orgUsers/${userId}/orders?fields=FULL',
  scheduleReplenishmentOrder:
    'orgUsers/${userId}/replenishmentOrders?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType',
};

export const defaultB2bOccConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        ...defaultB2bUserAccountOccEndpoints,
        ...defaultB2bUserProfileOccEndpoints,
        ...defaultB2bCartOccEndpoints,
        ...defaultB2bOrderOccEndpoints,
      },
    },
  },
};
