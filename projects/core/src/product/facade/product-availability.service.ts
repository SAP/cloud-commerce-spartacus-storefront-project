/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { Command, CommandService, CommandStrategy } from '../../../src/util/command-query';
import { Observable } from 'rxjs';
import { ProductAvailabilities } from '../../model/product.model';
import { ProductAvailabilityConnector } from '../connectors';

/**
 * The `ProductAvailabilityService` is responsible for fetching the latest real-time stock
 * information for products. Unlike the stock information provided by the `ProductService`,
 * which might be cached, this service ensures that you receive fresh data directly
 * from the backend.
 */

@Injectable({
  providedIn: 'root',
})
export class ProductAvailabilityService {
  protected connector = inject(ProductAvailabilityConnector);
  protected command = inject(CommandService);
  /**
   * Command to get real-time stock data for a product.
   */
  protected getRealTimeStockCommand: Command<
    { productCode: string; sapCode: string },
    ProductAvailabilities
  > = this.command.create(
    (payload) =>
      this.connector.getRealTimeStock(payload.productCode, payload.sapCode),
    {
      strategy: CommandStrategy.CancelPrevious,
    }
  );

  /**
   * Executes the command to fetch real-time stock data.
   *
   * @param productCode The product code for which to fetch stock data.
   * @param sapCode The SAP code associated with the product.
   * @returns An observable of `ProductAvailabilities`.
   */
  getRealTimeStock(
    productCode: string,
    sapCode: string
  ): Observable<ProductAvailabilities> {
    return this.getRealTimeStockCommand.execute({ productCode, sapCode });
  }
}
