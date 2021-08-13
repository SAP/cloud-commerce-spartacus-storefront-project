import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { CartModification, CartValidationStatusCode } from '@spartacus/core';
import { CartValidationWarningsStateService } from '../cart-validation-warnings-state.service';
import { ICON_TYPE } from '../../../misc';

@Component({
  selector: 'cx-cart-validation-cart-warnings',
  templateUrl: './cart-validation-cart-warnings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartValidationCartWarningsComponent {
  iconTypes = ICON_TYPE;
  visibleWarnings: { [key: string]: boolean } = {};

  checkoutRouteActivated$ = this.cartValidationWarningsStateService
    .checkoutRouteActivated$;

  cartModifications$ = this.cartValidationWarningsStateService.cartValidationResult$.pipe(
    map((modificationList: CartModification[]) => {
      console.log('outOfStock cartModifications$: ', modificationList);
      const result = modificationList.filter(
        (modification) =>
          modification.statusCode === CartValidationStatusCode.LOW_STOCK
      );

      result.forEach((modification) => {
        if (modification.entry?.product?.code) {
          this.visibleWarnings[modification.entry.product.code] = true;
        }
      });
      return result;
    })
  );

  constructor(
    protected cartValidationWarningsStateService: CartValidationWarningsStateService
  ) {}

  removeMessage(cartModification: CartModification) {
    if (cartModification.entry?.product?.code) {
      this.visibleWarnings[cartModification.entry.product.code] = false;
    }
  }
}
