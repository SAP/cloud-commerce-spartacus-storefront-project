/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { PickupDeliveryOptionDialogComponent } from './pickup-delivery-option-dialog.component';

export const defaultPickupOptionsDialogLayoutConfig: LayoutConfig = {
  launch: {
    PICKUP_IN_STORE: {
      inline: true,
      component: PickupDeliveryOptionDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
