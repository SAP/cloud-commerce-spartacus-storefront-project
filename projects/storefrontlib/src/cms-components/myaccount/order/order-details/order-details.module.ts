import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  I18nModule,
  Config,
  FeaturesConfigModule,
} from '@spartacus/core';
import { TrackingEventsComponent } from './order-detail-items/consignment-tracking/tracking-events/tracking-events.component';
import { ConsignmentTrackingComponent } from '../../../../cms-components/myaccount/order/order-details/order-detail-items/consignment-tracking/consignment-tracking.component';
import { CmsPageGuard } from '../../../../cms-structure/guards/cms-page.guard';
import { PageLayoutComponent } from '../../../../cms-structure/page/page-layout/page-layout.component';
import { CardModule } from '../../../../shared/components/card/card.module';
import { SpinnerModule } from '../../../../shared/components/spinner/spinner.module';
import { CartSharedModule } from '../../../cart/cart-shared/cart-shared.module';
import { OrderDetailHeadlineComponent } from './order-detail-headline/order-detail-headline.component';
import { OrderDetailItemsComponent } from './order-detail-items/order-detail-items.component';
import { OrderDetailShippingComponent } from './order-detail-shipping/order-detail-shipping.component';
import { OrderDetailTotalsComponent } from './order-detail-totals/order-detail-totals.component';
import { OrderDetailsService } from './order-details.service';
import { ModuleConfig } from '../../../../recipes/config/module-config/module-config';
import { defaultModuleConfig } from '../../../../recipes/config/module-config/default-module-config';

const moduleComponents = [
  OrderDetailHeadlineComponent,
  OrderDetailItemsComponent,
  OrderDetailTotalsComponent,
  OrderDetailShippingComponent,
];

@NgModule({
  imports: [
    CartSharedModule,
    CardModule,
    CommonModule,
    I18nModule,
    FeaturesConfigModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'orderDetails' },
      },
    ]),
    ConfigModule.withConfig(defaultModuleConfig),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        AccountOrderDetailsHeadlineComponent: {
          component: OrderDetailHeadlineComponent,
        },
        AccountOrderDetailsItemsComponent: {
          component: OrderDetailItemsComponent,
        },
        AccountOrderDetailsTotalsComponent: {
          component: OrderDetailTotalsComponent,
        },
        AccountOrderDetailsShippingComponent: {
          component: OrderDetailShippingComponent,
        },
      },
    }),
    SpinnerModule,
  ],
  providers: [
    OrderDetailsService,
    { provide: ModuleConfig, useExisting: Config },
  ],
  declarations: [
    ...moduleComponents,
    TrackingEventsComponent,
    ConsignmentTrackingComponent,
  ],
  exports: [...moduleComponents],
  entryComponents: [
    ...moduleComponents,
    TrackingEventsComponent,
    ConsignmentTrackingComponent,
  ],
})
export class OrderDetailsModule {}
