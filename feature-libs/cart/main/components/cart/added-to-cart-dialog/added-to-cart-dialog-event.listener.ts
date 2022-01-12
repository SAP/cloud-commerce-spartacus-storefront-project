import { Injectable, OnDestroy } from '@angular/core';
import {
  ActiveCartFacade,
  CartUiEventAddToCart,
} from '@spartacus/cart/main/root';
import { EventService } from '@spartacus/core';
import { ModalService } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { AddedToCartDialogComponent } from './added-to-cart-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AddedToCartDialogEventListener implements OnDestroy {
  protected subscription = new Subscription();

  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected eventService: EventService,
    protected modalService: ModalService
  ) {
    this.onAddToCart();
  }

  protected onAddToCart() {
    this.subscription.add(
      this.eventService.get(CartUiEventAddToCart).subscribe((event) => {
        this.openModal(event);
      })
    );
  }
  protected openModal(event: CartUiEventAddToCart): void {
    const modalRef = this.modalService.open(AddedToCartDialogComponent, {
      centered: true,
      size: 'lg',
    });
    const modalInstance = modalRef.componentInstance;
    // Display last entry for new product code. This always corresponds to
    // our new item, independently of whether merging occured or not
    modalInstance.entry$ = this.activeCartFacade.getLastEntry(
      event.productCode
    );
    modalInstance.cart$ = this.activeCartFacade.getActive();
    modalInstance.loaded$ = this.activeCartFacade.isStable();
    modalInstance.quantity = event.quantity;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
