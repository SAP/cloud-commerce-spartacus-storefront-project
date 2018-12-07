import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsModule } from '../../../cms/cms.module';
import { CartModule } from '../../../cart/cart.module';
import { CartPageLayoutComponent } from './cart-page-layout.component';
import { CartDetailsModule } from '../../../cart/components/cart-details/cart-details.module';

@NgModule({
  imports: [CommonModule, CmsModule, CartModule, CartDetailsModule],
  declarations: [CartPageLayoutComponent],
  exports: [CartPageLayoutComponent]
})
export class CartPageLayoutModule {}
