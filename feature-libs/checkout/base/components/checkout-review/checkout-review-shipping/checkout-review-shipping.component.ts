/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ActiveCartFacade,
  CartOutlets,
  DeliveryMode,
  OrderEntry,
} from '@spartacus/cart/base/root';
import {
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryModesFacade,
  CheckoutStepType,
} from '@spartacus/checkout/base/root';
import {
  Address,
  FeatureConfigService,
  TranslationService,
} from '@spartacus/core';
import { deliveryAddressCard, deliveryModeCard } from '@spartacus/order/root';
import { Card, ICON_TYPE } from '@spartacus/storefront';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { OutletDirective } from '@spartacus/storefront';
import { IconComponent } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';
import { CardComponent } from '@spartacus/storefront';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-checkout-review-shipping',
  templateUrl: './checkout-review-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    CardComponent,
    RouterLink,
    IconComponent,
    OutletDirective,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
    TranslatePipe,
  ],
})
export class CheckoutReviewShippingComponent {
  protected featureConfig = inject(FeatureConfigService);
  private showDeliveryOptionsTranslation = this.featureConfig.isEnabled(
    'showDeliveryOptionsTranslation'
  );

  readonly cartOutlets = CartOutlets;
  iconTypes = ICON_TYPE;

  deliveryAddressStepRoute = this.checkoutStepService.getCheckoutStepRoute(
    CheckoutStepType.DELIVERY_ADDRESS
  );
  deliveryModeStepRoute = this.checkoutStepService.getCheckoutStepRoute(
    CheckoutStepType.DELIVERY_MODE
  );

  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    protected translationService: TranslationService,
    protected checkoutStepService: CheckoutStepService
  ) {}

  entries$: Observable<OrderEntry[]> =
    this.activeCartFacade.getDeliveryEntries();

  deliveryAddress$: Observable<Address | undefined> =
    this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    );

  deliveryMode$: Observable<DeliveryMode | undefined> =
    this.checkoutDeliveryModesFacade.getSelectedDeliveryModeState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    );

  getDeliveryAddressCard(
    deliveryAddress: Address,
    countryName?: string
  ): Observable<Card> {
    return combineLatest([
      this.translationService.translate('addressCard.shipTo'),
      this.translationService.translate('addressCard.phoneNumber'),
      this.translationService.translate('addressCard.mobileNumber'),
    ]).pipe(
      map(([textTitle, textPhone, textMobile]) =>
        deliveryAddressCard(
          textTitle,
          textPhone,
          textMobile,
          deliveryAddress,
          countryName
        )
      )
    );
  }

  getDeliveryModeCard(deliveryMode: DeliveryMode): Observable<Card> {
    return combineLatest([
      this.translationService.translate(
        this.showDeliveryOptionsTranslation
          ? 'checkoutMode.deliveryOptions'
          : 'checkoutMode.deliveryMethod'
      ),
    ]).pipe(map(([textTitle]) => deliveryModeCard(textTitle, deliveryMode)));
  }
}
