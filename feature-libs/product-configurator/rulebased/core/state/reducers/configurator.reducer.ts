/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CommonConfigurator,
  ConfiguratorModelUtils,
} from '@spartacus/product-configurator/common';

import { Configurator } from '../../model/configurator.model';
import { ConfiguratorActions } from '../actions/index';
import { ConfiguratorStateUtils } from '../configurator-state-utils';

export const initialState: Configurator.Configuration = {
  configId: '',
  productCode: '',
  groups: [],
  flatGroups: [],
  interactionState: {
    currentGroup: undefined,
    groupsVisited: {},
    menuParentGroup: undefined,
  },
  owner: ConfiguratorModelUtils.createInitialOwner(),
};
export const initialStatePendingChanges = 0;

function handleActionUpdateConfigurationFinalizeSuccess(
  state: Configurator.Configuration,
  action: ConfiguratorActions.UpdateConfigurationFinalizeSuccess
): Configurator.Configuration | undefined {
  if (
    action.type === ConfiguratorActions.UPDATE_CONFIGURATION_FINALIZE_SUCCESS
  ) {
    const result: Configurator.Configuration = takeOverChanges(action, state);
    result.isCartEntryUpdateRequired = true;
    result.overview = undefined;
    return result;
  }
}

function handleActionUpdateCartEntry(
  state: Configurator.Configuration,
  action: ConfiguratorActions.UpdateCartEntry
): Configurator.Configuration | undefined {
  if (action.type === ConfiguratorActions.UPDATE_CART_ENTRY) {
    const result = { ...state };
    result.isCartEntryUpdateRequired = false;
    return result;
  }
}

function handleReadSucess(
  state: Configurator.Configuration,
  action:
    | ConfiguratorActions.CreateConfigurationSuccess
    | ConfiguratorActions.ReadConfigurationSuccess
    | ConfiguratorActions.ReadCartEntryConfigurationSuccess
): Configurator.Configuration | undefined {
  return setInitialCurrentGroup(takeOverChanges(action, state));
}

function handleUpdatePriceSummarySuccess(
  state: Configurator.Configuration,
  action: ConfiguratorActions.UpdatePriceSummarySuccess
): Configurator.Configuration | undefined {
  return setInitialCurrentGroup(takeOverPricingChanges(action, state));
}

function handleGetConfigurationOverviewSuccess(
  state: Configurator.Configuration,
  action: ConfiguratorActions.GetConfigurationOverviewSuccess
): Configurator.Configuration | undefined {
  const content = {
    ...action.payload.overview,
    possibleGroups: action.payload.overview.groups,
  };
  return {
    ...state,
    overview: content,
    priceSummary: content.priceSummary,
    interactionState: {
      ...state.interactionState,
      issueNavigationDone: false,
    },
  };
}

function handleUpdateConfigurationOverviewSuccess(
  state: Configurator.Configuration,
  action: ConfiguratorActions.UpdateConfigurationOverviewSuccess
): Configurator.Configuration | undefined {
  const content = {
    ...action.payload.overview,
  };
  return {
    ...state,
    overview: content,
    priceSummary: content.priceSummary,
    interactionState: {
      ...state.interactionState,
      issueNavigationDone: false,
    },
  };
}

function handleSearchVariantsSuccess(
  state: Configurator.Configuration,
  action: ConfiguratorActions.SearchVariantsSuccess
): Configurator.Configuration | undefined {
  return {
    ...state,
    variants: action.payload.variants,
  };
}

function handleReadOrderEntryConfigurationSuccess(
  state: Configurator.Configuration,
  action: ConfiguratorActions.ReadOrderEntryConfigurationSuccess
): Configurator.Configuration | undefined {
  const configuration = { ...action.payload };

  const result: Configurator.Configuration = {
    ...state,
    ...configuration,
    priceSummary: configuration.overview?.priceSummary,
  };

  return result;
}

