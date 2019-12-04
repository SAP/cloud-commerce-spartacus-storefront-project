import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CartService } from '../../../cart/facade/cart.service';
import { Cart } from '../../../model/cart.model';
import { ConfiguratorTextfield } from '../../../model/configurator-textfield.model';
import {
  OCC_USER_ID_ANONYMOUS,
  OCC_USER_ID_CURRENT,
} from '../../../occ/utils/occ-constants';
import * as ConfiguratorActions from '../store/actions/configurator-textfield.action';
import { StateWithConfigurationTextfield } from '../store/configuration-textfield-state';
import * as ConfiguratorSelectors from '../store/selectors/configurator-textfield.selector';

const SUCCESS_STATUS = 'SUCCESS';

@Injectable()
export class ConfiguratorTextfieldService {
  constructor(
    protected store: Store<StateWithConfigurationTextfield>,
    protected cartService: CartService
  ) {}

  createConfiguration(
    productCode: string
  ): Observable<ConfiguratorTextfield.Configuration> {
    this.store.dispatch(
      new ConfiguratorActions.CreateConfiguration({
        productCode: productCode,
      })
    );

    return this.store.select(ConfiguratorSelectors.getConfigurationContent);
  }

  updateConfiguration(
    changedAttribute: ConfiguratorTextfield.ConfigurationInfo
  ): void {
    this.store
      .pipe(
        select(ConfiguratorSelectors.getConfigurationContent),
        take(1)
      )
      .subscribe(oldConfiguration => {
        this.store.dispatch(
          new ConfiguratorActions.UpdateConfiguration(
            this.createNewConfigurationWithChange(
              changedAttribute,
              oldConfiguration
            )
          )
        );
      });
  }

  addToCart(productCode: string) {
    const cart$ = this.cartService.getOrCreateCart();
    cart$.pipe(take(1)).subscribe(cart => {
      const addToCartParameters: ConfiguratorTextfield.AddToCartParameters = {
        userId: this.getUserId(cart),
        cartId: this.getCartId(cart),
        productCode: productCode,
        quantity: 1,
      };
      this.callAddToCartActionWithConfigurationData(addToCartParameters);
    });
  }

  ////
  // Helper methods
  ////
  getCartId(cart: Cart): string {
    return cart.user.uid === OCC_USER_ID_ANONYMOUS ? cart.guid : cart.code;
  }

  getUserId(cart: Cart): string {
    return cart.user.uid === OCC_USER_ID_ANONYMOUS
      ? cart.user.uid
      : OCC_USER_ID_CURRENT;
  }

  callAddToCartActionWithConfigurationData(
    addToCartParameters: ConfiguratorTextfield.AddToCartParameters
  ): void {
    this.store
      .pipe(
        select(ConfiguratorSelectors.getConfigurationContent),
        take(1)
      )
      .subscribe(configuration => {
        addToCartParameters.configuration = configuration;
        this.store.dispatch(
          new ConfiguratorActions.AddToCart(addToCartParameters)
        );
      });
  }

  createNewConfigurationWithChange(
    changedAttribute: ConfiguratorTextfield.ConfigurationInfo,
    oldConfiguration: ConfiguratorTextfield.Configuration
  ): ConfiguratorTextfield.Configuration {
    const newConfiguration: ConfiguratorTextfield.Configuration = {
      configurationInfos: [],
    };
    oldConfiguration.configurationInfos.forEach(info => {
      if (info.configurationLabel === changedAttribute.configurationLabel) {
        changedAttribute.status = SUCCESS_STATUS;
        newConfiguration.configurationInfos.push(changedAttribute);
      } else {
        newConfiguration.configurationInfos.push(info);
      }
    });
    return newConfiguration;
  }
}
