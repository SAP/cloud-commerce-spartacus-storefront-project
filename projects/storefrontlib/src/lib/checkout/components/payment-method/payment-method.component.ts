import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  Address,
  CartDataService,
  CheckoutService,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  PaymentDetails,
  UserService,
  TranslationService,
  RoutingConfigService,
} from '@spartacus/core';

import { ActivatedRoute } from '@angular/router';
import { masterCardImgSrc } from '../../../ui/images/masterCard';
import { visaImgSrc } from '../../../ui/images/visa';
import { Card } from '../../../../shared/components/card/card.component';
import { CheckoutConfigService } from '../../checkout-config.service';

@Component({
  selector: 'cx-payment-method',
  templateUrl: './payment-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodComponent implements OnInit, OnDestroy {
  newPaymentFormManuallyOpened = false;
  existingPaymentMethods$: Observable<PaymentDetails[]>;
  isLoading$: Observable<boolean>;
  getPaymentDetailsSub: Subscription;
  getDeliveryAddressSub: Subscription;
  selectedPayment: PaymentDetails;
  deliveryAddress: Address;
  checkoutStepUrlNext: string;
  checkoutStepUrlPrevious: string;

  constructor(
    protected cartData: CartDataService,
    protected userService: UserService,
    protected checkoutService: CheckoutService,
    protected globalMessageService: GlobalMessageService,
    protected routingConfigService: RoutingConfigService,
    private routingService: RoutingService,
    private checkoutConfigService: CheckoutConfigService,
    private activatedRoute: ActivatedRoute,
    private translation: TranslationService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.userService.getPaymentMethodsLoading();
    this.userService.loadPaymentMethods(this.cartData.userId);

    this.checkoutStepUrlNext = this.checkoutConfigService.getNextCheckoutStepUrl(
      this.activatedRoute
    );
    this.checkoutStepUrlPrevious = this.checkoutConfigService.getPreviousCheckoutStepUrl(
      this.activatedRoute
    );

    this.existingPaymentMethods$ = this.userService.getPaymentMethods();
    this.getPaymentDetailsSub = this.checkoutService
      .getPaymentDetails()
      .pipe(
        filter(
          paymentInfo => paymentInfo && Object.keys(paymentInfo).length !== 0
        )
      )
      .subscribe(paymentInfo => {
        if (!paymentInfo['hasError']) {
          this.selectedPayment = paymentInfo;
        } else {
          Object.keys(paymentInfo).forEach(key => {
            if (key.startsWith('InvalidField')) {
              this.globalMessageService.add(
                {
                  key: 'paymentMethods.invalidField',
                  params: { field: paymentInfo[key] },
                },
                GlobalMessageType.MSG_TYPE_ERROR
              );
            }
          });
          this.checkoutService.clearCheckoutStep(3);
        }
      });
  }

  getCardContent(payment: PaymentDetails): Observable<Card> {
    return combineLatest([
      this.translation.translate('paymentCard.expires', {
        month: payment.expiryMonth,
        year: payment.expiryYear,
      }),
      this.translation.translate('paymentForm.useThisPayment'),
      this.translation.translate('paymentCard.defaultPaymentMethod'),
      this.translation.translate('paymentCard.selected'),
    ]).pipe(
      map(
        ([
          textExpires,
          textUseThisPayment,
          textDefaultPaymentMethod,
          textSelected,
        ]) => {
          let ccImage: string;
          if (payment.cardType.code === 'visa') {
            ccImage = visaImgSrc;
          } else if (payment.cardType.code === 'master') {
            ccImage = masterCardImgSrc;
          }
          const card: Card = {
            title: payment.defaultPayment ? textDefaultPaymentMethod : '',
            textBold: payment.accountHolderName,
            text: [payment.cardNumber, textExpires],
            img: ccImage,
            actions: [{ name: textUseThisPayment, event: 'send' }],
          };
          if (this.selectedPayment && this.selectedPayment.id === payment.id) {
            card.header = textSelected;
          }
          return card;
        }
      )
    );
  }

  paymentMethodSelected(paymentDetails: PaymentDetails) {
    this.selectedPayment = paymentDetails;
  }

  showNewPaymentForm(): void {
    this.newPaymentFormManuallyOpened = true;
  }

  hideNewPaymentForm(): void {
    this.newPaymentFormManuallyOpened = false;
  }

  next(): void {
    this.addPaymentInfo({
      payment: this.selectedPayment,
      newPayment: false,
    });
  }

  back(): void {
    this.routingService.go(this.checkoutStepUrlPrevious);
  }

  addNewPaymentMethod({
    paymentDetails,
    billingAddress,
  }: {
    paymentDetails: PaymentDetails;
    billingAddress: Address;
  }): void {
    this.getDeliveryAddressSub = this.checkoutService
      .getDeliveryAddress()
      .subscribe(address => {
        billingAddress = address;
      });
    this.addPaymentInfo({
      payment: paymentDetails,
      billingAddress,
      newPayment: true,
    });
  }

  addPaymentInfo({
    newPayment,
    payment,
    billingAddress,
  }: {
    newPayment: boolean;
    payment: PaymentDetails;
    billingAddress?: Address;
  }): void {
    payment.billingAddress = billingAddress
      ? billingAddress
      : this.deliveryAddress;

    if (newPayment) {
      this.checkoutService.createPaymentDetails(payment);
      this.checkoutService.clearCheckoutStep(3);
    }

    // if the selected payment is the same as the cart's one
    if (this.selectedPayment && this.selectedPayment.id === payment.id) {
      this.checkoutService.setPaymentDetails(payment);
      this.checkoutService.clearCheckoutStep(3);
    }

    this.getPaymentDetailsSub = this.checkoutService
      .getPaymentDetails()
      .subscribe(data => {
        if (data.accountHolderName && data.cardNumber) {
          this.routingService.go(this.checkoutStepUrlNext);

          return;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.getPaymentDetailsSub) {
      this.getPaymentDetailsSub.unsubscribe();
    }
    if (this.getDeliveryAddressSub) {
      this.getDeliveryAddressSub.unsubscribe();
    }
  }
}