function handleSetNextOwnerCartEntry(
  state: Configurator.Configuration,
  action: ConfiguratorActions.SetNextOwnerCartEntry
): Configurator.Configuration | undefined {
  const content = { ...action.payload.configuration };
  content.nextOwner = ConfiguratorModelUtils.createOwner(
    CommonConfigurator.OwnerType.CART_ENTRY,
    action.payload.cartEntryNo
  );
  const result = {
    ...state,
    ...content,
  };

  return result;
}

function handleSetInteractionState(
  state: Configurator.Configuration,
  action: ConfiguratorActions.SetInteractionState
): Configurator.Configuration | undefined {
  const newInteractionState: Configurator.InteractionState =
    action.payload.interactionState;

  return {
    ...state,
    interactionState: newInteractionState,
  };
}

function handleSetCurrentGroup(
  state: Configurator.Configuration,
  action: ConfiguratorActions.SetCurrentGroup
): Configurator.Configuration | undefined {
  const newCurrentGroup: string = action.payload.currentGroup;

  return {
    ...state,
    interactionState: {
      ...state.interactionState,
      currentGroup: newCurrentGroup,
    },
  };
}

function handleSetMenuParentGroup(
  state: Configurator.Configuration,
  action: ConfiguratorActions.SetMenuParentGroup
): Configurator.Configuration | undefined {
  const newMenuParentGroup = action.payload.menuParentGroup;

  return {
    ...state,
    interactionState: {
      ...state.interactionState,
      menuParentGroup: newMenuParentGroup,
    },
  };
}
function handleSetGroupsVisited(
  state: Configurator.Configuration,
  action: ConfiguratorActions.SetGroupsVisited
): Configurator.Configuration | undefined {
  const groupIds: string[] = action.payload.visitedGroups;

  const changedInteractionState: Configurator.InteractionState = {
    groupsVisited: {},
  };

  //Set Current state items
  if (state.interactionState.groupsVisited) {
    Object.keys(state.interactionState.groupsVisited).forEach((groupId) =>
      setGroupsVisited(changedInteractionState, groupId)
    );
  }

  //Add new Groups
  groupIds.forEach((groupId) =>
    setGroupsVisited(changedInteractionState, groupId)
  );

  return {
    ...state,
    interactionState: {
      ...state.interactionState,
      groupsVisited: changedInteractionState.groupsVisited,
    },
  };
}
function handleChangeGroup(
  state: Configurator.Configuration,
  action: ConfiguratorActions.ChangeGroup
): Configurator.Configuration | undefined {
  const isConflictResolutionMode = action.payload.conflictResolutionMode;

  return {
    ...state,
    interactionState: {
      ...state.interactionState,
      isConflictResolutionMode: isConflictResolutionMode,
    },
  };
}

