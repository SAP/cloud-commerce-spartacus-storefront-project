/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartConfigService } from '@spartacus/cart/base/core';
import {
  ActiveCartFacade,
  Cart,
  EntryGroup,
  OrderEntry,
  PromotionLocation,
  SelectiveCartFacade,
} from '@spartacus/cart/base/root';
import { AuthService, RoutingService } from '@spartacus/core';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-cart-details',
  templateUrl: './cart-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDetailsComponent implements OnInit {
  cart$: Observable<Cart>;
  entries$: Observable<OrderEntry[]>;
  entryGroups$: Observable<EntryGroup[]>;
  bundles$: Observable<EntryGroup[]>;
  cartLoaded$: Observable<boolean>;
  loggedIn = false;
  promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;
  selectiveCartEnabled: boolean;

  // TODO: Remove, for testing only
  editingBundle$ = this.routeService.queryParams.pipe(
    map((params) => {
      return !!params.edit;
    })
  );

  constructor(
    protected activeCartService: ActiveCartFacade,
    protected selectiveCartService: SelectiveCartFacade,
    protected authService: AuthService,
    protected routingService: RoutingService,
    protected cartConfig: CartConfigService,
    // TODO: Remove, for testing only
    protected routeService: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cart$ = this.activeCartService.getActive();

    this.entryGroups$ = this.activeCartService
      .getEntryGroups()
      .pipe(filter((groups) => groups.length > 0));

    this.bundles$ = this.entryGroups$.pipe(
      map((entryGroups) =>
        entryGroups
          .filter((group) => Boolean(group.entryGroups?.length))
          .map((entryGroup) => ({
            ...entryGroup,
            entries: entryGroup.entryGroups?.reduce<OrderEntry[]>(
              (acc, curr) => [...acc, ...(curr.entries ?? [])],
              []
            ),
          }))
      )
    );

    this.entries$ = this.entryGroups$.pipe(
      map((entryGroups) =>
        entryGroups
          .filter((group) => !group.entryGroups?.length)
          .reduce<OrderEntry[]>(
            (acc, curr) => [...acc, ...(curr.entries ?? [])],
            []
          )
      )
    );

    this.entryGroups$ = this.activeCartService
      .getEntryGroups()
      .pipe(filter((groups) => groups.length > 0));

    this.bundles$ = this.entryGroups$.pipe(
      map((entryGroups) =>
        entryGroups
          .filter((group) => Boolean(group.entryGroups?.length))
          .map((entryGroup) => ({
            ...entryGroup,
            entries: entryGroup.entryGroups?.reduce<OrderEntry[]>(
              (acc, curr) => [...acc, ...(curr.entries ?? [])],
              []
            ),
          }))
      )
    );

    this.entries$ = this.entryGroups$.pipe(
      map((entryGroups) =>
        entryGroups
          .filter((group) => !group.entryGroups?.length)
          .reduce<OrderEntry[]>(
            (acc, curr) => [...acc, ...(curr.entries ?? [])],
            []
          )
      )
    );

    this.selectiveCartEnabled = this.cartConfig.isSelectiveCartEnabled();

    this.cartLoaded$ = combineLatest([
      this.activeCartService.isStable(),
      this.selectiveCartEnabled
        ? this.selectiveCartService.isStable()
        : of(false),
      this.authService.isUserLoggedIn(),
    ]).pipe(
      tap(([, , loggedIn]) => (this.loggedIn = loggedIn)),
      map(([cartLoaded, sflLoaded, loggedIn]) =>
        loggedIn && this.selectiveCartEnabled
          ? cartLoaded && sflLoaded
          : cartLoaded
      )
    );
  }

  saveForLater(item: OrderEntry) {
    if (this.loggedIn) {
      this.activeCartService.removeEntry(item);
      this.selectiveCartService.addEntry(
        item.product?.code ?? '',
        item.quantity ?? 0
      );
    } else {
      this.routingService.go({ cxRoute: 'login' });
    }
  }
}
