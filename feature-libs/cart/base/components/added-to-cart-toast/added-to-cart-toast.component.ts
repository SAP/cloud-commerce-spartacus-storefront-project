import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { WindowRef } from '@spartacus/core';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  ActiveCartFacade,
  CartToastItem,
  CartUiEventAddToCart,
  CART_TOAST_STATE,
  OrderEntry,
} from '@spartacus/cart/base/root';
import { AddedToCartToastComponentService } from './added-to-cart-toast-component.service';

@Component({
  selector: 'cx-added-to-cart-toast',
  templateUrl: './added-to-cart-toast.component.html',
})
export class AddedToCartToastComponent implements OnDestroy {
  protected subscription = new Subscription();

  headerElement: HTMLElement | null;

  toastContainerClass: string;

  timeout: number;

  toastContainerBaseClass = 'toast-container';

  lastToastItem: CartToastItem;

  scrollEventUnlistener: () => void;

  @HostBinding('className') baseClass: string;

  cartToasts$: Observable<CartToastItem[]> =
    this.addedToCartToastService.getToasts();

  constructor(
    protected winRef: WindowRef,
    protected renderer: Renderer2,
    protected cd: ChangeDetectorRef,
    protected addedToCartToastService: AddedToCartToastComponentService,
    protected activeCartService: ActiveCartFacade,
    protected el: ElementRef
  ) {}

  init(): void {
    this.baseClass = 'cx-added-to-cart-toast';
    this.toastContainerClass = this.toastContainerBaseClass;
    this.headerElement = this.winRef.document.querySelector('header');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addToast(event: CartUiEventAddToCart) {
    this.setOffsetHeight();

    if (this.lastToastItem) {
      this._destroyPreviousToast();
      this.lastToastItem = null;
    }

    this.activeCartService
      .getLastEntry(event.productCode)
      .pipe(
        filter(Boolean) as OperatorFunction<OrderEntry | undefined, OrderEntry>,
        take(1)
      )
      .subscribe((entries) => {
        let toastContainerClass = `${this.toastContainerBaseClass} `;
        const toastItem = this.addedToCartToastService.addToast(
          event.quantity,
          entries,
          toastContainerClass
        );

        this.cd.detectChanges();

        // trigger enter animations with class change
        toastItem.baseClass = this.getToastStyles();

        if (this.scrollEventUnlistener) {
          this.scrollEventUnlistener();
        }

        // wait for enter animation end
        setTimeout(() => {
          this.triggerScrollEvent();
        }, 500);

        // trigger slide out animation after timeout
        toastItem.timeoutRef = setTimeout(() => {
          this.lastToastItem = null;
          this._closeToast(toastItem);
        }, this.timeout);
        this.lastToastItem = toastItem;
      });
  }

  setOffsetHeight() {
    if (this.headerElement) {
      this.el.nativeElement.style.setProperty(
        '--cx-added-to-cart-toast-header-offset',
        `${this.headerElement?.offsetHeight}px`
      );
    }
  }

  triggerScrollEvent(): void {
    this.scrollEventUnlistener = this.renderer.listen(
      this.winRef.nativeWindow,
      'scroll',
      this._setPosition
    );
  }

  isHeaderInView(): boolean {
    if (!this.headerElement) {
      return false;
    }
    const headerBounding = this.headerElement.getBoundingClientRect();
    return headerBounding.bottom >= 0;
  }

  isHeaderFixed() {
    if (!this.headerElement) return false;
    const headerPosition = this.headerElement.style.position;
    return headerPosition === 'fixed';
  }

  closeToast(toastItem: CartToastItem) {
    if (toastItem.timeoutRef) {
      clearTimeout(toastItem.timeoutRef);
    }
    this._closeToast(toastItem);
  }

  _closeToast = (toastItem: CartToastItem) => {
    if (this.scrollEventUnlistener) {
      this.scrollEventUnlistener();
    }

    toastItem.baseClass = this.getToastStyles(
      CART_TOAST_STATE.CLOSING,
      toastItem.baseClass
    );
    // wait for animation and remove toast
    setTimeout(() => {
      this.addedToCartToastService.removeToast();
    }, 500);
  };

  _destroyPreviousToast() {
    if(this.lastToastItem.timeoutRef){
      clearTimeout(this.lastToastItem.timeoutRef);
    }
    this.addedToCartToastService.removeToast();
  }

  _setPosition = () => {
    this.addedToCartToastService.setPosition(
      this.getToastStyles(CART_TOAST_STATE.OPENED)
    );
  };

  getToastStyles(
    toastState: CART_TOAST_STATE = CART_TOAST_STATE.OPENING,
    toastBaseClass: string = ''
  ): string {
    let positionClasses = [this.toastContainerBaseClass];

    if (toastState === CART_TOAST_STATE.CLOSING) {
      if (toastBaseClass.includes('transition-none')) {
        return toastBaseClass.replace('transition-none', 'close-toast');
      } else {
        return (toastBaseClass += ' close-toast');
      }
    }
    if (this.isHeaderFixed()) {
      positionClasses.push('on-fixed-header');
    } else if (this.isHeaderInView()) {
      positionClasses.push('on-header');
    } else {
      positionClasses.push('off-header');
    }

    if (toastState === CART_TOAST_STATE.OPENED) {
      positionClasses.push('transition-none');
    }

    return positionClasses.join(' ');
  }
}
