import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  ConfigModule,
  ProductReferenceService,
  RoutingService,
  UrlModule,
} from '@spartacus/core';
import { CmsComponentData } from '../../../../cms-structure/page/model/cms-component-data';
import { MediaModule } from '../../../../shared/components/media/media.module';
import { SharedCarouselService } from '../shared-carousel.service';
import { ProductReferencesComponent } from './product-references.component';
import { ProductReferencesService } from './product-references.component.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MediaModule,
    UrlModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ProductReferencesComponent: {
          component: ProductReferencesComponent,
          providers: [
            {
              provide: ProductReferencesService,
              useClass: ProductReferencesService,
              deps: [CmsComponentData, ProductReferenceService, RoutingService],
            },
            {
              provide: SharedCarouselService,
              useClass: SharedCarouselService,
              deps: [],
            },
          ],
        },
      },
    }),
  ],
  declarations: [ProductReferencesComponent],
  entryComponents: [ProductReferencesComponent],
  exports: [ProductReferencesComponent],
})
export class ProductReferencesModule {}
