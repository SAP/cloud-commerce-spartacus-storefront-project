/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsmCustomer360ProductInterestList } from '@spartacus/asm/customer-360/root';
import { Product, ProductScope, ProductService } from '@spartacus/core';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, filter, take } from 'rxjs/operators';

import { AsmCustomer360SectionContext } from '../asm-customer-360-section-context.model';
import { NgIf, AsyncPipe } from '@angular/common';
import { AsmCustomer360ProductListingComponent } from '../../asm-customer-360-product-listing/asm-customer-360-product-listing.component';
import { TranslatePipe } from '@spartacus/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cx-asm-customer-360-product-interests',
  templateUrl: './asm-customer-360-product-interests.component.html',
  imports: [
    NgIf,
    AsmCustomer360ProductListingComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class AsmCustomer360ProductInterestsComponent {
  products$: Observable<Array<Product>>;

  constructor(
    public sectionContext: AsmCustomer360SectionContext<AsmCustomer360ProductInterestList>,
    protected productService: ProductService
  ) {
    this.products$ = this.sectionContext.data$.pipe(
      concatMap((interestList) => {
        if (!interestList?.customerProductInterests?.length) {
          return of([]);
        } else {
          return forkJoin(
            interestList.customerProductInterests.map((interest) => {
              return this.productService
                .get(interest.product.code, ProductScope.DETAILS)
                .pipe(
                  filter((product): product is Product => Boolean(product)),
                  take(1)
                ) as Product;
            })
          );
        }
      })
    );
  }
}
