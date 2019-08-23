import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, shareReplay, tap } from 'rxjs/operators';
import {
  ANONYMOUS_USERID,
  CartDataService,
} from '../../cart/facade/cart-data.service';
import { Address, AddressValidation } from '../../model/address.model';
import { DeliveryMode } from '../../model/order.model';
import { CheckoutActions } from '../store/actions/index';
import {
  StateWithCheckout,
  SET_DELIVERY_ADDRESS_PROCESS_ID,
  SET_DELIVERY_MODE_PROCESS_ID,
} from '../store/checkout-state';
import { CheckoutSelectors } from '../store/selectors/index';
import { StateWithProcess } from '../../process/store/process-state';
import {
  getProcessSuccessFactory,
  getProcessErrorFactory,
  getProcessLoadingFactory,
} from '../../process/store/selectors/process-group.selectors';

@Injectable({
  providedIn: 'root',
})
export class CheckoutDeliveryService {
  constructor(
    protected store: Store<StateWithCheckout | StateWithProcess<void>>,
    protected cartData: CartDataService
  ) {}

  /**
   * Get supported delivery modes
   */
  getSupportedDeliveryModes(): Observable<DeliveryMode[]> {
    return this.store.pipe(
      select(CheckoutSelectors.getSupportedDeliveryModes),
      tap(deliveryModes => {
        if (deliveryModes && Object.keys(deliveryModes).length === 0) {
          this.loadSupportedDeliveryModes();
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  /**
   * Get selected delivery mode
   */
  getSelectedDeliveryMode(): Observable<DeliveryMode> {
    return this.store.pipe(select(CheckoutSelectors.getSelectedDeliveryMode));
  }

  /**
   * Get selected delivery mode code
   */
  getSelectedDeliveryModeCode(): Observable<string> {
    return this.store.pipe(
      select(CheckoutSelectors.getSelectedDeliveryModeCode)
    );
  }

  /**
   * Get delivery address
   */
  getDeliveryAddress(): Observable<Address> {
    return this.store.pipe(select(CheckoutSelectors.getDeliveryAddress));
  }

  /**
   * Get status about successfully set Delivery Address
   */
  getSetDeliveryAddressResultSuccess(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessSuccessFactory(SET_DELIVERY_ADDRESS_PROCESS_ID))
    );
  }

  /**
   * Get status about the failure of set Delivery Address process
   */
  getSetDeliveryAddressResultError(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessErrorFactory(SET_DELIVERY_ADDRESS_PROCESS_ID))
    );
  }

  /**
   * Get status about the processing of set Delivery Address
   */
  getSetDeliveryAddressResultLoading(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessLoadingFactory(SET_DELIVERY_ADDRESS_PROCESS_ID))
    );
  }

  /**
   * Clear info about process of setting Delivery Address
   */
  resetSetDeliveryAddressProcess(): void {
    this.store.dispatch(new CheckoutActions.ResetSetDeliveryAddressProcess());
  }

  /**
   * Get status about the failure of set Delivery Mode process
   */
  getSetDeliveryModeResultSuccess(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessSuccessFactory(SET_DELIVERY_MODE_PROCESS_ID))
    );
  }

  /**
   * Get status about the failure of set Delivery Mode process
   */
  getSetDeliveryModeResultError(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessErrorFactory(SET_DELIVERY_MODE_PROCESS_ID))
    );
  }

  /**
   * Clear info about process of setting Delivery Mode
   */
  getSetDeliveryModeResultLoading(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessLoadingFactory(SET_DELIVERY_MODE_PROCESS_ID))
    );
  }

  /**
   * Clear info about process of setting Delivery Mode
   */
  resetSetDeliveryModeProcess(): void {
    this.store.dispatch(new CheckoutActions.ResetSetDeliveryModeProcess());
  }

  /**
   * Get address verification results
   */
  getAddressVerificationResults(): Observable<AddressValidation | string> {
    return this.store.pipe(
      select(CheckoutSelectors.getAddressVerificationResults),
      filter(results => Object.keys(results).length !== 0)
    );
  }

  /**
   * Create and set a delivery address using the address param
   * @param address : the Address to be created and set
   */
  createAndSetAddress(address: Address): void {
    if (this.actionAllowed()) {
      this.store.dispatch(
        new CheckoutActions.AddDeliveryAddress({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          address: address,
        })
      );
    }
  }

  /**
   * Load supported delivery modes
   */
  loadSupportedDeliveryModes(): void {
    if (this.actionAllowed()) {
      this.store.dispatch(
        new CheckoutActions.LoadSupportedDeliveryModes({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
        })
      );
    }
  }

  /**
   * Set delivery mode
   * @param mode : The delivery mode to be set
   */
  setDeliveryMode(mode: string): void {
    if (this.actionAllowed()) {
      this.store.dispatch(
        new CheckoutActions.SetDeliveryMode({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          selectedModeId: mode,
        })
      );
    }
  }

  /**
   * Verifies the address
   * @param address : the address to be verified
   */
  verifyAddress(address: Address): void {
    if (this.actionAllowed()) {
      this.store.dispatch(
        new CheckoutActions.VerifyAddress({
          userId: this.cartData.userId,
          address,
        })
      );
    }
  }

  /**
   * Set delivery address
   * @param address : The address to be set
   */
  setDeliveryAddress(address: Address): void {
    if (this.actionAllowed()) {
      this.store.dispatch(
        new CheckoutActions.SetDeliveryAddress({
          userId: this.cartData.userId,
          cartId: this.cartData.cart.code,
          address: address,
        })
      );
    }
  }

  /**
   * Clear address verification results
   */
  clearAddressVerificationResults(): void {
    this.store.dispatch(new CheckoutActions.ClearAddressVerificationResults());
  }

  /**
   * Clear address already setup in last checkout process
   */
  clearCheckoutDeliveryAddress(): void {
    this.store.dispatch(
      new CheckoutActions.ClearCheckoutDeliveryAddress({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
      })
    );
  }

  /**
   * Clear delivery mode setup in last checkout process
   */
  clearCheckoutDeliveryMode(): void {
    this.store.dispatch(
      new CheckoutActions.ClearCheckoutDeliveryMode({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
      })
    );
  }

  /**
   * Clear address and delivery mode already setup in last checkout process
   */
  clearCheckoutDeliveryDetails(): void {
    this.clearCheckoutDeliveryAddress();
    this.clearCheckoutDeliveryMode();
  }

  protected actionAllowed(): boolean {
    return this.cartData.userId !== ANONYMOUS_USERID;
  }
}
