/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActiveCartFacade, PaymentType } from '@spartacus/cart/base/root';
import {
  CheckoutCostCenterFacade,
  CheckoutPaymentTypeFacade,
} from '@spartacus/checkout/b2b/root';
import {
  CheckoutReviewSubmitComponent,
  CheckoutStepService,
} from '@spartacus/checkout/base/components';
import {
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryModesFacade,
  CheckoutPaymentFacade,
  CheckoutStepType,
} from '@spartacus/checkout/base/root';
import {
  CostCenter,
  TranslationService,
  UserCostCenterService,
} from '@spartacus/core';
import { Card } from '@spartacus/storefront';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { PromotionsComponent } from '../../../../../projects/storefrontlib/cms-components/misc/promotions/promotions.component';
import { OutletDirective } from '../../../../../projects/storefrontlib/cms-structure/outlet/outlet.directive';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../../../projects/storefrontlib/shared/components/card/card.component';
import {
  NgIf,
  NgFor,
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
  AsyncPipe,
} from '@angular/common';

@Component({
  selector: 'cx-review-submit',
  templateUrl: './checkout-review-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgTemplateOutlet,
    CardComponent,
    RouterLink,
    IconComponent,
    OutletDirective,
    PromotionsComponent,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class B2BCheckoutReviewSubmitComponent extends CheckoutReviewSubmitComponent {
  checkoutStepTypePaymentType = CheckoutStepType.PAYMENT_TYPE;

  constructor(
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    protected checkoutPaymentFacade: CheckoutPaymentFacade,
    protected activeCartFacade: ActiveCartFacade,
    protected translationService: TranslationService,
    protected checkoutStepService: CheckoutStepService,
    protected checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    protected checkoutPaymentTypeFacade: CheckoutPaymentTypeFacade,
    protected checkoutCostCenterFacade: CheckoutCostCenterFacade,
    protected userCostCenterService: UserCostCenterService
  ) {
    super(
      checkoutDeliveryAddressFacade,
      checkoutPaymentFacade,
      activeCartFacade,
      translationService,
      checkoutStepService,
      checkoutDeliveryModesFacade
    );
  }

  get poNumber$(): Observable<string | undefined> {
    return this.checkoutPaymentTypeFacade.getPurchaseOrderNumberState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    );
  }

  get paymentType$(): Observable<PaymentType | undefined> {
    return this.checkoutPaymentTypeFacade.getSelectedPaymentTypeState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    );
  }

  get isAccountPayment$(): Observable<boolean> {
    return this.checkoutPaymentTypeFacade.isAccountPayment();
  }

  get costCenter$(): Observable<CostCenter | undefined> {
    return this.checkoutCostCenterFacade.getCostCenterState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    );
  }

  protected getCheckoutPaymentSteps(): Array<CheckoutStepType | string> {
    return [
      CheckoutStepType.PAYMENT_DETAILS,
      CheckoutStepType.PAYMENT_TYPE,
      CheckoutStepType.DELIVERY_ADDRESS,
    ];
  }

  getCostCenterCard(costCenter?: CostCenter): Observable<Card> {
    return combineLatest([
      this.translationService.translate('checkoutB2B.costCenter'),
    ]).pipe(
      map(([textTitle]) => {
        return {
          title: textTitle,
          textBold: costCenter?.name,
          text: ['(' + costCenter?.unit?.name + ')'],
        };
      })
    );
  }

  getPoNumberCard(poNumber?: string | null): Observable<Card> {
    return combineLatest([
      this.translationService.translate('checkoutB2B.review.poNumber'),
      this.translationService.translate('checkoutB2B.noPoNumber'),
    ]).pipe(
      map(([textTitle, noneTextTitle]) => {
        return {
          title: textTitle,
          textBold: poNumber ? poNumber : noneTextTitle,
        };
      })
    );
  }

  getPaymentTypeCard(paymentType: PaymentType): Observable<Card> {
    return combineLatest([
      this.translationService.translate('checkoutB2B.progress.methodOfPayment'),
      this.translationService.translate(
        'paymentTypes.paymentType_' + paymentType.code
      ),
    ]).pipe(
      map(([textTitle, paymentTypeTranslation]) => {
        return {
          title: textTitle,
          textBold: paymentTypeTranslation,
        };
      })
    );
  }
}
