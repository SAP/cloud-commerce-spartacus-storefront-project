import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { IconModule, ItemCounterModule } from '@spartacus/storefront';
import { AddToCartComponent } from './add-to-cart.component';
import { AddToCartLinkComponent } from './add-to-cart-link/add-to-cart-link.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, I18nModule, ItemCounterModule, IconModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ProductAddToCartComponent: {
          component: AddToCartComponent,
          data: {
            inventoryDisplay: false,
          },
        },
      },
    }),
  ],
  declarations: [AddToCartComponent, AddToCartLinkComponent],
  exports: [AddToCartComponent],
})
export class AddToCartModule { }
