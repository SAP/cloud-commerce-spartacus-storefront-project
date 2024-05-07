/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, OnDestroy } from '@angular/core';
import {
  CartAddEntryFailEvent,
  CartAddEntrySuccessEvent,
  CartUiEventAddToCart,
} from '@spartacus/cart/base/root';
import { EventService } from '@spartacus/core';
import { LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';
import { ReplaySubject, Subscription, race } from 'rxjs';
import { take } from 'rxjs/operators';
import { AddedToCartDialogComponentData } from './added-to-cart-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AddedToCartDialogEventListener implements OnDestroy {
  protected subscription = new Subscription();

  constructor(
    protected eventService: EventService,
    protected launchDialogService: LaunchDialogService
  ) {
    this.onAddToCart();
  }

  protected onAddToCart() {
    this.subscription.add(
      this.eventService.get(CartUiEventAddToCart).subscribe((event) => {
        this.openModal(event);
      })
    );
    this.subscription.add(
      this.eventService.get(CartAddEntryFailEvent).subscribe((event) => {
        this.closeModal(event);
      })
    );
  }
  /**
   * @deprecated since 2211.24. With activation of feature toggle 'adddedToCartDialogDrivenBySuccessEvent'
   * the method is no longer called, instead method openModalAfterSuccess takes care of launching
   * the addedToCart dialogue.
   *
   * Opens modal based on CartUiEventAddToCart.
   * @param event Signals that a product has been added to the cart.
   */
  protected openModal(event: CartUiEventAddToCart): void {
    // We subscribe early to result events using ReplaySubject(1)
    // to ensure no missed emissions even if the modal subscribes late.
    const addingEntryResult$ = new ReplaySubject<
      CartAddEntrySuccessEvent | CartAddEntryFailEvent
    >(1);
    race([
      this.eventService.get(CartAddEntrySuccessEvent),
      this.eventService.get(CartAddEntryFailEvent),
    ]).subscribe((event) => addingEntryResult$.next(event));

    const addToCartData: AddedToCartDialogComponentData = {
      addingEntryResult$,
      productCode: event.productCode,
      quantity: event.quantity,
      numberOfEntriesBeforeAdd: event.numberOfEntriesBeforeAdd,
      pickupStoreName: event.pickupStoreName,
    };

    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.ADDED_TO_CART,
      undefined,
      undefined,
      addToCartData
    );

    if (dialog) {
      dialog.pipe(take(1)).subscribe();
    }
  }

  protected closeModal(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
