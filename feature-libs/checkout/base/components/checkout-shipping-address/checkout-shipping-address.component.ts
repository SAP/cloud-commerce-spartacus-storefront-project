import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActiveCartFacade } from '@spartacus/cart/main/root';
import { CheckoutDeliveryAddressFacade } from '@spartacus/checkout/base/root';
import {
  Address,
  getLastValueSync,
  TranslationService,
  UserAddressService,
} from '@spartacus/core';
import { Card } from '@spartacus/storefront';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CheckoutStepService } from '../services/checkout-step.service';

export interface CardWithAddress {
  card: Card;
  address: Address;
}

@Component({
  selector: 'cx-shipping-address',
  templateUrl: './checkout-shipping-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingAddressComponent implements OnInit {
  addressFormOpened = false;
  shouldRedirect = false; // this helps with smoother steps transition
  doneAutoSelect = false;

  protected busy$ = new BehaviorSubject<boolean>(false);

  isUpdated$: Observable<boolean> = combineLatest([
    this.busy$,
    this.userAddressService.getAddressesLoading(),
  ]).pipe(map(([busy, loading]) => busy || loading));

  constructor(
    protected userAddressService: UserAddressService,
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    protected activatedRoute: ActivatedRoute,
    protected translationService: TranslationService,
    protected activeCartFacade: ActiveCartFacade,
    protected checkoutStepService: CheckoutStepService
  ) {}

  get isGuestCheckout(): boolean {
    return !!getLastValueSync(this.activeCartFacade.isGuestCart());
  }

  get backBtnText(): string {
    return this.checkoutStepService.getBackBntText(this.activatedRoute);
  }

  get selectedAddress$(): Observable<Address | undefined> {
    return this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(
      filter((state) => !state.loading),
      map((state) => state.data),
      tap((address) => {
        if (address && this.shouldRedirect) {
          this.next();
        }
      })
    );
  }

  get cards$(): Observable<CardWithAddress[]> {
    return combineLatest([
      this.getSupportedAddresses(),
      this.selectedAddress$,
      this.translationService.translate(
        'checkoutAddress.defaultShippingAddress'
      ),
      this.translationService.translate('checkoutAddress.shipToThisAddress'),
      this.translationService.translate('addressCard.selected'),
    ]).pipe(
      tap(([addresses, selected]) =>
        this.selectDefaultAddress(addresses, selected)
      ),
      map(([addresses, selected, textDefault, textShipTo, textSelected]) =>
        addresses.map((address) => ({
          address,
          card: this.getCardContent(
            address,
            selected,
            textDefault,
            textShipTo,
            textSelected
          ),
        }))
      )
    );
  }

  getSupportedAddresses(): Observable<Address[]> {
    return this.userAddressService.getAddresses();
  }

  selectDefaultAddress(
    addresses: Address[],
    selected: Address | undefined
  ): void {
    if (
      !this.doneAutoSelect &&
      addresses &&
      addresses.length &&
      (!selected || Object.keys(selected).length === 0)
    ) {
      selected = addresses.find((address) => address.defaultAddress);
      if (selected) {
        this.selectAddress(selected);
      }
      this.doneAutoSelect = true;
    }
  }

  ngOnInit(): void {
    if (!this.isGuestCheckout) {
      this.userAddressService.loadAddresses();
    }
  }

  getCardContent(
    address: Address,
    selected: any,
    textDefaultShippingAddress: string,
    textShipToThisAddress: string,
    textSelected: string
  ): Card {
    let region = '';
    if (address.region && address.region.isocode) {
      region = address.region.isocode + ', ';
    }

    return {
      title: address.defaultAddress ? textDefaultShippingAddress : '',
      textBold: address.firstName + ' ' + address.lastName,
      text: [
        address.line1,
        address.line2,
        address.town + ', ' + region + address.country?.isocode,
        address.postalCode,
        address.phone,
      ],
      actions: [{ name: textShipToThisAddress, event: 'send' }],
      header: selected && selected.id === address.id ? textSelected : '',
    } as Card;
  }

  selectAddress(address: Address): void {
    // TODO:#checkout - put spinner
    this.checkoutDeliveryAddressFacade.setDeliveryAddress(address);
  }

  addAddress(address: Address | undefined): void {
    if (address) {
      this.busy$.next(true);
      this.checkoutDeliveryAddressFacade
        .createAndSetAddress(address)
        .subscribe({
          complete: () => {
            this.busy$.next(false);
            this.shouldRedirect = true;
          },
          error: () => {
            this.busy$.next(false);
            this.shouldRedirect = true;
          },
        });
    } else {
      this.shouldRedirect = false;
      this.next();
    }
  }

  showNewAddressForm(): void {
    this.addressFormOpened = true;
  }

  hideNewAddressForm(goPrevious: boolean = false): void {
    this.addressFormOpened = false;
    if (goPrevious) {
      this.back();
    }
  }

  next(): void {
    this.checkoutStepService.next(this.activatedRoute);
  }

  back(): void {
    this.checkoutStepService.back(this.activatedRoute);
  }
}
