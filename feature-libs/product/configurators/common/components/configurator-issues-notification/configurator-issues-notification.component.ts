import { Component, Optional } from '@angular/core';
import { GenericConfiguratorUtilsService, OrderEntry } from '@spartacus/core';
import { CartItemContext, ICON_TYPE } from '@spartacus/storefront';

@Component({
  selector: 'cx-configurator-issues-notification',
  templateUrl: './configurator-issues-notification.component.html',
})
export class ConfiguratorIssuesNotificationComponent {
  iconTypes = ICON_TYPE;

  constructor(
    protected genericConfigUtilsService: GenericConfiguratorUtilsService,
    @Optional()
    public cartItemContext?: CartItemContext
  ) {}

  /**
   * Verifies whether the item has any issues.
   *
   * @returns {boolean} - whether there are any issues
   */
  hasIssues(item: OrderEntry): boolean {
    return this.genericConfigUtilsService.hasIssues(item);
  }

  /**
   * Retrieves the number of issues at the cart item.
   *
   * @returns {number} - the number of issues at the cart item
   */
  getNumberOfIssues(item: OrderEntry): number {
    return this.genericConfigUtilsService.getNumberOfIssues(item);
  }
}
