/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Params } from '@angular/router';
import { ActiveCartFacade, OrderEntry } from '@spartacus/cart/base/root';

import { map } from 'rxjs/operators';
import { CommonConfigurator } from '../../core/model/common-configurator.model';
import { CommonConfiguratorUtilsService } from '../../shared/utils/common-configurator-utils.service';

@Component({
  selector: 'cx-configure-cart-entry',
  templateUrl: './configure-cart-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureCartEntryComponent {
  protected activeCartFacade = inject(ActiveCartFacade);

  activeCartCode$ = this.activeCartFacade
    .getActive()
    .pipe(map((cart) => cart.code));

  protected static readonly ERROR_MESSAGE_ENTRY_INCONSISTENT =
    "We don't expect order and quote code defined at the same time";
  @Input() cartEntry: OrderEntry;
  @Input() readOnly: boolean;
  @Input() msgBanner: boolean;
  @Input() disabled: boolean;

  /**
   * Verifies whether the entry has any issues.
   *
   * @returns - whether there are any issues
   */
  hasIssues(): boolean {
    return this.commonConfigUtilsService.hasIssues(this.cartEntry);
  }

  /**
   * Retrieves owner for an entry (can be part of cart, order or quote)
   *
   * @returns - an owner type
   */
  getOwnerType(): CommonConfigurator.OwnerType {
    return this.getOwnerTypeInternal(true);
  }

  /**
   * Determines owner for an entry (can be part of cart, order or quote)
   * @param cartCode Code of active cart
   * @returns - an owner type
   */
  getOwnerTypeKnowingActiveCart(
    cartCode: string
  ): CommonConfigurator.OwnerType {
    return this.getOwnerTypeInternal(this.isActiveCart(cartCode));
  }

  /**
   * Verifies whether the cart entry has an order code, retrieves a composed owner ID
   * and concatenates a corresponding entry number.
   *
   * @returns - an entry key
   */
  getEntityKey(): string {
    return this.getEntityKeyInternal(true);
  }

  /**
   * Verifies whether the cart entry has an order code, retrieves a composed owner ID
   * and concatenates a corresponding entry number.
   * @param cartCode Code of active cart
   * @returns - an entry key
   */
  getEntityKeyKnowingActiveCart(cartCode: string): string {
    return this.getEntityKeyInternal(this.isActiveCart(cartCode));
  }

  protected isActiveCart(cartCode: string): boolean {
    return cartCode === this.cartEntry.savedCartCode;
  }

  protected getOwnerTypeInternal(
    readOnlyCartIsActive: boolean
  ): CommonConfigurator.OwnerType {
    if (this.cartEntry.orderCode) {
      return CommonConfigurator.OwnerType.ORDER_ENTRY;
    } else if (this.readOnly && this.cartEntry.quoteCode) {
      return CommonConfigurator.OwnerType.QUOTE_ENTRY;
    } else if (this.readOnly && !readOnlyCartIsActive) {
      return CommonConfigurator.OwnerType.SAVED_CART_ENTRY;
    } else {
      return CommonConfigurator.OwnerType.CART_ENTRY;
    }
  }

  protected getEntityKeyInternal(readOnlyCartIsActive: boolean): string {
    const entryNumber = this.cartEntry.entryNumber;
    if (entryNumber === undefined) {
      throw new Error('No entryNumber present in entry');
    }
    let code;
    if (this.cartEntry.orderCode) {
      code = this.cartEntry.orderCode;
    } else if (this.readOnly && this.cartEntry.quoteCode) {
      code = this.cartEntry.quoteCode;
    } else if (this.readOnly && !readOnlyCartIsActive) {
      code = this.cartEntry.savedCartCode;
    }
    return code
      ? this.commonConfigUtilsService.getComposedOwnerId(code, entryNumber)
      : entryNumber.toString();
  }

  /**
   * Retrieves a document code in case the entry is order or quote bound. In this case the code
   * represents order or quote ID
   * @returns Document code if order or quote bound, undefined in other cases
   */
  protected getCode(): string | undefined {
    if (this.isReadOnly()) {
      if (this.cartEntry.orderCode) {
        return this.cartEntry.orderCode;
      } else if (this.cartEntry.quoteCode) {
        return this.cartEntry.quoteCode;
      } else {
        return this.cartEntry.savedCartCode;
      }
    } else {
      return undefined;
    }
  }

  protected isReadOnly(): boolean {
    return this.cartEntry.quoteCode ||
      this.cartEntry.orderCode ||
      this.cartEntry.savedCartCode
      ? this.readOnly
      : false;
  }

  /**
   * Retrieves a corresponding route depending whether the configuration is read only or not.
   *
   * @returns - a route
   */
  getRoute(): string {
    const configuratorType = this.cartEntry.product?.configuratorType;
    return this.readOnly
      ? 'configureOverview' + configuratorType
      : 'configure' + configuratorType;
  }

  /**
   * Retrieves the state of the configuration.
   *
   *  @returns - 'true' if the configuration is read only, otherwise 'false'
   */
  getDisplayOnly(): boolean {
    return this.readOnly;
  }

  /**
   * Verifies whether the link to the configuration is disabled.
   *
   *  @returns - 'true' if the the configuration is not read only, otherwise 'false'
   */
  isDisabled() {
    return this.readOnly ? false : this.disabled;
  }

  /**
   * Retrieves the additional resolve issues accessibility description.
   *
   * @returns - If there is a 'resolve issues' link, the ID to the element with additional description will be returned.
   */
  getResolveIssuesA11yDescription(): string | undefined {
    const errorMsgId = 'cx-error-msg-' + this.cartEntry.entryNumber;
    return !this.readOnly && this.msgBanner ? errorMsgId : undefined;
  }

  /**
   * Compiles query parameters for the router link. 'resolveIssues' is only set if the component is
   * rendered in the context of the message banner, and if issues exist at all
   * @returns Query parameters
   */
  getQueryParams(): Params {
    return {
      forceReload: true,
      resolveIssues: this.msgBanner && this.hasIssues(),
    };
  }

  constructor(
    protected commonConfigUtilsService: CommonConfiguratorUtilsService
  ) {}
}
