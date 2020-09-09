import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { CmsPageGuard } from '../../../../cms-structure/guards/cms-page.guard';
import { PageLayoutComponent } from '../../../../cms-structure/page/page-layout/page-layout.component';
import {
  CardModule,
  ListNavigationModule,
  SpinnerModule,
} from '../../../../shared/index';
import { CartSharedModule } from '../../../cart/cart-shared/cart-shared.module';
import { PromotionsModule } from '../../../checkout/components/promotions/promotions.module';
import { OrderDetailHeadlineComponent } from '../order-details/order-detail-headline/order-detail-headline.component';
import { OrderDetailItemsComponent } from '../order-details/order-detail-items/order-detail-items.component';
import { OrderDetailShippingComponent } from '../order-details/order-detail-shipping/order-detail-shipping.component';
import { OrderDetailTotalsComponent } from '../order-details/order-detail-totals/order-detail-totals.component';
import { OrderDetailsService } from '../order-details/order-details.service';
import { ReplenishmentOrderDetailsOrderHistoryComponent } from './replenishment-order-details-order-history/replenishment-order-details-order-history.component';
import { ReplenishmentOrderDetailsService } from './replenishment-order-details.service';

const moduleComponents = [ReplenishmentOrderDetailsOrderHistoryComponent];

@NgModule({
  imports: [
    CartSharedModule,
    CardModule,
    CommonModule,
    I18nModule,
    PromotionsModule,
    UrlModule,
    SpinnerModule,
    ListNavigationModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'replenishmentDetails' },
      },
    ]),
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ReplenishmentDetailHeadlineComponent: {
          component: OrderDetailHeadlineComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: ReplenishmentOrderDetailsService,
            },
          ],
        },
        ReplenishmentDetailItemsComponent: {
          component: OrderDetailItemsComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: ReplenishmentOrderDetailsService,
            },
          ],
        },
        ReplenishmentDetailTotalsComponent: {
          component: OrderDetailTotalsComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: ReplenishmentOrderDetailsService,
            },
          ],
        },
        ReplenishmentDetailShippingComponent: {
          component: OrderDetailShippingComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: ReplenishmentOrderDetailsService,
            },
          ],
        },
        ReplenishmentDetailOrderHistoryComponent: {
          component: ReplenishmentOrderDetailsOrderHistoryComponent,
        },
      },
    }),
  ],
  declarations: [...moduleComponents],
  exports: [...moduleComponents],
  entryComponents: [...moduleComponents],
})
export class ReplenishmentOrderDetailsModule {}
