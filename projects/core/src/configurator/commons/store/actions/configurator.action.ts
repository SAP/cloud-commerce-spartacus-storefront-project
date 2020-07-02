import { Action } from '@ngrx/store';
import { MULTI_CART_DATA } from '../../../../cart/store/multi-cart-state';
import { Configurator } from '../../../../model/configurator.model';
import { GenericConfigurator } from '../../../../model/generic-configurator.model';
import { StateUtils } from '../../../../state/utils';
import { EntityProcessesIncrementAction } from '../../../../state/utils/entity-processes-loader/entity-processes-loader.action';
import { CONFIGURATION_DATA } from '../configuration-state';

export const CREATE_CONFIGURATION = '[Configurator] Create Configuration';
export const CREATE_CONFIGURATION_FAIL =
  '[Configurator] Create Configuration Fail';
export const CREATE_CONFIGURATION_SUCCESS =
  '[Configurator] Create Configuration Sucess';
export const READ_CONFIGURATION = '[Configurator] Read Configuration';
export const READ_CONFIGURATION_FAIL = '[Configurator] Read Configuration Fail';
export const READ_CONFIGURATION_SUCCESS =
  '[Configurator] Read Configuration Sucess';
export const READ_CART_ENTRY_CONFIGURATION =
  '[Configurator] Read Cart Entry Configuration';
export const READ_CART_ENTRY_CONFIGURATION_SUCCESS =
  '[Configurator] Read Cart Entry Configuration Success';
export const READ_CART_ENTRY_CONFIGURATION_FAIL =
  '[Configurator] Read Cart Entry Configuration Fail';
export const READ_ORDER_ENTRY_CONFIGURATION =
  '[Configurator] Read Order Entry Configuration';
export const READ_ORDER_ENTRY_CONFIGURATION_SUCCESS =
  '[Configurator] Read Order Entry Configuration Success';
export const READ_ORDER_ENTRY_CONFIGURATION_FAIL =
  '[Configurator] Read Order Entry Configuration Fail';
export const UPDATE_CONFIGURATION = '[Configurator] Update Configuration';
export const UPDATE_CONFIGURATION_FAIL =
  '[Configurator] Update Configuration Fail';
export const UPDATE_CONFIGURATION_SUCCESS =
  '[Configurator] Update Configuration Success';

export const UPDATE_CONFIGURATION_FINALIZE_SUCCESS =
  '[Configurator] Update Configuration finalize success';
export const UPDATE_CONFIGURATION_FINALIZE_FAIL =
  '[Configurator] Update Configuration finalize fail';
export const CHANGE_GROUP = '[Configurator] Change group';
export const CHANGE_GROUP_FINALIZE = '[Configurator] Change group finalize';
export const ADD_TO_CART = '[Configurator] Add to cart';
export const UPDATE_CART_ENTRY = '[Configurator] Update cart entry';
export const UPDATE_CART_ENTRY_SUCCESS =
  '[Configurator] Update cart entry success';

export const REMOVE_CONFIGURATION = '[Configurator] Remove configuration';

export const UPDATE_PRICE_SUMMARY =
  '[Configurator] Update Configuration Summary Price';
export const UPDATE_PRICE_SUMMARY_FAIL =
  '[Configurator] Update Configuration Price Summary fail';
export const UPDATE_PRICE_SUMMARY_SUCCESS =
  '[Configurator] Update Configuration Price Summary success';
export const ADD_NEXT_OWNER = '[Configurator] Add next owner';
export const SET_NEXT_OWNER_CART_ENTRY =
  '[Configurator] Set next owner cart entry';

export const GET_CONFIGURATION_OVERVIEW =
  '[Configurator] Get Configuration Overview';
export const GET_CONFIGURATION_OVERVIEW_FAIL =
  '[Configurator] Get Configuration Overview fail';
export const GET_CONFIGURATION_OVERVIEW_SUCCESS =
  '[Configurator] Get Configuration Overview success';

export const SET_INTERACTION_STATE = '[Configurator] Set interaction state';
export const SET_CURRENT_GROUP = '[Configurator] Set current group to State';
export const SET_MENU_PARENT_GROUP =
  '[Configurator] Set current parent group for menu to State';

export const SET_GROUPS_VISITED = '[Configurator] Set groups to visited';
export const SET_GROUPS_COMPLETED = '[Configurator] Set groups complete status';
export const SET_GROUPS_ERROR = '[Configurator] Set groups error status';

export class CreateConfiguration extends StateUtils.EntityLoadAction {
  readonly type = CREATE_CONFIGURATION;
  constructor(public payload: GenericConfigurator.Owner) {
    super(CONFIGURATION_DATA, payload.key);
  }
}

export class CreateConfigurationFail extends StateUtils.EntityFailAction {
  readonly type = CREATE_CONFIGURATION_FAIL;
  constructor(
    public payload: {
      ownerKey: string;
      error: any;
    }
  ) {
    super(CONFIGURATION_DATA, payload.ownerKey, payload.error);
  }
}

