import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@spartacus/core';
import { OrderConfirmationPageGuard } from '../../cms-components/checkout/guards/order-confirmation-page.guard';
import { OrderConfirmationModule } from '../../cms-components/checkout/index';
import { CmsPageGuard } from '../../cms-structure/guards/cms-page.guard';
import { OutletRefModule } from '../../cms-structure/outlet/index';
import { PageLayoutModule } from '../../cms-structure/page/page-layout/page-layout.module';
import { OrderConfirmationPageComponent } from './order-confirmation-page.component';

const routes: Routes = [
  // TODO: as soon as the components are moved to CMS driven components we can drop this specific OrderConfirmationPageComponent
  {
    path: null,
    canActivate: [AuthGuard, CmsPageGuard, OrderConfirmationPageGuard],
    component: OrderConfirmationPageComponent,
    data: { pageLabel: 'orderConfirmationPage', cxRoute: 'orderConfirmation' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    OrderConfirmationModule,
    PageLayoutModule,
    OutletRefModule,
    RouterModule.forChild(routes),
  ],
  declarations: [OrderConfirmationPageComponent],
  exports: [OrderConfirmationPageComponent],
})
export class OrderConfirmationPageModule {}
