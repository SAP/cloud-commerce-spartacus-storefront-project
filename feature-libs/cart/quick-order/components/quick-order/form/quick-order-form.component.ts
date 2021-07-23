import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuickOrderFacade } from '@spartacus/cart/quick-order/root';
import {
  GlobalMessageService,
  GlobalMessageType,
  Product,
} from '@spartacus/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cx-quick-order-form',
  templateUrl: './quick-order-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickOrderFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  iconTypes = ICON_TYPE;

  get isDisabled(): boolean {
    return this._disabled;
  }

  @Input('isDisabled') set isDisabled(value: boolean) {
    this._disabled = value;
    this.validateProductControl(value);
  }

  protected subscription = new Subscription();
  protected _disabled: boolean = false;

  constructor(
    protected globalMessageService: GlobalMessageService,
    protected quickOrderService: QuickOrderFacade
  ) {}

  ngOnInit(): void {
    this.build();
    this.subscription.add(this.watchProductAdd());
  }

  search(event?: Event): void {
    if (this.form.invalid) {
      return;
    }

    event?.preventDefault();

    const productCode = this.form.get('product')?.value;

    this.quickOrderService.search(productCode).subscribe(
      (product: Product) => {
        this.quickOrderService.addProduct(product);
      },
      (error: HttpErrorResponse) => {
        this.globalMessageService.add(
          error.error.errors[0].message,
          GlobalMessageType.MSG_TYPE_ERROR
        );
      }
    );
  }

  clear(event?: Event): void {
    event?.preventDefault();
    this.form.reset();
  }

  protected build() {
    const form = new FormGroup({});
    form.setControl('product', new FormControl(null));

    this.form = form;
    this.validateProductControl(this._disabled);
  }

  protected watchProductAdd(): Subscription {
    return this.quickOrderService
      .getProductAdded()
      .subscribe(() => this.clear());
  }

  protected validateProductControl(isDisabled: boolean): void {
    if (isDisabled) {
      this.form?.get('product')?.disable();
    } else {
      this.form?.get('product')?.enable();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
