/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="@types/applepayjs" />
import { Injectable, inject } from '@angular/core';
import { OpfPaymentErrorType } from '@spartacus/opf/payment/root';
import {
  ApplePayEvent,
  ApplePayObservableConfig,
  ApplePayShippingType,
} from '@spartacus/opf/quick-buy/root';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApplePaySessionFactory } from '../apple-pay-session/apple-pay-session.factory';

@Injectable({
  providedIn: 'root',
})
export class ApplePayObservableFactory {
  protected applePaySessionFactory = inject(ApplePaySessionFactory);

  initApplePayEventsHandler(config: ApplePayObservableConfig): Observable<any> {
    return new Observable<any>((observer) => {
      let session: ApplePaySession;
      try {
        session = this.applePaySessionFactory.startApplePaySession(
          config.request
        ) as ApplePaySession;
      } catch (err) {
        observer.error(err);
        return;
      }

      const handleUnspecifiedError = (error: any): void => {
        session.abort();
        observer.error(error);
      };

      session.addEventListener(
        ApplePayEvent.VALIDATE_MERCHANT,
        (event: Event) => {
          config
            .onValidateMerchant(<any>event)
            .pipe(take(1))
            .subscribe({
              next: (merchantSession) => {
                session.completeMerchantValidation(merchantSession);
              },
              error: handleUnspecifiedError,
            });
        }
      );

      session.addEventListener(ApplePayEvent.CANCEL, () => {
        observer.error({ type: OpfPaymentErrorType.PAYMENT_CANCELLED });
      });

      if (config.onPaymentMethodSelected) {
        session.addEventListener(
          ApplePayEvent.PAYMENT_METHOD_SELECTED,
          (event: Event) => {
            config
              .onPaymentMethodSelected(<any>event)
              .pipe(take(1))
              .subscribe({
                next: (paymentMethodUpdate) => {
                  session.completePaymentMethodSelection(paymentMethodUpdate);
                },
                error: handleUnspecifiedError,
              });
          }
        );
      }

      if (
        config.onShippingContactSelected &&
        !this.isShippingTypePickup(config)
      ) {
        session.addEventListener(
          ApplePayEvent.SHIPPING_CONTACT_SELECTED,
          (event: Event) => {
            config
              .onShippingContactSelected(<any>event)
              .pipe(take(1))
              .subscribe({
                next: (shippingContactUpdate) => {
                  session.completeShippingContactSelection(
                    shippingContactUpdate
                  );
                },
                error: handleUnspecifiedError,
              });
          }
        );
      }

      if (
        config.onShippingMethodSelected &&
        !this.isShippingTypePickup(config)
      ) {
        session.addEventListener(
          ApplePayEvent.SHIPPING_METHOD_SELECTED,
          (event: Event) => {
            config
              .onShippingMethodSelected(<any>event)
              .pipe(take(1))
              .subscribe({
                next: (shippingMethodUpdate) => {
                  session.completeShippingMethodSelection(shippingMethodUpdate);
                },
                error: handleUnspecifiedError,
              });
          }
        );
      }

      session.addEventListener(
        ApplePayEvent.PAYMENT_AUTHORIZED,
        (event: Event) => {
          config
            .onPaymentAuthorized(<any>event)
            .pipe(take(1))
            .subscribe({
              next: (authResult) => {
                session.completePayment(authResult);
                if (!authResult?.errors?.length) {
                  observer.next(authResult);
                  observer.complete();
                } else {
                  handleUnspecifiedError({
                    message: authResult?.errors[0]?.message,
                  });
                }
              },
              error: handleUnspecifiedError,
            });
        }
      );
      session.begin();
    });
  }

  protected isShippingTypePickup(config: any) {
    return config.request.shippingType === ApplePayShippingType.STORE_PICKUP;
  }
}
