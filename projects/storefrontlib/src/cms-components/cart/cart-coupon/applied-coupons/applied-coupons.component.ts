import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CartVoucherService, Voucher } from '@spartacus/core';
import { ICON_TYPE } from '../../../../cms-components/misc/icon/icon.model';

/**
 * @deprecated since 4.1 - use cart lib instead
 */
@Component({
  selector: 'cx-applied-coupons',
  templateUrl: './applied-coupons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppliedCouponsComponent {
  @Input()
  vouchers: Voucher[];
  @Input()
  cartIsLoading = false;
  @Input()
  isReadOnly = false;

  iconTypes = ICON_TYPE;

  constructor(protected cartVoucherService: CartVoucherService) {}

  public get sortedVouchers(): Voucher[] {
    this.vouchers = this.vouchers || [];
    return this.vouchers.slice().sort((a, b) => {
      return a.code.localeCompare(b.code);
    });
  }

  removeVoucher(voucherId: string) {
    this.cartVoucherService.removeVoucher(voucherId);
  }
}
