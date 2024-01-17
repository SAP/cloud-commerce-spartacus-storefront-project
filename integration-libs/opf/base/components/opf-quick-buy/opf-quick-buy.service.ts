/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { CheckoutConfig } from '@spartacus/checkout/base/root';
import { AuthService, BaseSiteService, CmsService } from '@spartacus/core';
import {
  ActiveConfiguration,
  CmsPageLocation,
  OpfConfig,
  OpfPaymentFacade,
  OpfPaymentProviderType,
  OpfProviderType,
} from '@spartacus/opf/base/root';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OpfQuickBuyService {
  protected opfPaymentFacade = inject(OpfPaymentFacade);
  protected checkoutConfig = inject(CheckoutConfig);
  protected baseSiteService = inject(BaseSiteService);
  protected authService = inject(AuthService);
  protected cmsService = inject(CmsService);
  protected opfConfig = inject(OpfConfig);

  getPaymentGatewayConfiguration(): Observable<ActiveConfiguration> {
    return this.opfPaymentFacade
      .getActiveConfigurationsState()
      .pipe(
        map(
          (config) =>
            (config?.data || []).filter(
              (item) =>
                item?.providerType === OpfPaymentProviderType.PAYMENT_GATEWAY
            )[0]
        )
      );
  }

  isQuickBuyProviderEnabled(
    provider: OpfProviderType,
    activeConfiguration: ActiveConfiguration
  ): boolean {
    let isEnabled = false;
    if (activeConfiguration && activeConfiguration.digitalWalletQuickBuy) {
      isEnabled = Boolean(
        activeConfiguration?.digitalWalletQuickBuy.find(
          (item) => item.provider === provider
        )?.enabled
      );
    }

    return isEnabled;
  }

  isUserGuestOrLoggedIn(): Observable<boolean> {
    return this.baseSiteService.get().pipe(
      take(1),
      map((baseSite) => baseSite?.baseStore?.paymentProvider),
      switchMap((paymentProviderName) => {
        return paymentProviderName &&
          this.checkoutConfig.checkout?.flows?.[paymentProviderName]?.guest
          ? of(true)
          : this.authService.isUserLoggedIn();
      })
    );
  }

  getCurrentPageIfEnabled(): Observable<CmsPageLocation | undefined> {
    return this.cmsService.getCurrentPage().pipe(
      take(1),
      map((page) => {
        console.log('page', page);
        console.log('quickBuyPageIds', this.opfConfig.opf?.quickBuyPageIds);
        //return true;
        return !!page?.pageId &&
          this.opfConfig.opf?.quickBuyPageIds?.includes(page.pageId)
          ? (page.pageId as CmsPageLocation)
          : undefined;
      })
    );
  }
}
