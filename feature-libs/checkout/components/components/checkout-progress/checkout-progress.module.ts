import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { defaultCheckoutConfig } from '@spartacus/checkout/root';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { CartNotEmptyGuard } from '@spartacus/storefront';
import { CheckoutAuthGuard } from '../../guards/checkout-auth.guard';
import { CheckoutStepsSetGuard } from '../../guards/checkout-steps-set.guard';
import { CheckoutProgressComponent } from './checkout-progress.component';
import { MultiLinePipe } from './multiline-titles.pipe';

@NgModule({
  imports: [CommonModule, UrlModule, I18nModule, RouterModule],
  declarations: [CheckoutProgressComponent, MultiLinePipe],
  entryComponents: [CheckoutProgressComponent],
  exports: [CheckoutProgressComponent],
  providers: [
    provideDefaultConfig(defaultCheckoutConfig),
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutProgress: {
          component: CheckoutProgressComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, CheckoutStepsSetGuard],
        },
      },
    }),
  ],
})
export class CheckoutProgressModule {}