export function configuratorReducer(
  state = initialState,
  action:
    | ConfiguratorActions.ConfiguratorAction
    | ConfiguratorActions.ConfiguratorCartAction
    | ConfiguratorActions.ConfiguratorVariantAction
): Configurator.Configuration {
  const reducerMap = new Map();
  reducerMap.set(
    ConfiguratorActions.UPDATE_CONFIGURATION_FINALIZE_SUCCESS,
    handleActionUpdateConfigurationFinalizeSuccess
  );
  reducerMap.set(
    ConfiguratorActions.UPDATE_CART_ENTRY,
    handleActionUpdateCartEntry
  );
  reducerMap.set(
    ConfiguratorActions.CREATE_CONFIGURATION_SUCCESS,
    handleReadSucess
  );
  reducerMap.set(
    ConfiguratorActions.READ_CONFIGURATION_SUCCESS,
    handleReadSucess
  );
  reducerMap.set(
    ConfiguratorActions.READ_CART_ENTRY_CONFIGURATION_SUCCESS,
    handleReadSucess
  );
  reducerMap.set(
    ConfiguratorActions.UPDATE_PRICE_SUMMARY_SUCCESS,
    handleUpdatePriceSummarySuccess
  );
  reducerMap.set(
    ConfiguratorActions.GET_CONFIGURATION_OVERVIEW_SUCCESS,
    handleGetConfigurationOverviewSuccess
  );
  reducerMap.set(
    ConfiguratorActions.UPDATE_CONFIGURATION_OVERVIEW_SUCCESS,
    handleUpdateConfigurationOverviewSuccess
  );
  reducerMap.set(
    ConfiguratorActions.SEARCH_VARIANTS_SUCCESS,
    handleSearchVariantsSuccess
  );
  reducerMap.set(
    ConfiguratorActions.READ_ORDER_ENTRY_CONFIGURATION_SUCCESS,
    handleReadOrderEntryConfigurationSuccess
  );
  reducerMap.set(
    ConfiguratorActions.SET_NEXT_OWNER_CART_ENTRY,
    handleSetNextOwnerCartEntry
  );
  reducerMap.set(
    ConfiguratorActions.SET_INTERACTION_STATE,
    handleSetInteractionState
  );
  reducerMap.set(ConfiguratorActions.SET_CURRENT_GROUP, handleSetCurrentGroup);
  reducerMap.set(
    ConfiguratorActions.SET_MENU_PARENT_GROUP,
    handleSetMenuParentGroup
  );
  reducerMap.set(
    ConfiguratorActions.SET_GROUPS_VISITED,
    handleSetGroupsVisited
  );
  reducerMap.set(ConfiguratorActions.CHANGE_GROUP, handleChangeGroup);
  if (reducerMap.has(action.type)) {
    return reducerMap.get(action.type)(state, action);
  } else {
    return state;
  }
}

function setGroupsVisited(
  changedInteractionState: Configurator.InteractionState,
  groupId: string
) {
  const groupsVisited = changedInteractionState.groupsVisited;
  if (groupsVisited) {
    groupsVisited[groupId] = true;
  }
}

function setInitialCurrentGroup(
  state: Configurator.Configuration
): Configurator.Configuration {
  if (state.interactionState.currentGroup) {
    return state;
  }
  let initialCurrentGroup;
  const flatGroups = state.flatGroups;
  if (flatGroups && flatGroups.length > 0) {
    initialCurrentGroup = flatGroups[0]?.id;
  }
  const menuParentGroup = initialCurrentGroup?.startsWith(
    Configurator.ConflictIdPrefix
  )
    ? Configurator.ConflictHeaderId
    : undefined;
  return {
    ...state,
    interactionState: {
      ...state.interactionState,
      currentGroup: initialCurrentGroup,
      menuParentGroup: menuParentGroup,
    },
  };
}

function takeOverChanges(
  action:
    | ConfiguratorActions.CreateConfigurationSuccess
    | ConfiguratorActions.ReadConfigurationSuccess
    | ConfiguratorActions.UpdateConfigurationFinalizeSuccess
    | ConfiguratorActions.ReadCartEntryConfigurationSuccess
    | ConfiguratorActions.ReadOrderEntryConfigurationSuccess,
  state: Configurator.Configuration
): Configurator.Configuration {
  const content = { ...action.payload };
  const groups = content.groups.length > 0 ? content.groups : state.groups;

  const result: Configurator.Configuration = {
    ...state,
    ...content,
    groups: groups,
    interactionState: {
      ...state.interactionState,
      ...content.interactionState,
      issueNavigationDone: true,
    },
  };
  return result;
}

function takeOverPricingChanges(
  action: ConfiguratorActions.UpdatePriceSummarySuccess,
  state: Configurator.Configuration
): Configurator.Configuration {
  const content = { ...action.payload };
  const priceSupplements = content.priceSupplements;
  const groups =
    priceSupplements && priceSupplements.length > 0
      ? ConfiguratorStateUtils.mergeGroupsWithSupplements(
          state.groups,
          priceSupplements
        )
      : state.groups;

  const result = {
    ...state,
    ...content,
    groups: groups,
    interactionState: {
      ...state.interactionState,
      ...content.interactionState,
      issueNavigationDone: true,
    },
  };
  return result;
}
