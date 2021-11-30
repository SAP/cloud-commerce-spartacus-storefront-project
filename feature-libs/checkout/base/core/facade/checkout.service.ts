import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CheckoutFacade,
  OrderPlacedEvent,
} from '@spartacus/checkout/base/root';
import {
  ActiveCartService,
  CartActions,
  Command,
  CommandService,
  CommandStrategy,
  EventService,
  OCC_USER_ID_ANONYMOUS,
  Order,
  StateWithMultiCart,
  UserIdService,
} from '@spartacus/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { CheckoutConnector } from '../connectors/checkout/checkout.connector';

@Injectable()
export class CheckoutService implements CheckoutFacade {
  protected order$ = new BehaviorSubject<Order | undefined>(undefined);

  protected placeOrderCommand: Command<boolean, Order> =
    this.commandService.create<boolean, Order>(
      (payload) =>
        this.checkoutPreconditions().pipe(
          switchMap(([userId, cartId]) =>
            this.checkoutConnector.placeOrder(userId, cartId, payload).pipe(
              tap((order) => {
                this.order$.next(order);
                /**
                 * TODO:#deprecation-checkout We have to keep this here, since the cart feature is still ngrx-based.
                 * Remove once it is switched from ngrx to c&q.
                 * We should dispatch an event, which will load the cart$ query.
                 */
                this.store.dispatch(new CartActions.RemoveCart({ cartId }));
                this.eventService.dispatch(
                  {
                    userId,
                    cartId,
                    order,
                  },
                  OrderPlacedEvent
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
    protected store: Store<StateWithMultiCart>,
    protected activeCartService: ActiveCartService,
    protected userIdService: UserIdService,
    protected commandService: CommandService,
    protected checkoutConnector: CheckoutConnector,
    protected eventService: EventService
  ) {}

  /**
   * Performs the necessary checkout preconditions.
   */
  protected checkoutPreconditions(): Observable<[string, string]> {
    return combineLatest([
      this.userIdService.takeUserId(),
      this.activeCartService.takeActiveCartId(),
    ]).pipe(
      take(1),
      map(([userId, cartId]) => {
        if (
          !userId ||
          !cartId ||
          (userId === OCC_USER_ID_ANONYMOUS &&
            !this.activeCartService.isGuestCart())
        ) {
          throw new Error('Checkout conditions not met');
        }
        return [userId, cartId];
      })
    );
  }

  placeOrder(termsChecked: boolean): Observable<Order> {
    return this.placeOrderCommand.execute(termsChecked);
  }

  getOrder(): Observable<Order | undefined> {
    return this.order$.asObservable();
  }

  clearOrder(): void {
    this.order$.next(undefined);
  }

  setOrder(order: Order): void {
    this.order$.next(order);
  }
}
