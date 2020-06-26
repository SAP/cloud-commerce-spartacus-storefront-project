import { Component, OnInit } from '@angular/core';
import {
  ConfiguratorCommonsService,
  Product,
  ProductService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ICON_TYPE } from '../../../misc/icon/index';
import { ConfigRouterExtractorService } from '../../generic/service/config-router-extractor.service';

@Component({
  selector: 'cx-config-product-title',
  templateUrl: './config-product-title.component.html',
})
export class ConfigProductTitleComponent implements OnInit {
  product$: Observable<Product>;
  showMore = false;
  iconTypes = ICON_TYPE;

  constructor(
    private configuratorCommonsService: ConfiguratorCommonsService,
    private configRouterExtractorService: ConfigRouterExtractorService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.product$ = this.configRouterExtractorService.extractRouterData().pipe(
      switchMap((routerData) =>
        this.configuratorCommonsService.getConfiguration(routerData.owner)
      ),
      switchMap((configuration) =>
        this.productService.get(configuration.productCode)
      )
    );
  }

  triggerDetails() {
    this.showMore = !this.showMore;
  }

  getProductImageURL(product: Product): string {
    return product.images?.PRIMARY?.['thumbnail']?.url;
  }

  getProductImageAlt(product: Product): string {
    return product.images?.PRIMARY?.['thumbnail']?.altText;
  }
}
