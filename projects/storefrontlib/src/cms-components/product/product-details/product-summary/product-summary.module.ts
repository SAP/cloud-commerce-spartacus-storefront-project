import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CmsModule,
  I18nModule,
  UrlModule,
  ConfigModule,
  CmsConfig,
} from '@spartacus/core';
import { OutletModule } from '../../../../cms-structure/outlet/index';
import {
  FormComponentsModule,
  MediaModule,
  StarRatingModule,
} from '../../../../shared/index';
import { AddToCartModule, CartSharedModule } from '../../../cart/index';
import { ProductSummaryComponent } from './product-summary.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CartSharedModule,
    CmsModule,
    AddToCartModule,
    OutletModule,
    I18nModule,
    FormComponentsModule,
    MediaModule,
    StarRatingModule,
    UrlModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ProductSummaryComponent: {
          selector: 'cx-product-summary',
        },
      },
    }),
  ],
  declarations: [ProductSummaryComponent],
  entryComponents: [ProductSummaryComponent],
  exports: [ProductSummaryComponent],
})
export class ProductSummaryModule {}
