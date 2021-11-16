import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { map } from 'rxjs/operators';
import { CartValidationStateService } from '../cart-validation-state.service';

@Component({
  selector: 'cx-cart-item-validation-warning',
  templateUrl: './cart-item-validation-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemValidationWarningComponent {
  @Input()
  code: string;

  iconTypes = ICON_TYPE;
  isVisible = true;

  cartModification$ = this.cartValidationStateService.cartValidationResult$.pipe(
    map((modificationList) =>
      modificationList.find(
        (modification) => modification.entry?.product?.code === this.code
      )
    )
  );

  constructor(
    protected cartValidationStateService: CartValidationStateService
  ) {}
}
