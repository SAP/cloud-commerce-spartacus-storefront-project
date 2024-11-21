/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckoutDeliveryModeComponent } from '@spartacus/checkout/base/components';
import {
  CheckoutServiceDetailsFacade,
  S4ServiceDeliveryModeConfig,
} from '@spartacus/s4-service/root';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@spartacus/core';
import { InnerComponentsHostDirective } from '@spartacus/storefront';
import { SpinnerComponent } from '@spartacus/storefront';
import { OutletDirective } from '@spartacus/storefront';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgTemplateOutlet, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '@spartacus/core';

@Component({
  selector: 'cx-delivery-mode',
  templateUrl: './service-checkout-delivery-mode.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FeatureDirective,
    NgTemplateOutlet,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    OutletDirective,
    SpinnerComponent,
    InnerComponentsHostDirective,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class ServiceCheckoutDeliveryModeComponent extends CheckoutDeliveryModeComponent {
  protected checkoutServiceDetailsFacade = inject(CheckoutServiceDetailsFacade);
  protected config = inject(S4ServiceDeliveryModeConfig);

  hasServiceProducts$: Observable<boolean> =
    this.checkoutServiceDetailsFacade.hasServiceItems();

  serviceDeliveryConfig = this.config.s4ServiceDeliveryMode;
}
