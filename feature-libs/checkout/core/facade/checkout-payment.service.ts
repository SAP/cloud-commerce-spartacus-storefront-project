import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CheckoutPaymentFacade } from '@spartacus/checkout/root';
import {
  ActiveCartService,
  CardType,
  LanguageSetEvent,
  OCC_USER_ID_ANONYMOUS,
  PaymentDetails,
  ProcessSelectors,
  Query,
  QueryService,
  StateUtils,
  StateWithProcess,
  UserIdService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutPaymentConnector } from '../connectors';
import { CheckoutActions } from '../store/actions/index';
import {
  SET_PAYMENT_DETAILS_PROCESS_ID,
  StateWithCheckout,
} from '../store/checkout-state';
import { CheckoutSelectors } from '../store/selectors/index';

@Injectable()
export class CheckoutPaymentService implements CheckoutPaymentFacade {
  protected cardTypesQuery: Query<CardType[]> = this.query.create(
    () => this.checkoutPaymentConnector.getCardTypes(),
    {
      reloadOn: [LanguageSetEvent],
    }
  );

  constructor(
    protected checkoutStore: Store<StateWithCheckout>,
    protected processStateStore: Store<StateWithProcess<void>>,
    protected activeCartService: ActiveCartService,
    protected userIdService: UserIdService,
    protected query: QueryService,
    protected checkoutPaymentConnector: CheckoutPaymentConnector
  ) {}

  /**
   * Get card types
   */
  getCardTypes(): Observable<CardType[]> {
    return this.cardTypesQuery.get().pipe(map((cardTypes) => cardTypes ?? []));
  }

  /**
   * Get payment details
   */
  getPaymentDetails(): Observable<PaymentDetails> {
    return this.checkoutStore.pipe(select(CheckoutSelectors.getPaymentDetails));
  }

  /**
   * Get status about set Payment Details process
   */
  getSetPaymentDetailsResultProcess(): Observable<
    StateUtils.LoaderState<void>
  > {
    return this.processStateStore.pipe(
      select(
        ProcessSelectors.getProcessStateFactory(SET_PAYMENT_DETAILS_PROCESS_ID)
      )
    );
  }

  /**
   * Clear info about process of setting Payment Details
   */
  resetSetPaymentDetailsProcess(): void {
    this.checkoutStore.dispatch(
      new CheckoutActions.ResetSetPaymentDetailsProcess()
    );
  }

  /**
   * Create payment details using the given paymentDetails param
   * @param paymentDetails: the PaymentDetails to be created
   */
  createPaymentDetails(paymentDetails: PaymentDetails): void {
    if (this.actionAllowed()) {
      let userId;
      this.userIdService
        .getUserId()
        .subscribe((occUserId) => (userId = occUserId))
        .unsubscribe();

      let cartId;
      this.activeCartService
        .getActiveCartId()
        .subscribe((activeCartId) => (cartId = activeCartId))
        .unsubscribe();

      if (userId && cartId) {
        this.checkoutStore.dispatch(
          new CheckoutActions.CreatePaymentDetails({
            userId,
            cartId,
            paymentDetails,
          })
        );
      }
    }
  }

  /**
   * Set payment details
   * @param paymentDetails : the PaymentDetails to be set
   */
  setPaymentDetails(paymentDetails: PaymentDetails): void {
    if (this.actionAllowed()) {
      let userId: string | undefined;
      this.userIdService
        .getUserId()
        .subscribe((occUserId) => (userId = occUserId))
        .unsubscribe();

      let cartId: string | undefined;
      this.activeCartService
        .getActiveCartId()
        .subscribe((activeCartId) => (cartId = activeCartId))
        .unsubscribe();
      if (userId && cartId) {
        this.checkoutStore.dispatch(
          new CheckoutActions.SetPaymentDetails({
            userId,
            cartId,
            paymentDetails: paymentDetails,
          })
        );
      }
    }
  }

  /**
   * Sets payment loading to true without having the flicker issue (GH-3102)
   */
  paymentProcessSuccess() {
    this.checkoutStore.dispatch(new CheckoutActions.PaymentProcessSuccess());
  }

  protected actionAllowed(): boolean {
    let userId;
    this.userIdService
      .getUserId()
      .subscribe((occUserId) => (userId = occUserId))
      .unsubscribe();
    return (
      (userId && userId !== OCC_USER_ID_ANONYMOUS) ||
      this.activeCartService.isGuestCart()
    );
  }
}
