import { ModuleWithProviders, NgModule } from '@angular/core';
import { CdsMerchandisingStrategyAdapter } from './adapters/strategy/cds-merchandising-strategy.adapter';
import { MerchandisingCarouselCmsModule } from './cms-components/merchandising-carousel-cms.module';
import {
  MERCHANDISING_FACET_NORMALIZER,
  MERCHANDISING_FACET_TO_QUERYPARAM_NORMALIZER,
  MERCHANDISING_PRODUCTS_NORMALIZER,
  MERCHANDISING_PRODUCT_NORMALIZER,
} from './connectors/strategy/converters';
import { MerchandisingStrategyAdapter } from './connectors/strategy/merchandising-strategy.adapter';
import { MerchandisingFacetNormalizer } from './converters/merchandising-facet-normalizer';
import { MerchandisingFacetToQueryparamNormalizer } from './converters/merchandising-facet-to-queryparam-normalizer';
import { MerchandisingProductNormalizer } from './converters/merchandising-product-normalizer';
import { MerchandisingProductsNormalizer } from './converters/merchandising-products-normalizer';

@NgModule({
  imports: [MerchandisingCarouselCmsModule],
  providers: [
    {
      provide: MerchandisingStrategyAdapter,
      useClass: CdsMerchandisingStrategyAdapter,
    },
  ],
})
export class MerchandisingModule {
  static forRoot(): ModuleWithProviders<MerchandisingModule> {
    return {
      ngModule: MerchandisingModule,
      providers: [
        {
          provide: MERCHANDISING_PRODUCTS_NORMALIZER,
          useExisting: MerchandisingProductsNormalizer,
          multi: true,
        },
        {
          provide: MERCHANDISING_PRODUCT_NORMALIZER,
          useExisting: MerchandisingProductNormalizer,
          multi: true,
        },
        {
          provide: MERCHANDISING_FACET_NORMALIZER,
          useExisting: MerchandisingFacetNormalizer,
          multi: true,
        },
        {
          provide: MERCHANDISING_FACET_TO_QUERYPARAM_NORMALIZER,
          useExisting: MerchandisingFacetToQueryparamNormalizer,
          multi: true,
        },
      ],
    };
  }
}
