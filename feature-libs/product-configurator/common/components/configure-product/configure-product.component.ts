import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { Product, RoutingService } from '@spartacus/core';
import {
  CurrentProductService,
  ProductListItemContext,
} from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonConfigurator } from '../../core/model/common-configurator.model';
import { ConfiguratorProductScope } from '../../core/model/configurator-product-scope';

@Component({
  selector: 'cx-configure-product',
  templateUrl: './configure-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureProductComponent {
  nonConfigurable: Product = { configurable: false };
  product$: Observable<Product> = (this.productListItemContext
    ? this.productListItemContext.product$
    : this.currentProductService
    ? this.currentProductService.getProduct(
        ConfiguratorProductScope.CONFIGURATOR
      )
    : of(null)
  ).pipe(
    //needed because also currentProductService might return null
    map((product) => (product ? product : this.nonConfigurable))
  );

  ownerTypeProduct: CommonConfigurator.OwnerType =
    CommonConfigurator.OwnerType.PRODUCT;
  /**
   * Prevents page down behaviour when users press space key to select buttons
   *
   * @param {KeyboardEvent} event - Keyboard event
   * @param {Configurator.Group} group - Entered group
   */
  preventScrollingOnSpace(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
    }
  }
  /**
   * Fired on keyboard events, checks for 'enter' or 'space' and naviagtes users to the configurator
   *
   * @param {KeyboardEvent} event - Keyboard event
   * @param {Configurator.Group} group - Entered group
   */
  navigateToConfigurator(event: KeyboardEvent, product: Product): void {
    if (event.code === 'Enter' || event.code === 'Space') {
      this.routingService.go(
        {
          cxRoute: 'configure' + product.configuratorType,
          params: { ownerType: this.ownerTypeProduct, entityKey: product.code },
        },
        {}
      );
    }
  }
  constructor(
    protected routingService: RoutingService,
    @Optional() protected productListItemContext: ProductListItemContext, // when on PLP
    @Optional() protected currentProductService: CurrentProductService // when on PDP
  ) {}
}
