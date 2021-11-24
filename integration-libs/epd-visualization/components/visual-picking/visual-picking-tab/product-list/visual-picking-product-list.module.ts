import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import {
  AddToCartModule,
  CarouselModule,
  IconModule,
  MediaModule,
  ProductReferencesModule,
} from '@spartacus/storefront';
import { VisualPickingProductListComponent } from './visual-picking-product-list.component';
import { CompactAddToCartModule } from './compact-add-to-cart/compact-add-to-cart.module';
import { PagedListModule } from './paged-list/paged-list.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProductReferencesModule,
    MediaModule,
    IconModule,
    CarouselModule,
    PagedListModule,
    AddToCartModule,
    UrlModule,
    I18nModule,
    CompactAddToCartModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        VisualPickingProductListComponent: {
          component: VisualPickingProductListComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [VisualPickingProductListComponent],
  exports: [VisualPickingProductListComponent],
  entryComponents: [VisualPickingProductListComponent],
})
export class VisualPickingProductListModule {}
