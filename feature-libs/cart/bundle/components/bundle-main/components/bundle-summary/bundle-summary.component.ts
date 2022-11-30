/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EntryGroup } from '@spartacus/cart/base/root';
import { Product, RoutingService } from '@spartacus/core';

@Component({
  selector: 'cx-bundle-summary',
  templateUrl: './bundle-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BundleSummaryComponent {
  @Input() products: Product[];
  @Input() bundle: EntryGroup;
  @Input() showAddToCart: boolean;

  @Output() readonly addToCart = new EventEmitter<void>();

  constructor(protected routingService: RoutingService) {}

  onAddToCart(): void {
    this.addToCart.next();

    this.routingService.go('cart');
  }

  getTotalPrice(): number {
    return this.products
      ?.map((product: any) => product.basePrice.value)
      ?.reduce((partialSum, a) => partialSum + a, 0);
  }
}
