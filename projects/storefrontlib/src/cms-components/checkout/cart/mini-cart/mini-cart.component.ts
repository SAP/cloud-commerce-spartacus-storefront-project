import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CartService, CmsMiniCartComponent, UICart } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CmsComponentData } from '../../../../cms-structure/page/index';

@Component({
  selector: 'cx-mini-cart',
  templateUrl: './mini-cart.component.html',
  styleUrls: ['./mini-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCartComponent {
  constructor(
    protected component: CmsComponentData<CmsMiniCartComponent>,
    protected cartService: CartService
  ) {}

  get cart$(): Observable<UICart> {
    return this.cartService.getActive();
  }
}
