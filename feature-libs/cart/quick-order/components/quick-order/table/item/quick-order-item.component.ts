import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { QuickOrderFacade } from '@spartacus/cart/quick-order/root';
import { OrderEntry } from '@spartacus/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cx-quick-order-item',
  templateUrl: './quick-order-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickOrderItemComponent implements OnInit, OnDestroy {
  quantityControl: FormControl;

  get entry(): OrderEntry {
    return this._entry;
  }

  @Input('entry') set entry(value: OrderEntry) {
    this._entry = value;
    this.quantityControl = new FormControl(this.entry.quantity);
  }

  @Input()
  index: number;

  protected _entry: OrderEntry;
  private subscription = new Subscription();

  constructor(
    protected cd: ChangeDetectorRef,
    protected quickOrderService: QuickOrderFacade
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.quantityControl.valueChanges.subscribe(() => {
        this.quickOrderService.updateEntryQuantity(
          this.index,
          this.quantityControl.value
        );
      })
    );

    this.subscription.add(this.watchProductAdd());
  }

  removeEntry(): void {
    this.quickOrderService.removeEntry(this.index);
  }

  protected watchProductAdd(): Subscription {
    return this.quickOrderService.getProductAdded().subscribe(() => {
      this.quantityControl = new FormControl(this.entry.quantity);
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
