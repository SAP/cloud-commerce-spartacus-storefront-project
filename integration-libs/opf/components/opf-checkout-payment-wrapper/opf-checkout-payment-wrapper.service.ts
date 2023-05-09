/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { ActiveCartService } from '@spartacus/cart/base/core';
import {
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  UserIdService,
} from '@spartacus/core';
import { OpfResourceLoaderService } from '@spartacus/opf/core';
import {
  OpfCheckoutFacade,
  OpfOtpFacade,
  OpfPaymentMethodType,
  OpfRenderPaymentMethodEvent,
  PaymentSessionData,
} from '@spartacus/opf/root';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

@Injectable()
export class OpfCheckoutPaymentWrapperService {
  constructor(
    protected opfCheckoutService: OpfCheckoutFacade,
    protected opfOtpService: OpfOtpFacade,
    protected opfResourceLoaderService: OpfResourceLoaderService,
    protected userIdService: UserIdService,
    protected activeCartService: ActiveCartService,
    protected routingService: RoutingService,
    protected globalMessageService: GlobalMessageService
  ) {}

  protected activeCartId: string;

  protected renderPaymentMethodEvent$ =
    new BehaviorSubject<OpfRenderPaymentMethodEvent>({
      isLoading: false,
    });

  protected isInitPaymentFailed$ = new BehaviorSubject(false);

  getRenderPaymentMethodEvent(): Observable<OpfRenderPaymentMethodEvent> {
    return this.renderPaymentMethodEvent$.asObservable();
  }

  getIsInitPaymentFailed(): Observable<boolean> {
    return this.isInitPaymentFailed$.asObservable();
  }

  initiatePayment(
    paymentOptionId: number
  ): Observable<PaymentSessionData | boolean> {
    this.renderPaymentMethodEvent$.next({
      isLoading: true,
    });
    this.isInitPaymentFailed$.next(false);

    return combineLatest([
      this.userIdService.getUserId(),
      this.activeCartService.getActiveCartId(),
    ]).pipe(
      switchMap(([userId, cartId]) => {
        this.activeCartId = cartId;
        return this.opfOtpService.generateOtpKey(userId, cartId);
      }),
      filter((response) => Boolean(response?.value)),
      map(({ value: otpKey }) =>
        this.setPaymentInitiationConfig(otpKey, paymentOptionId)
      ),
      switchMap((params) => this.opfCheckoutService.initiatePayment(params)),
      catchError(() => this.onInitPaymentError())
    );
  }

  renderPaymentGateway(config: PaymentSessionData) {
    if (config?.destination) {
      this.renderPaymentMethodEvent$.next({
        isLoading: false,
        renderType: OpfPaymentMethodType.DESTINATION,
        data: config?.destination.url,
      });
    }

    if (config?.dynamicScript) {
      const html = config?.dynamicScript?.html;

      this.opfResourceLoaderService
        .loadProviderScripts(config.dynamicScript.jsUrls)
        .then(() => {
          this.renderPaymentMethodEvent$.next({
            isLoading: false,
            renderType: OpfPaymentMethodType.DYNAMIC_SCRIPT,
            data: html,
          });
          setTimeout(() => {
            this.opfResourceLoaderService.executeScriptFromHtml(html);
          });
        });
    }
  }

  protected onInitPaymentError(): Observable<boolean> {
    this.isInitPaymentFailed$.next(true);

    this.globalMessageService.add(
      {
        key: 'opf.checkout.errors.proceedPayment',
      },
      GlobalMessageType.MSG_TYPE_ERROR
    );

    return of(false);
  }

  protected setPaymentInitiationConfig(
    otpKey: string,
    paymentOptionId: number
  ) {
    return {
      otpKey,
      config: {
        configurationId: String(paymentOptionId),
        cartId: this.activeCartId,
        resultURL: this.routingService.getFullUrl({
          cxRoute: 'paymentVerificationResult',
        }),
        cancelURL: this.routingService.getFullUrl({
          cxRoute: 'paymentVerificationCancel',
        }),
      },
    };
  }
}
