import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';

import { CartService, OrderEntry } from '@spartacus/core';

import { AddedToCartDialogComponent } from './added-to-cart-dialog/added-to-cart-dialog.component';
import { CurrentProductService } from '../../../product/current-product.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCartComponent implements OnInit {
  @Input() productCode: string;

  @Input() showQuantity = true;

  maxQuantity: number;
  modalInstance: any;

  hasStock = false;
  quantity = 1;

  cartEntry$: Observable<OrderEntry>;

  constructor(
    protected cartService: CartService,
    private modalService: NgbModal,
    protected currentProductService: CurrentProductService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.productCode) {
      this.cartEntry$ = this.cartService.getEntry(this.productCode);
      this.hasStock = true;
    } else {
      this.currentProductService
        .getProduct()
        .pipe(filter(Boolean))
        .subscribe(product => {
          this.productCode = product.code;

          if (
            product.stock &&
            product.stock.stockLevelStatus !== 'outOfStock' &&
            product.stock.stockLevel > 0
          ) {
            this.maxQuantity = product.stock.stockLevel;
            this.hasStock = true;
          } else {
            this.hasStock = false;
          }

          this.cartEntry$ = this.cartService.getEntry(this.productCode);

          this.cd.markForCheck();
        });
    }
  }

  updateCount(value): void {
    this.quantity = value;
  }

  addToCart() {
    if (!this.productCode || this.quantity <= 0) {
      return;
    }
    this.openModal();
    this.cartService.addEntry(this.productCode, this.quantity);
  }

  private openModal() {
    this.modalInstance = this.modalService.open(AddedToCartDialogComponent, {
      centered: true,
      size: 'lg',
    }).componentInstance;
    this.modalInstance.entry$ = this.cartEntry$;
    this.modalInstance.cart$ = this.cartService.getActive();
    this.modalInstance.loaded$ = this.cartService.getLoaded();
    this.modalInstance.quantity = this.quantity;
  }
}
