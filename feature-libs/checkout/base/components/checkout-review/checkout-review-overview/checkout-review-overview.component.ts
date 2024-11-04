/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { FeatureConfigService, TranslationService } from '@spartacus/core';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'cx-checkout-review-overview',
  templateUrl: './checkout-review-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewOverviewComponent implements AfterViewInit {
  protected document = inject(DOCUMENT, { optional: true });
  protected translationService = inject(TranslationService, { optional: true });
  private featureService = inject(FeatureConfigService, { optional: true });

  constructor(protected activeCartFacade: ActiveCartFacade) {}

  ngAfterViewInit(): void {
    this.wrapComponentsWithSectionEl();
  }

  get cart$(): Observable<Cart> {
    return this.activeCartFacade.getActive();
  }

  /**
   * Wraps checkout review components with section element required
   * for applying correct a11y practices.
   */
  protected wrapComponentsWithSectionEl() {
    if (
      this.document &&
      this.translationService &&
      this.featureService?.isEnabled('a11yWrapReviewOrderInSection')
    ) {
      this.translationService
        .translate('checkoutReview.reviewOrder')
        .pipe(take(1))
        .subscribe((label) => {
          // We need to delay for a tick to let components render before querying.
          setTimeout(() => {
            // These are the components that we need to wrap.
            const els = [
              this.document.querySelector('cx-checkout-review-payment'),
              this.document.querySelector('cx-checkout-review-overview'),
              this.document.querySelector('cx-checkout-review-shipping'),
              this.document.querySelector('cx-pick-up-in-store-items-details'),
            ];
            const parent = els[0]?.parentNode;
            if (parent) {
              const section: any = this.document.createElement('section');
              section.ariaLabel = label;
              parent.replaceChild(section, els[0]);
              els.forEach((el: any) => section.appendChild(el));
            }
          });
        });
    }
  }
}
