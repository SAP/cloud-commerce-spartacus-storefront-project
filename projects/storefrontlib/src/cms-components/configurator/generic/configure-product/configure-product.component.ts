import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { GenericConfigurator } from '@spartacus/core';
import { map } from 'rxjs/operators';
import { OutletContextData } from '../../../../cms-structure/outlet/outlet.model';
import { CurrentProductService } from '../../../product/current-product.service';
//import { ProductContext } from '../../../product/product-outlets.model';

@Component({
  selector: 'cx-configure-product',
  templateUrl: './configure-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureProductComponent {
  productContext: OutletContextData;
  ownerTypeProduct: GenericConfigurator.OwnerType =
    GenericConfigurator.OwnerType.PRODUCT;

  constructor(
    protected currentProductService: CurrentProductService,
    @Optional() protected outletContext?: OutletContextData
  ) {
    if (outletContext) {
      this.productContext = outletContext;
    } else {
      //in this case component was instantiated via CMS, and no
      //outlet context is available
      this.productContext = {
        reference: undefined,
        position: undefined,
        context: undefined,
        context$: this.currentProductService
          .getProduct()
          .pipe(map((prod) => ({ product: prod }))),
      };
    }
  }
}
