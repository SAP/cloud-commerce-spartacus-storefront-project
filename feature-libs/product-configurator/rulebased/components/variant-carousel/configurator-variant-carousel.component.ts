import { Product, ProductService, TranslationService } from '@spartacus/core';
import { ConfiguratorRouterExtractorService } from '@spartacus/product-configurator/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { Configurator } from '../../core/model/configurator.model';

@Component({
  selector: 'cx-configurator-variant-carousel',
  templateUrl: './configurator-variant-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorVariantCarouselComponent {
  configuration$: Observable<Configurator.Configuration> =
    this.configRouterExtractorService
      .extractRouterData()
      .pipe(
        switchMap((routerData) =>
          this.configuratorCommonsService.getConfiguration(routerData.owner)
        )
      );

  title$: Observable<string | undefined> = this.translation
    .translate('configurator.variantCarousel.title')
    .pipe(take(1));

  items$: Observable<Observable<Product | undefined>[]> =
    this.configuration$.pipe(
      map((configuration) => {
        return configuration?.variants?.map((variant) =>
          this.productService.get(variant.productCode)
        );
      })
    );

  constructor(
    protected productService: ProductService,
    protected translation: TranslationService,
    protected configRouterExtractorService: ConfiguratorRouterExtractorService,
    protected configuratorCommonsService: ConfiguratorCommonsService
  ) {}
}
