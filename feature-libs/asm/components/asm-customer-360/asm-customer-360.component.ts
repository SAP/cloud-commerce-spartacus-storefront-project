/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AsmConfig, getAsmDialogActionEvent } from '@spartacus/asm/core';
import {
  Asm360Facade,
  AsmCustomer360Data,
  AsmCustomer360Response,
  AsmCustomer360TabConfig,
  AsmDialogActionEvent,
  AsmDialogActionType,
} from '@spartacus/asm/root';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { SavedCartFacade } from '@spartacus/cart/saved-cart/root';
import { UrlCommand, User } from '@spartacus/core';
import { OrderHistoryFacade, OrderHistoryList } from '@spartacus/order/root';
import {
  DirectionMode,
  DirectionService,
  FocusConfig,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import { Observable, of, Subscription } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cx-asm-customer-360',
  templateUrl: './asm-customer-360.component.html',
})
export class AsmCustomer360Component
  implements OnDestroy, OnInit, AfterViewInit
{
  @HostBinding('attr.role') role = 'dialog';
  @HostBinding('attr.aria-modal') modal = true;
  @HostBinding('attr.aria-labelledby') labelledby = 'asm-customer-360-title';
  @HostBinding('attr.aria-describedby') describedby = 'asm-customer-360-desc';
  @ViewChildren('tabHeaderItem') tabHeaderItems: QueryList<
    ElementRef<HTMLElement>
  >;
  readonly cartIcon = ICON_TYPE.CART;
  readonly closeIcon = ICON_TYPE.CLOSE;
  readonly orderIcon = ICON_TYPE.ORDER;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: '.cx-tab-header.active',
    focusOnEscape: true,
  };

  tabs: Array<AsmCustomer360TabConfig>;
  activeTab = 0;
  currentTab: AsmCustomer360TabConfig;

  customer: User;

  customer360Tabs$: Observable<Array<AsmCustomer360Data | undefined>>;

  activeCart$: Observable<Cart | undefined>;
  savedCarts$: Observable<Array<Cart>>;
  orderHistory$: Observable<OrderHistoryList>;

  protected readonly ORDER_LIMIT = 100;
  protected subscription = new Subscription();

  constructor(
    protected asmConfig: AsmConfig,
    protected asm360Facade: Asm360Facade,
    protected injector: Injector,
    protected launchDialogService: LaunchDialogService,
    protected activeCartFacade: ActiveCartFacade,
    protected orderHistoryFacade: OrderHistoryFacade,
    protected savedCartFacade: SavedCartFacade,
    protected directionService: DirectionService
  ) {
    this.tabs = asmConfig.asm?.customer360?.tabs ?? [];
    this.currentTab = this.tabs[0];

    this.activeCart$ = this.activeCartFacade
      .getActive()
      .pipe(map((cart) => (cart.totalItems ? cart : undefined)));
    this.orderHistory$ = this.orderHistoryFacade
      .getOrderHistoryList(this.ORDER_LIMIT)
      .pipe(map((orderHistory) => orderHistory ?? {}));
    this.savedCarts$ = this.savedCartFacade.getList().pipe(shareReplay(1));
  }

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        const customer: User = data.customer;

        this.customer = customer;
      })
    );

    this.setTabData();
  }

  ngAfterViewInit(): void {
    this.updateTabIndex(this.activeTab);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectTab(selectedTab: number): void {
    this.activeTab = selectedTab;
    this.currentTab = this.tabs[selectedTab];
    this.updateTabIndex(selectedTab);
    this.setTabData();
  }
  /**
   *  update tab focus when key is pressed
   * @param {KeyboardEvent} event
   * @param {number} selectedIndex current tab index
   */
  switchTab(event: KeyboardEvent, selectedIndex: number): void {
    const maxTab = this.tabs.length - 1;
    let flag = true;
    if (this.isBackNavigation(event)) {
      selectedIndex--;
      if (selectedIndex < 0) {
        selectedIndex = maxTab;
      }
    } else if (this.isForwardsNavigation(event)) {
      selectedIndex++;
      if (selectedIndex > maxTab) {
        selectedIndex = 0;
      }
    } else if (event.code === 'Home') {
      selectedIndex = 0;
    } else if (event.code === 'End') {
      selectedIndex = maxTab;
    } else {
      flag = false;
    }
    if (flag) {
      this.updateTabIndex(selectedIndex);
      event.stopPropagation();
      event.preventDefault();
    }
  }

  getAvatar(): string {
    const customer = this.customer ?? {};
    const { firstName = '', lastName = '' } = customer;

    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  /**
   * If there is a link within the modal, use this method to redirect the user and close the modal.
   */
  navigateTo(route: UrlCommand): void {
    const event: AsmDialogActionEvent = getAsmDialogActionEvent(
      this.customer,
      AsmDialogActionType.NAVIGATE,
      route
    );
    this.closeModal(event);
  }

  closeModal(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }

  /**
   * Update tabIndex for each tab: select tab becomes 0 and other tabs will be -1
   * this is for prevent tabbing within tabs
   * @param {number} selectedIndex - selected tab index
   */
  protected updateTabIndex(selectedIndex: number): void {
    this.tabHeaderItems.toArray().forEach((tabHeaderItem, index) => {
      if (index === selectedIndex) {
        tabHeaderItem.nativeElement.tabIndex = 0;
        tabHeaderItem.nativeElement.focus();
      } else {
        tabHeaderItem.nativeElement.tabIndex = -1;
      }
    });
  }

  protected setTabData(): void {
    const get360Data =
      this.asm360Facade.get360Data(this.activeTab) ?? of(undefined);

    this.customer360Tabs$ = get360Data.pipe(
      filter((response) => Boolean(response)),
      map((response) => {
        return this.currentTab.components.map((component) => {
          const requestData = component.requestData;

          if (requestData) {
            return (response as AsmCustomer360Response).value.find(
              (data) => data.type === requestData.type
            );
          } else {
            return undefined;
          }
        });
      })
    );
  }
  /**
   * Verifies whether the user navigates into a subgroup of the main group menu.
   *
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {boolean} -'true' if the user navigates into the subgroup, otherwise 'false'.
   * @protected
   */
  protected isForwardsNavigation(event: KeyboardEvent): boolean {
    return (
      (event.code === 'ArrowRight' && this.isLTRDirection()) ||
      (event.code === 'ArrowLeft' && this.isRTLDirection())
    );
  }

  /**
   * Verifies whether the user navigates from a subgroup back to the main group menu.
   *
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {boolean} -'true' if the user navigates back into the main group menu, otherwise 'false'.
   * @protected
   */
  protected isBackNavigation(event: KeyboardEvent): boolean {
    return (
      (event.code === 'ArrowLeft' && this.isLTRDirection()) ||
      (event.code === 'ArrowRight' && this.isRTLDirection())
    );
  }
  protected isLTRDirection(): boolean {
    return this.directionService.getDirection() === DirectionMode.LTR;
  }

  protected isRTLDirection(): boolean {
    return this.directionService.getDirection() === DirectionMode.RTL;
  }
}