export class CreateConfigurationSuccess extends StateUtils.EntitySuccessAction {
  readonly type = CREATE_CONFIGURATION_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class ReadCartEntryConfiguration extends StateUtils.EntityLoadAction {
  readonly type = READ_CART_ENTRY_CONFIGURATION;
  constructor(
    public payload: GenericConfigurator.ReadConfigurationFromCartEntryParameters
  ) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class ReadCartEntryConfigurationSuccess extends StateUtils.EntitySuccessAction {
  readonly type = READ_CART_ENTRY_CONFIGURATION_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class ReadCartEntryConfigurationFail extends StateUtils.EntityFailAction {
  readonly type = READ_CART_ENTRY_CONFIGURATION_FAIL;
  constructor(public payload: { ownerKey: string; error: any }) {
    super(CONFIGURATION_DATA, payload.ownerKey, payload.error);
  }
}

export class ReadOrderEntryConfiguration extends StateUtils.EntityLoadAction {
  readonly type = READ_ORDER_ENTRY_CONFIGURATION;
  constructor(
    public payload: GenericConfigurator.ReadConfigurationFromOrderEntryParameters
  ) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class ReadOrderEntryConfigurationSuccess extends StateUtils.EntitySuccessAction {
  readonly type = READ_ORDER_ENTRY_CONFIGURATION_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class ReadOrderEntryConfigurationFail extends StateUtils.EntityFailAction {
  readonly type = READ_ORDER_ENTRY_CONFIGURATION_FAIL;
  constructor(public payload: { ownerKey: string; error: any }) {
    super(CONFIGURATION_DATA, payload.ownerKey, payload.error);
  }
}

export class ReadConfiguration extends StateUtils.EntityLoadAction {
  readonly type = READ_CONFIGURATION;
  constructor(
    public payload: {
      configuration: Configurator.Configuration;
      groupId: string;
    }
  ) {
    super(CONFIGURATION_DATA, payload.configuration.owner.key);
  }
}

export class ReadConfigurationFail extends StateUtils.EntityFailAction {
  readonly type = READ_CONFIGURATION_FAIL;
  constructor(public payload: { ownerKey: string; error: any }) {
    super(CONFIGURATION_DATA, payload.ownerKey, payload.error);
  }
}

export class ReadConfigurationSuccess extends StateUtils.EntitySuccessAction {
  readonly type = READ_CONFIGURATION_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class UpdateConfiguration extends StateUtils.EntityProcessesIncrementAction {
  readonly type = UPDATE_CONFIGURATION;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
    this.meta.loader = {
      load: true,
    };
  }
}

export class UpdateConfigurationFail extends StateUtils.EntityProcessesDecrementAction {
  readonly type = UPDATE_CONFIGURATION_FAIL;
  constructor(
    public payload: { configuration: Configurator.Configuration; error: any }
  ) {
    super(CONFIGURATION_DATA, payload.configuration.owner.key);
    this.meta.loader = {
      error: payload.error,
    };
  }
}

export class UpdateConfigurationSuccess extends StateUtils.EntityProcessesDecrementAction {
  readonly type = UPDATE_CONFIGURATION_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class UpdateConfigurationFinalizeSuccess extends StateUtils.EntitySuccessAction {
  readonly type = UPDATE_CONFIGURATION_FINALIZE_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class UpdateConfigurationFinalizeFail extends StateUtils.EntitySuccessAction {
  readonly type = UPDATE_CONFIGURATION_FINALIZE_FAIL;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class UpdatePriceSummary extends StateUtils.EntityLoadAction {
  readonly type = UPDATE_PRICE_SUMMARY;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}
export class UpdatePriceSummaryFail extends StateUtils.EntityFailAction {
  readonly type = UPDATE_PRICE_SUMMARY_FAIL;
  constructor(public payload: { ownerKey: string; error: any }) {
    super(CONFIGURATION_DATA, payload.ownerKey, payload.error);
  }
}

export class UpdatePriceSummarySuccess extends StateUtils.EntitySuccessAction {
  readonly type = UPDATE_PRICE_SUMMARY_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class ChangeGroup extends StateUtils.EntityLoadAction {
  readonly type = CHANGE_GROUP;
  constructor(
    public payload: {
      configuration: Configurator.Configuration;
      groupId: string;
      parentGroupId: string;
    }
  ) {
    super(CONFIGURATION_DATA, payload.configuration.owner.key);
  }
}

export class ChangeGroupFinalize extends StateUtils.EntityLoadAction {
  readonly type = CHANGE_GROUP_FINALIZE;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class AddToCart extends EntityProcessesIncrementAction {
  readonly type = ADD_TO_CART;
  constructor(public payload: Configurator.AddToCartParameters) {
    super(MULTI_CART_DATA, payload.cartId);
  }
}

export class UpdateCartEntry extends EntityProcessesIncrementAction {
  readonly type = UPDATE_CART_ENTRY;
  constructor(
    public payload: Configurator.UpdateConfigurationForCartEntryParameters
  ) {
    super(MULTI_CART_DATA, payload.cartId);
  }
}

export class UpdateCartEntrySuccess extends StateUtils.EntitySuccessAction {
  readonly type = UPDATE_CART_ENTRY_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class RemoveConfiguration extends StateUtils.EntityLoaderResetAction {
  readonly type = REMOVE_CONFIGURATION;
  constructor(public payload: { ownerKey: string | string[] }) {
    super(CONFIGURATION_DATA, payload.ownerKey);
  }
}

export class GetConfigurationOverview extends StateUtils.EntityLoadAction {
  readonly type = GET_CONFIGURATION_OVERVIEW;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.owner.key);
  }
}

export class GetConfigurationOverviewFail extends StateUtils.EntityFailAction {
  readonly type = GET_CONFIGURATION_OVERVIEW_FAIL;
  constructor(public payload: { ownerKey: string; error: any }) {
    super(CONFIGURATION_DATA, payload.ownerKey, payload.error);
  }
}

export class GetConfigurationOverviewSuccess extends StateUtils.EntitySuccessAction {
  readonly type = GET_CONFIGURATION_OVERVIEW_SUCCESS;
  constructor(
    public payload: { ownerKey: string; overview: Configurator.Overview }
  ) {
    super(CONFIGURATION_DATA, payload.ownerKey);
  }
}

export class AddNextOwner implements Action {
  readonly type = ADD_NEXT_OWNER;
  constructor(public payload: { ownerKey: string; cartEntryNo: string }) {}
}

export class SetNextOwnerCartEntry extends StateUtils.EntitySuccessAction {
  readonly type = SET_NEXT_OWNER_CART_ENTRY;

  constructor(
    public payload: {
      configuration: Configurator.Configuration;
      cartEntryNo: string;
    }
  ) {
    super(CONFIGURATION_DATA, payload.configuration.owner.key);
  }
}

export class SetInteractionState extends StateUtils.EntitySuccessAction {
  readonly type = SET_INTERACTION_STATE;

  constructor(
    public payload: {
      entityKey: string | string[];
      interactionState: Configurator.InteractionState;
    }
  ) {
    super(CONFIGURATION_DATA, payload.entityKey, payload.interactionState);
  }
}

export class SetCurrentGroup extends StateUtils.EntitySuccessAction {
  readonly type = SET_CURRENT_GROUP;

  constructor(
    public payload: { entityKey: string | string[]; currentGroup: string }
  ) {
    super(CONFIGURATION_DATA, payload.entityKey, payload.currentGroup);
  }
}

export class SetMenuParentGroup extends StateUtils.EntitySuccessAction {
  readonly type = SET_MENU_PARENT_GROUP;

  constructor(
    public payload: { entityKey: string | string[]; menuParentGroup: string }
  ) {
    super(CONFIGURATION_DATA, payload.entityKey, payload.menuParentGroup);
  }
}

export class SetGroupsVisited extends StateUtils.EntitySuccessAction {
  readonly type = SET_GROUPS_VISITED;
  constructor(public payload: { entityKey: string; visitedGroups: string[] }) {
    super(CONFIGURATION_DATA, payload.entityKey, payload.visitedGroups);
  }
}

export class SetGroupsCompleted extends StateUtils.EntitySuccessAction {
  readonly type = SET_GROUPS_COMPLETED;

  constructor(
    public payload: { entityKey: string; completedGroups: string[] }
  ) {
    super(CONFIGURATION_DATA, payload.entityKey, payload.completedGroups);
  }
}

//This is still a success action as the group status is succcessfully updated
export class SetGroupsError extends StateUtils.EntitySuccessAction {
  readonly type = SET_GROUPS_ERROR;

  constructor(public payload: { entityKey: string; errorGroups: string[] }) {
    super(CONFIGURATION_DATA, payload.entityKey, payload.errorGroups);
  }
}

export type ConfiguratorAction =
  | CreateConfiguration
  | CreateConfigurationFail
  | CreateConfigurationSuccess
  | ReadConfiguration
  | ReadConfigurationFail
  | ReadConfigurationSuccess
  | UpdateConfiguration
  | UpdateConfigurationFail
  | UpdateConfigurationSuccess
  | UpdateConfigurationFinalizeFail
  | UpdateConfigurationFinalizeSuccess
  | UpdatePriceSummary
  | UpdatePriceSummaryFail
  | UpdatePriceSummarySuccess
  | ChangeGroup
  | ChangeGroupFinalize
  | GetConfigurationOverview
  | GetConfigurationOverviewFail
  | GetConfigurationOverviewSuccess
  | AddNextOwner
  | SetNextOwnerCartEntry
  | ReadCartEntryConfiguration
  | ReadCartEntryConfigurationSuccess
  | ReadCartEntryConfigurationFail
  | ReadOrderEntryConfiguration
  | ReadOrderEntryConfigurationSuccess
  | ReadOrderEntryConfigurationFail
  | UpdateCartEntry
  | UpdateCartEntrySuccess
  | RemoveConfiguration
  | SetInteractionState
  | SetMenuParentGroup
  | SetCurrentGroup
  | SetGroupsVisited
  | SetGroupsCompleted
  | SetGroupsError;
