import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Configurator,
  ConfiguratorCartService,
  ConfiguratorCommonsService,
  ConfiguratorGroupsService,
  GenericConfigurator,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
} from '@spartacus/core';
import {
  ConfigRouterExtractorService,
  ConfigurationRouter,
} from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'cx-config-add-to-cart-button',
  templateUrl: './config-add-to-cart-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigAddToCartButtonComponent {
  routerData$: Observable<
    ConfigurationRouter.Data
  > = this.configRouterExtractorService.extractRouterData();

  configuration$: Observable<
    Configurator.Configuration
  > = this.routerData$.pipe(
    switchMap((routerData) =>
      this.configuratorCommonsService.getConfiguration(routerData.owner)
    )
  );

  constructor(
    protected routingService: RoutingService,
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configuratorCartService: ConfiguratorCartService,
    protected configuratorGroupsService: ConfiguratorGroupsService,
    protected configRouterExtractorService: ConfigRouterExtractorService,
    protected globalMessageService: GlobalMessageService
  ) {}

  protected navigateToCart(): void {
    this.routingService.go('cart');
  }

  protected navigateToOverview(
    configuratorType: string,
    owner: GenericConfigurator.Owner
  ): void {
    this.routingService.go(
      'configureOverview' +
        configuratorType +
        '/cartEntry/entityKey/' +
        owner.id,
      {}
    );
  }

  protected displayConfirmationMessage(key: string): void {
    this.globalMessageService.add(
      { key: key },
      GlobalMessageType.MSG_TYPE_CONFIRMATION
    );
  }

  /**
   * Performs the navigation to the corresponding location (cart or overview pages).
   *
   * @param {string} configuratorType - Configurator type
   * @param {GenericConfigurator.Owner} owner - Owner
   * @param {boolean} isAdd - Is add to cart
   * @param {boolean} isOverview - Is overview page
   * @param {boolean} showMessage - Show message
   */
  performNavigation(
    configuratorType: string,
    owner: GenericConfigurator.Owner,
    isAdd: boolean,
    isOverview: boolean,
    showMessage: boolean
  ): void {
    const messageKey = isAdd
      ? 'configurator.addToCart.confirmation'
      : 'configurator.addToCart.confirmationUpdate';
    if (isOverview) {
      this.navigateToCart();
    } else {
      this.navigateToOverview(configuratorType, owner);
    }
    if (showMessage) {
      this.displayConfirmationMessage(messageKey);
    }
  }

  /**
   * Decides on the resource key for the button. Depending on the business process (owner of the configuration) and the
   * need for a cart update, the text will differ
   * @param {ConfigurationRouter.Data} routerData - Reflects the current router state
   * @param {Configurator.Configuration} configuration - Configuration
   * @returns {string} The resource key that controls the button description
   */
  getButtonResourceKey(
    routerData: ConfigurationRouter.Data,
    configuration: Configurator.Configuration
  ): string {
    if (
      routerData.isOwnerCartEntry &&
      configuration.isCartEntryUpdateRequired
    ) {
      return 'configurator.addToCart.buttonUpdateCart';
    } else if (
      routerData.isOwnerCartEntry &&
      !configuration.isCartEntryUpdateRequired
    ) {
      return 'configurator.addToCart.buttonAfterAddToCart';
    } else {
      return 'configurator.addToCart.button';
    }
  }

  /**
   * Triggers action and navigation, both depending on the context. Might result in an addToCart, updateCartEntry,
   * just a cart navigation or a browser back navigation
   * @param {Configurator.Configuration} configuration - Configuration
   * @param {ConfigurationRouter.Data} routerData - Reflects the current router state

   */
  onAddToCart(
    configuration: Configurator.Configuration,
    routerData: ConfigurationRouter.Data
  ): void {
    const pageType = routerData.pageType;
    const configuratorType = routerData.configuratorType;
    const isOverview = pageType === ConfigurationRouter.PageType.OVERVIEW;
    const isOwnerCartEntry =
      routerData.owner.type === GenericConfigurator.OwnerType.CART_ENTRY;
    const owner = configuration.owner;

    this.configuratorGroupsService.setGroupStatus(
      configuration.owner,
      configuration.interactionState.currentGroup,
      true
    );

    if (isOwnerCartEntry) {
      if (configuration.isCartEntryUpdateRequired) {
        this.configuratorCartService.updateCartEntry(configuration);
      }
      this.performNavigation(
        configuratorType,
        owner,
        false,
        isOverview,
        configuration.isCartEntryUpdateRequired
      );
      if (configuration.isCartEntryUpdateRequired) {
        this.configuratorCommonsService.removeConfiguration(owner);
      }
    } else {
      this.configuratorCartService.addToCart(
        owner.id,
        configuration.configId,
        owner.key
      );

      this.configuratorCommonsService
        .getConfiguration(owner)
        .pipe(
          filter(
            (configWithNextOwner) => configWithNextOwner.nextOwner !== undefined
          ),
          take(1)
        )
        .subscribe((configWithNextOwner) => {
          this.performNavigation(
            configuratorType,
            configWithNextOwner.nextOwner,
            true,
            isOverview,
            true
          );
          this.configuratorCommonsService.removeConfiguration(owner);
        });
    }
  }
}
