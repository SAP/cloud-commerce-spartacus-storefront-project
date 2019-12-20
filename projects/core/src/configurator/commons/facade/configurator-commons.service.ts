import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { ActiveCartService } from '../../../cart/facade/active-cart.service';
import { Cart } from '../../../model/cart.model';
import { Configurator } from '../../../model/configurator.model';
import { GenericConfigurator } from '../../../model/generic-configurator.model';
import {
  OCC_USER_ID_ANONYMOUS,
  OCC_USER_ID_CURRENT,
} from '../../../occ/utils/occ-constants';
import * as UiActions from '../store/actions/configurator-ui.action';
import * as ConfiguratorActions from '../store/actions/configurator.action';
import { StateWithConfiguration, UiState } from '../store/configuration-state';
import * as UiSelectors from '../store/selectors/configurator-ui.selector';
import * as ConfiguratorSelectors from '../store/selectors/configurator.selector';

@Injectable()
export class ConfiguratorCommonsService {
  constructor(
    protected store: Store<StateWithConfiguration>,
    protected activeCartService: ActiveCartService
  ) {}

  hasConfiguration(owner: GenericConfigurator.Owner): Observable<Boolean> {
    return this.store.pipe(
      select(ConfiguratorSelectors.getConfigurationFactory(owner.key)),
      map(configuration => this.isConfigurationCreated(configuration))
    );
  }

  getConfiguration(
    owner: GenericConfigurator.Owner
  ): Observable<Configurator.Configuration> {
    return this.store.pipe(
      select(ConfiguratorSelectors.getConfigurationFactory(owner.key)),
      filter(configuration => this.isConfigurationCreated(configuration))
    );
  }

  getOrCreateConfiguration(
    owner: GenericConfigurator.Owner
  ): Observable<Configurator.Configuration> {
    return this.store.pipe(
      select(ConfiguratorSelectors.getConfigurationStateFactory(owner.key)),
      tap(configurationState => {
        if (
          !this.isConfigurationCreated(configurationState.value) &&
          configurationState.loading !== true
        ) {
          if (owner.type === GenericConfigurator.OwnerType.PRODUCT) {
            this.store.dispatch(
              new ConfiguratorActions.CreateConfiguration(owner.key, owner.id)
            );
          } else {
            this.store.dispatch(
              new ConfiguratorActions.LoadCartEntryConfiguration(
                owner.key,
                owner.id
              )
            );
          }
        }
      }),
      filter(configurationState =>
        this.isConfigurationCreated(configurationState.value)
      ),
      map(configurationState => configurationState.value)
    );
  }

  updateConfiguration(
    ownerKey: string,
    groupId: string,
    changedAttribute: Configurator.Attribute
  ): void {
    this.store
      .pipe(
        select(ConfiguratorSelectors.getConfigurationFactory(ownerKey)),
        take(1)
      )
      .subscribe(configuration => {
        this.store.dispatch(
          new ConfiguratorActions.UpdateConfiguration(
            this.createConfigurationExtract(
              groupId,
              changedAttribute,
              configuration
            )
          )
        );
      });
  }

  getConfigurationWithOverview(configuration: Configurator.Configuration) {
    this.store.dispatch(
      new ConfiguratorActions.GetConfigurationOverview(configuration)
    );

    return this.store.pipe(
      select(
        ConfiguratorSelectors.getConfigurationFactory(configuration.owner.key)
      )
    );
  }

  getOrCreateUiState(owner: GenericConfigurator.Owner): Observable<UiState> {
    return this.store.pipe(
      select(UiSelectors.getUiStateForProduct(owner.key)),
      tap(uiState => {
        if (!this.isUiStateCreated(uiState)) {
          this.store.dispatch(new UiActions.CreateUiState(owner.key));
        }
      }),
      filter(uiState => this.isUiStateCreated(uiState))
    );
  }

  getUiState(owner: GenericConfigurator.Owner): Observable<UiState> {
    return this.store.pipe(
      select(UiSelectors.getUiStateForProduct(owner.key)),
      filter(uiState => this.isUiStateCreated(uiState))
    );
  }

  setUiState(owner: GenericConfigurator.Owner, state: UiState) {
    this.store.dispatch(new UiActions.SetUiState(owner.key, state));
  }

  removeUiState(owner: GenericConfigurator.Owner) {
    this.store.dispatch(new UiActions.RemoveUiState(owner.key));
  }

  removeConfiguration(owner: GenericConfigurator.Owner) {
    this.store.dispatch(new ConfiguratorActions.RemoveConfiguration(owner.key));
  }

  addToCart(productCode: string, configId: string, ownerKey: string) {
    this.activeCartService.requireLoadedCart().subscribe(cartState => {
      const addToCartParameters: Configurator.AddToCartParameters = {
        userId: this.getUserId(cartState.value),
        cartId: this.getCartId(cartState.value),
        productCode: productCode,
        quantity: 1,
        configId: configId,
        ownerKey: ownerKey,
      };
      this.store.dispatch(
        new ConfiguratorActions.AddToCart(addToCartParameters)
      );
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

  isUiStateCreated(uiState: UiState): boolean {
    return uiState !== undefined;
  }

  isConfigurationCreated(configuration: Configurator.Configuration): boolean {
    return (
      configuration !== undefined &&
      configuration.configId !== undefined &&
      configuration.configId.length !== 0
    );
  }

  createConfigurationExtract(
    groupId: string,
    changedAttribute: Configurator.Attribute,
    configuration: Configurator.Configuration
  ): Configurator.Configuration {
    const newConfiguration: Configurator.Configuration = {
      configId: configuration.configId,
      groups: [],
      owner: configuration.owner,
    };

    const groupPath: Configurator.Group[] = [];
    this.buildGroupPath(groupId, configuration.groups, groupPath);
    const groupPathLength = groupPath.length;
    if (groupPathLength === 0) {
      throw new Error(
        'At this point we expect that group is available in the configuration: ' +
          groupId +
          ', ' +
          JSON.stringify(configuration.groups.map(cGroup => cGroup.id))
      );
    }
    let currentGroupInExtract: Configurator.Group = this.buildGroupForExtract(
      groupPath[groupPathLength - 1]
    );
    let currentLeafGroupInExtract: Configurator.Group = currentGroupInExtract;
    newConfiguration.groups.push(currentGroupInExtract);

    for (let index = groupPath.length - 1; index > 0; index--) {
      currentLeafGroupInExtract = this.buildGroupForExtract(
        groupPath[index - 1]
      );
      currentGroupInExtract.subGroups = [currentLeafGroupInExtract];
      currentGroupInExtract = currentLeafGroupInExtract;
    }

    currentLeafGroupInExtract.attributes = [changedAttribute];
    return newConfiguration;
  }

  buildGroupForExtract(group: Configurator.Group): Configurator.Group {
    const changedGroup: Configurator.Group = {
      groupType: group.groupType,
      id: group.id,
    };
    return changedGroup;
  }

  buildGroupPath(
    groupId: string,
    groupList: Configurator.Group[],
    groupPath: Configurator.Group[]
  ): boolean {
    let haveFoundGroup = false;
    const group: Configurator.Group = groupList.find(
      currentGroup => currentGroup.id === groupId
    );

    if (group) {
      groupPath.push(group);
      haveFoundGroup = true;
    } else {
      groupList
        .filter(currentGroup => currentGroup.subGroups)
        .forEach(currentGroup => {
          if (this.buildGroupPath(groupId, currentGroup.subGroups, groupPath)) {
            groupPath.push(currentGroup);
            haveFoundGroup = true;
          }
        });
    }
    return haveFoundGroup;
  }
}
