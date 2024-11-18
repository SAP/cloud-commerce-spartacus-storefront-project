/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductAvailabilities } from '../../../model/product.model';
import { ProductAvailabilityAdapter } from './prduct-availability.adapter';

@Injectable({
  providedIn: 'root',
})
export class ProductAvailabilityConnector {
  constructor(protected adapter: ProductAvailabilityAdapter) {}

  getRealTimeStock(
    productCode: string,
    sapCode: string
  ): Observable<ProductAvailabilities> {
    return this.adapter.loadRealTimeStock(productCode, sapCode);
  }
}
