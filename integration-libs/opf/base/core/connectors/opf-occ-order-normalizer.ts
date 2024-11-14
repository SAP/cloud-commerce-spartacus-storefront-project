/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { OccOrderNormalizer } from '@spartacus/order/occ';
import { Order } from '@spartacus/order/root';
import { OpfOrder } from '../../root/model';

@Injectable({ providedIn: 'root' })
export class OpfOccOrderNormalizer
  extends OccOrderNormalizer
  implements Converter<OpfOrder, Order>
{
  convert(source: OpfOrder, target?: Order): Order {
    const result = super.convert(source, target);

    if (source.sapBillingAddress) {
      result.paymentInfo = {
        ...result.paymentInfo,
        billingAddress: source.sapBillingAddress,
      };
    }

    return result;
  }
}
