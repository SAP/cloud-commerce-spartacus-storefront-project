import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActiveCartFacade } from '@spartacus/cart/main/root';
import {
  CheckoutDeliveryAddressClearedEvent,
  CheckoutDeliveryAddressCreatedEvent,
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryAddressSetEvent,
  CheckoutQueryFacade,
} from '@spartacus/checkout/base/root';
import {
  Address,
  Command,
  CommandService,
  CommandStrategy,
  EventService,
  OCC_USER_ID_ANONYMOUS,
  QueryState,
  UserActions,
  UserIdService,
} from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { CheckoutDeliveryAddressConnector } from '../connectors/checkout-delivery-address/checkout-delivery-address.connector';

@Injectable()
export class CheckoutDeliveryAddressService
  implements CheckoutDeliveryAddressFacade
{
  protected createDeliveryAddressCommand: Command<Address, unknown> =
    this.commandService.create<Address>(
      (payload) =>
        this.checkoutPreconditions().pipe(
          switchMap(([userId, cartId]) => {
            return this.checkoutDeliveryConnector
              .createAddress(userId, cartId, payload)
              .pipe(
                tap(() => {
                  if (userId !== OCC_USER_ID_ANONYMOUS) {
                    /**
                     * TODO:#deprecation-checkout We have to keep this here, since the user address feature is still ngrx-based.
                     * Remove once it is switched from ngrx to c&q.
                     * We should dispatch an event, which will reload the userAddress$ query.
                     */
                    this.store.dispatch(
                      new UserActions.LoadUserAddresses(userId)
                    );
                  }
                }),
                map((address) => {
                  address.titleCode = payload.titleCode;
                  if (payload.region?.isocodeShort) {
                    address.region = {
                      ...address.region,
                      isocodeShort: payload.region.isocodeShort,
                    };
                  }
                  return address;
                }),
                tap((address) =>
                  this.eventService.dispatch(
                    {
                      userId,
                      cartId,
                      address,
                    },
                    CheckoutDeliveryAddressCreatedEvent
                  )
                ),
                switchMap((address) => this.setDeliveryAddress(address))
              );
          })
        ),
      {
        strategy: CommandStrategy.CancelPrevious,
      }
    );

  protected setDeliveryAddressCommand: Command<Address, unknown> =
    this.commandService.create<Address>(
      (address) =>
        this.checkoutPreconditions().pipe(
          switchMap(([userId, cartId]) => {
            const addressId = address.id;
            if (!addressId) {
              throw new Error('Checkout conditions not met');
            }
            return this.checkoutDeliveryConnector
              .setAddress(userId, cartId, addressId)
              .pipe(
                tap(() => {
                  this.eventService.dispatch(
                    {
                      userId,
                      cartId,
                      address,
                    },
                    CheckoutDeliveryAddressSetEvent
                  );
                })
              );
          })
        ),
      {
        strategy: CommandStrategy.CancelPrevious,
      }
    );

  protected clearDeliveryAddressCommand: Command<void, unknown> =
    this.commandService.create<void>(
      () =>
        this.checkoutPreconditions().pipe(
          switchMap(([userId, cartId]) =>
            this.checkoutDeliveryConnector
              .clearCheckoutDeliveryAddress(userId, cartId)
              .pipe(
                tap(() => {
                  this.eventService.dispatch(
                    {
                      userId,
                      cartId,
                    },
                    CheckoutDeliveryAddressClearedEvent
                  );
                })
              )
          )
        ),
      {
        strategy: CommandStrategy.CancelPrevious,
      }
    );

  constructor(
    // TODO:#deprecation-checkout remove once all the occurrences are replaced with events
    protected store: Store<unknown>,
    protected activeCartFacade: ActiveCartFacade,
    protected userIdService: UserIdService,
    protected eventService: EventService,
    protected commandService: CommandService,
    protected checkoutDeliveryConnector: CheckoutDeliveryAddressConnector,
    protected checkoutQueryFacade: CheckoutQueryFacade
  ) {}

  /**
   * Performs the necessary checkout preconditions.
   */
  protected checkoutPreconditions(): Observable<[string, string]> {
    return combineLatest([
      this.userIdService.takeUserId(),
      this.activeCartFacade.takeActiveCartId(),
      this.activeCartFacade.isGuestCart(),
    ]).pipe(
      take(1),
      map(([userId, cartId, isGustCart]) => {
        if (
          !userId ||
          !cartId ||
          (userId === OCC_USER_ID_ANONYMOUS && !isGustCart)
        ) {
          throw new Error('Checkout conditions not met');
        }
        return [userId, cartId];
      })
    );
  }

  getDeliveryAddressState(): Observable<QueryState<Address | undefined>> {
    return this.checkoutQueryFacade.getCheckoutDetailsState().pipe(
      map((state) => ({
        ...state,
        data: state.data?.deliveryAddress,
      }))
    );
  }

  createAndSetAddress(address: Address): Observable<unknown> {
    return this.createDeliveryAddressCommand.execute(address);
  }

  setDeliveryAddress(address: Address): Observable<unknown> {
    return this.setDeliveryAddressCommand.execute(address);
  }

  clearCheckoutDeliveryAddress(): Observable<unknown> {
    return this.clearDeliveryAddressCommand.execute();
  }
}
