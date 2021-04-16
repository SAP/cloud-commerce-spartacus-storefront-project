import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SavedCartFacade } from '@spartacus/cart/saved-cart/root';
import {
  Cart,
  ClearCheckoutService,
  GlobalMessageService,
  RoutingService,
} from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SavedCartFormLaunchDialogService } from '../../saved-cart-form-dialog/saved-cart-form-launch-dialog.service';
import { SavedCartDetailsService } from '../saved-cart-details.service';

@Component({
  selector: 'cx-saved-cart-details-action',
  templateUrl: './saved-cart-details-action.component.html',
})
export class SavedCartDetailsActionComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  @ViewChild('element') element: ElementRef;
  savedCart$: Observable<
    Cart | undefined
  > = this.savedCartDetailsService.getCartDetails();

  constructor(
    protected savedCartDetailsService: SavedCartDetailsService,
    protected savedCartService: SavedCartFacade,
    protected routingService: RoutingService,
    protected globalMessageService: GlobalMessageService,
    protected savedCartFormLaunchDialogService: SavedCartFormLaunchDialogService,
    protected vcr: ViewContainerRef,
    protected clearCheckoutService: ClearCheckoutService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.savedCartService
        .getRestoreSavedCartProcessSuccess()
        .subscribe((success) => this.onRestoreComplete(success))
    );
  }

  restoreSavedCart(cartId: string): void {
    this.savedCartService.restoreSavedCart(cartId);
  }

  onRestoreComplete(success: boolean): void {
    if (success) {
      this.routingService.go({ cxRoute: 'savedCarts' });
      this.savedCartService.clearRestoreSavedCart();
      this.savedCartService.clearSaveCart();
      this.clearCheckoutService.resetCheckoutProcesses();
    }
  }

  openDialog(cart: Cart): void {
    const dialog = this.savedCartFormLaunchDialogService.openDialog(
      this.element,
      this.vcr,
      { cart, layoutOption: 'delete' }
    );

    if (dialog) {
      this.subscription.add(dialog.pipe(take(1)).subscribe());
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
