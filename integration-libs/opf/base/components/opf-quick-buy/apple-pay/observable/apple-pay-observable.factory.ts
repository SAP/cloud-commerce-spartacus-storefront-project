/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApplePaySessionFactory } from '../apple-pay-session/apple-pay-session.factory';
import { ApplePayObservableConfig } from './apple-pay-observable-config.interface';

@Injectable()
export class ApplePayObservableFactory {
  protected applePaySessionFactory = inject(ApplePaySessionFactory);

  initApplePayEventsHandler(
    config: ApplePayObservableConfig
  ): Observable<ApplePayJS.ApplePayPaymentAuthorizationResult> {
    return new Observable<ApplePayJS.ApplePayPaymentAuthorizationResult>(
      (observer) => {
        let session: ApplePaySession;
        try {
          session = this.applePaySessionFactory.startApplePaySession(
            3,
            config.request
          ) as ApplePaySession;
        } catch (err) {
          observer.error(err);
          return;
        }

        const handleUnspecifiedError = (error: string): void => {
          session.abort();
          observer.error(error);
        };

        session.addEventListener('validatemerchant', (event: Event) => {
          config
            .validateMerchant(<any>event)
            .pipe(take(1))
            .subscribe((merchantSession) => {
              session.completeMerchantValidation(merchantSession);
            }, handleUnspecifiedError);
        });

        session.addEventListener('cancel', () => {
          observer.error('Canceled payment');
        });

        if (config.paymentMethodSelected) {
          session.addEventListener('paymentmethodselected', (event: Event) => {
            config
              .paymentMethodSelected(<any>event)
              .pipe(take(1))
              .subscribe((paymentMethodUpdate) => {
                session.completePaymentMethodSelection(paymentMethodUpdate);
              }, handleUnspecifiedError);
          });
        }

        if (config.shippingContactSelected) {
          session.addEventListener(
            'shippingcontactselected',
            (event: Event) => {
              config
                .shippingContactSelected(<any>event)
                .pipe(take(1))
                .subscribe((shippingContactUpdate) => {
                  session.completeShippingContactSelection(
                    shippingContactUpdate
                  );
                }, handleUnspecifiedError);
            }
          );
        }

        if (config.shippingMethodSelected) {
          session.addEventListener('shippingmethodselected', (event: Event) => {
            config
              .shippingMethodSelected(<any>event)
              .pipe(take(1))
              .subscribe((shippingMethodUpdate) => {
                session.completeShippingMethodSelection(shippingMethodUpdate);
              }, handleUnspecifiedError);
          });
        }

        session.addEventListener('paymentauthorized', (event: Event) => {
          config
            .paymentAuthorized(<any>event)
            .pipe(take(1))
            .subscribe({
              next: (authResult) => {
                session.completePayment(authResult);
                if (!authResult?.errors?.length) {
                  observer.next(authResult);
                  observer.complete();
                } else {
                  handleUnspecifiedError(authResult?.errors[0]?.message);
                }
              },
              error: handleUnspecifiedError,
            });
        });
        session.begin();
      }
    );
  }
}
