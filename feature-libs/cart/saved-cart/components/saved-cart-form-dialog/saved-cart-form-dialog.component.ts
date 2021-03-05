import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  Cart,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
} from '@spartacus/core';
import {
  FocusConfig,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { SavedCartFormType } from '../../core/model/saved-cart.model';
import { SavedCartService } from '../../core/services/saved-cart.service';
import { SavedCartFormService } from './saved-cart-form.service';

@Component({
  selector: 'cx-saved-cart-form-dialog',
  templateUrl: './saved-cart-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedCartFormDialogComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  savedCartFormType = SavedCartFormType;
  form: FormGroup;
  iconTypes = ICON_TYPE;
  cart: Cart;
  layoutOption: string;

  isLoading$: Observable<boolean>;

  descriptionMaxLength: number = 500;
  nameMaxLength: number = 50;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    // Close on click outside the dialog window
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }

  constructor(
    protected el: ElementRef,
    protected globalMessageService: GlobalMessageService,
    protected launchDialogService: LaunchDialogService,
    protected routingService: RoutingService,
    protected savedCartFormService: SavedCartFormService,
    protected savedCartService: SavedCartService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.savedCartService.getSaveCartProcessLoading();

    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        this.cart = data.cart;
        this.layoutOption = data.layoutOption;
        this.build();
      })
    );

    this.subscription.add(
      this.savedCartService
        .getSaveCartProcessSuccess()
        .subscribe((success) => this.onSuccess(success, SavedCartFormType.EDIT))
    );
  }

  get descriptionsCharacterLeft(): number {
    return (
      this.descriptionMaxLength -
      (this.form.get('description')?.value?.length || 0)
    );
  }

  saveOrEditCart(cartId: string): void {
    this.savedCartService.saveCart({
      cartId,
      saveCartName: this.form.get('name')?.value,
      saveCartDescription: this.form.get('description')?.value,
      extraData: !this.layoutOption ? { edit: false } : { edit: true },
    });
  }

  deleteCart(cartId: string): void {
    // TODO: replace logic and use the DeleteCartEvents when they're available.
    // race condition (thinking of a fix)
    this.routingService.go({ cxRoute: 'savedCarts' });
    this.globalMessageService.add(
      {
        key: 'savedCartDialog.deleteCartSuccess',
      },
      GlobalMessageType.MSG_TYPE_CONFIRMATION
    );
    this.savedCartService.deleteSavedCart(cartId);
    this.close('Succesfully deleted a saved cart');
  }

  close(reason: string): void {
    this.launchDialogService.closeDialog(reason);
  }

  onSuccess(success: boolean, saveCartAction: string): void {
    if (success) {
      switch (saveCartAction) {
        case SavedCartFormType.DELETE: {
          // when events become available
          break;
        }

        default: {
          this.close('Succesfully saved cart');
          this.savedCartService.clearSaveCart();
          this.savedCartService.clearRestoreSavedCart();

          this.globalMessageService.add(
            {
              key: !this.layoutOption
                ? 'savedCartCartPage.messages.cartSaved'
                : 'savedCartDialog.editCartSuccess',
              params: {
                cartName: this.form.get('name')?.value || this.cart?.code,
              },
            },
            GlobalMessageType.MSG_TYPE_CONFIRMATION
          );

          break;
        }
      }
    }
  }

  protected build(): void {
    let cart = null;

    if (this.cart.saveTime) {
      cart = this.cart;
    }

    this.form = this.savedCartFormService.getForm(
      this.nameMaxLength,
      this.descriptionMaxLength,
      cart
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
