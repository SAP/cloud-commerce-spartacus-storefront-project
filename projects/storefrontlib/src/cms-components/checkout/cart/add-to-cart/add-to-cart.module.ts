import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  ConfigModule,
  I18nModule,
  UrlTranslationModule,
} from '@spartacus/core';
import { SpinnerModule } from '../../../../lib/ui/components/spinner/spinner.module';
import { IconModule } from '../../../../cms-components/misc/icon/index';
import { CartSharedModule } from './../cart-shared/cart-shared.module';
import { AddToCartComponent } from './add-to-cart.component';
import { AddedToCartDialogComponent } from './added-to-cart-dialog/added-to-cart-dialog.component';

@NgModule({
  imports: [
    CartSharedModule,
    CommonModule,
    RouterModule,
    SpinnerModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ProductAddToCartComponent: { selector: 'cx-add-to-cart' },
      },
    }),
    UrlTranslationModule,
    IconModule,
    I18nModule,
  ],
  declarations: [AddToCartComponent, AddedToCartDialogComponent],
  entryComponents: [AddToCartComponent, AddedToCartDialogComponent],
  exports: [AddToCartComponent],
})
export class AddToCartModule {}
