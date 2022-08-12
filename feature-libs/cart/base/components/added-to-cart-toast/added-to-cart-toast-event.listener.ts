import { ComponentRef, Injectable, OnDestroy } from '@angular/core';
import { EventService } from '@spartacus/core';
import { LaunchDialogService, LAUNCH_CALLER } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  ADDED_TO_CART_FEEDBACK,
  CartConfig,
  CartUiEventAddToCart,
} from '@spartacus/cart/base/root';
import { AddedToCartToastComponent } from './added-to-cart-toast.component';

@Injectable({
  providedIn: 'root',
})
export class AddedToCartToastEventListener implements OnDestroy {
  protected subscription = new Subscription();
  protected component: AddedToCartToastComponent | undefined;

  constructor(
    protected eventService: EventService,
    protected launchDialogService: LaunchDialogService,
    protected cartConfig: CartConfig
  ) {
    this.onAddToCart();
  }

  protected onAddToCart(): void {
    const feedbackType = this.cartConfig.cart?.addToCartFeedback.feedback;
    if (feedbackType !== ADDED_TO_CART_FEEDBACK.TOAST) {
      return;
    }

    this.subscription.add(
      this.eventService.get(CartUiEventAddToCart).subscribe((event) => {
        this.addToast(event);
      })
    );
  }

  protected renderToastUi(): void {
    const timeout = this.cartConfig.cart?.addToCartFeedback.toast?.timeout;
    const component$: any = this.launchDialogService.launch(
      LAUNCH_CALLER.ADDED_TO_CART_TOAST
    );

    component$
      .pipe(filter(Boolean), take(1))
      .subscribe((component: ComponentRef<AddedToCartToastComponent>) => {
        this.component = component.instance;
        this.component.timeout = timeout ? timeout : 3000;
        this.component.init();
      });
  }

  protected addToast(event: CartUiEventAddToCart): void {
    if (!this.component) {
      this.renderToastUi();
    }
    this.component?.addToast(event);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.component?.ngOnDestroy();
  }
}
