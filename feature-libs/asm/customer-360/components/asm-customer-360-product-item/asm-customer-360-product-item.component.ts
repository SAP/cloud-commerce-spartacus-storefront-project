/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
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
import { Product } from '@spartacus/core';
import { ProductItem } from '../asm-customer-360-product-listing/product-item.model';
import { MediaComponent } from '../../../../../projects/storefrontlib/shared/components/media/media.component';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-asm-customer-360-product-item',
  templateUrl: './asm-customer-360-product-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaComponent, NgIf, TranslatePipe, MockTranslatePipe],
})
export class AsmCustomer360ProductItemComponent {
  @Input() product: ProductItem;
  @Input() quantity: number;
  @Input() isOrderEntry = true;
  @Output() selectProduct = new EventEmitter<Product>();
}
