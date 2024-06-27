/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { DirectionMode, DirectionService } from '@spartacus/storefront';

@Injectable({ providedIn: 'root' })
export class ConfiguratorPriceService {
  protected directionService = inject(DirectionService);

  protected isRTLDirection(): boolean {
    return this.directionService.getDirection() === DirectionMode.RTL;
  }

  removeSign(value: string | undefined, sign: string): string {
    if (value) {
      return value.replace(sign, '');
    }
    return '';
  }

  addSign(value: string | undefined, sign: string): string {
    if (value) {
      return this.isRTLDirection() ? value + sign : sign + value;
    }
    return '';
  }

  compileFormattedValue(
    priceValue: number,
    formattedValue: string | undefined
  ): string {
    if (priceValue > 0) {
      return this.addSign(formattedValue, '+');
    } else {
      if (this.isRTLDirection()) {
        const withoutSign = this.removeSign(formattedValue, '-');
        return this.addSign(withoutSign, '-');
      }
      return formattedValue ?? '';
    }
  }
}
