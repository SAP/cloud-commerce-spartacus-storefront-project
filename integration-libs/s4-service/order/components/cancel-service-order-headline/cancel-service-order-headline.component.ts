import { Component, inject } from '@angular/core';
import { CartOutlets } from '@spartacus/cart/base/root';
import { OrderDetailsService } from '@spartacus/order/components';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'cx-cancel-service-order-headline',
  templateUrl: './cancel-service-order-headline.component.html',
})
export class CancelServiceOrderHeadlineComponent {
  protected orderDetailsService = inject(OrderDetailsService);

  order$: Observable<any> = this.orderDetailsService.getOrderDetails().pipe(
    map((order) => ({
      ...order,
      entries: (order.entries || []).filter(
        (entry) => entry.product && entry.product.productTypes === 'SERVICE'
      ),
    }))
  );

  readonly CartOutlets = CartOutlets;
}
