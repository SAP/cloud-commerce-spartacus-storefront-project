import { Injectable } from '@angular/core';
import {
  Address,
  DeliveryMode,
  facadeFactory,
  StateUtils,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { CHECKOUT_CORE_FEATURE } from '../feature-name';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: CheckoutDeliveryFacade,
      feature: CHECKOUT_CORE_FEATURE,
      methods: [
        'getSupportedDeliveryModes',
        'getSelectedDeliveryMode',
        'getSelectedDeliveryModeCode',
        'getDeliveryAddress',
        'getSetDeliveryAddressProcess',
        'resetSetDeliveryAddressProcess',
        'getSetDeliveryModeProcess',
        'resetSetDeliveryModeProcess',
        'resetLoadSupportedDeliveryModesProcess',
        'getLoadSupportedDeliveryModeProcess',
        'clearCheckoutDeliveryModes',
        'createAndSetAddress',
        'loadSupportedDeliveryModes',
        'setDeliveryMode',
        'setDeliveryAddress',
        'clearCheckoutDeliveryAddress',
        'clearCheckoutDeliveryMode',
        'clearCheckoutDeliveryDetails',
      ],
      async: true,
    }),
})
export abstract class CheckoutDeliveryFacade {
  /**
   * Get supported delivery modes
   */
  abstract getSupportedDeliveryModes(): Observable<DeliveryMode[]>;

  /**
   * Get selected delivery mode
   */
  abstract getSelectedDeliveryMode(): Observable<
    DeliveryMode | undefined | null
  >;

  /**
   * Get selected delivery mode code
   */
  abstract getSelectedDeliveryModeCode(): Observable<string>;

  /**
   * Get delivery address
   */
  abstract getDeliveryAddress(): Observable<Address>;

  // TODO:#13888 Remove during removal of process for set delivery address
  /**
   * Get status about successfully set Delivery Address
   *
   * @deprecated since 4.3.0. Use return value of setDeliveryAddress method to know if the action was successful or failed.
   */
  abstract getSetDeliveryAddressProcess(): Observable<
    StateUtils.LoaderState<void>
  >;

  // TODO:#13888 Remove during removal of process for set delivery address
  /**
   * Clear info about process of setting Delivery Address
   *
   * @deprecated since 4.3.0. Instead of the process use the return value of setDeliveryAddress method to observe it's status.
   */
  abstract resetSetDeliveryAddressProcess(): void;

  /**
   * Get status about of set Delivery Mode process
   */
  abstract getSetDeliveryModeProcess(): Observable<
    StateUtils.LoaderState<void>
  >;

  /**
   * Clear info about process of setting Delivery Mode
   */
  abstract resetSetDeliveryModeProcess(): void;

  /**
   * Clear info about process of setting Supported Delivery Modes
   */
  abstract resetLoadSupportedDeliveryModesProcess(): void;

  /**
   * Get status about of set supported Delivery Modes process
   */
  abstract getLoadSupportedDeliveryModeProcess(): Observable<
    StateUtils.LoaderState<void>
  >;

  /**
   * Clear supported delivery modes loaded in last checkout process
   */
  abstract clearCheckoutDeliveryModes(): void;

  /**
   * Create and set a delivery address using the address param
   * @param address : the Address to be created and set
   */
  abstract createAndSetAddress(address: Address): Observable<unknown>;

  /**
   * Load supported delivery modes
   */
  abstract loadSupportedDeliveryModes(): void;

  /**
   * Set delivery mode
   * @param mode : The delivery mode to be set
   */
  abstract setDeliveryMode(mode: string): void;

  /**
   * Set delivery address
   * @param address : The address to be set
   */
  abstract setDeliveryAddress(address: Address): Observable<unknown>;

  /**
   * Clear address already setup in last checkout process
   */
  abstract clearCheckoutDeliveryAddress(): void;

  /**
   * Clear selected delivery mode setup in last checkout process
   */
  abstract clearCheckoutDeliveryMode(): void;

  /**
   * Clear address and delivery mode already setup in last checkout process
   */
  abstract clearCheckoutDeliveryDetails(): void;
}
