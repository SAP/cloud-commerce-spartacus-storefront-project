import { Injectable } from '@angular/core';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import { ActiveCartFacade, OrderEntry } from '@spartacus/cart/base/root';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LaunchDialogService } from '@spartacus/storefront';

@Injectable({
  providedIn: 'root',
})
export class ClearCartDialogComponentService {
  constructor(
    protected launchDialogService: LaunchDialogService,
    protected globalMessageService: GlobalMessageService,
    protected activeCartFacade: ActiveCartFacade
  ) {}

  /**
   * Clear all entries from active cart
   */
  clearActiveCart(): void {
    this.activeCartFacade
      .getEntries()
      .pipe(
        take(1),
        tap((entries: OrderEntry[]) => {
          // Make copy and reverse entries[] to start at end of array
          // since cart entries are shifted downwards with removeEntry()
          entries
            .slice()
            .reverse()
            .forEach((entry) => this.activeCartFacade.removeEntry(entry));
        }),
        switchMap(() => this.isClearCartInProgress()),
        filter((inProgress) => !inProgress),
        tap(() => this.closeDialog('Close dialog after cart cleared')),
        switchMap(() =>
          this.activeCartFacade
            .getEntries()
            .pipe(map((entries) => entries.length === 0))
        ),
        take(1)
      )
      .subscribe((status) => {
        this.displayGlobalMessage(status);
      });
  }

  /**
   * Returns status of clearing cart
   */
  isClearCartInProgress(): Observable<boolean> {
    return this.activeCartFacade.isStable().pipe(map((stable) => !stable));
  }

  /**
   * Close clear cart modal dialog
   * @param reason
   */
  closeDialog(reason: string): void {
    this.launchDialogService.closeDialog(reason);
  }

  /**
   * Display global message after clearing cart.
   * By default, the message is displayed with the type `Success` only,
   * a negative scenario has been handled in the occ layer already,
   * but the status flag allows to recognize it and add a custom error message as well.
   * @param status
   */
  protected displayGlobalMessage(status: boolean): void {
    if (status) {
      this.globalMessageService.add(
        { key: 'clearCart.cartClearedSuccessfully' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    }
  }
}
