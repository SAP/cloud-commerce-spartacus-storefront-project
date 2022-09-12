/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Converter, Occ } from '@commerce-storefront-toolset/core';
import { B2BUnitNode } from '@commerce-storefront-toolset/organization/administration/core';

@Injectable({
  providedIn: 'root',
})
export class OccOrgUnitNodeListNormalizer
  implements Converter<Occ.B2BUnitNodeList, B2BUnitNode[]>
{
  convert(source: Occ.B2BUnitNodeList, target?: B2BUnitNode[]): B2BUnitNode[] {
    if (target === undefined) {
      target = [...(source.unitNodes as any)];
    }
    return target;
  }
}
