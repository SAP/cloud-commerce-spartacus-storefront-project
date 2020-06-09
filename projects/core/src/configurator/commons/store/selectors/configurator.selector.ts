import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { Configurator } from '../../../../model/configurator.model';
import { StateUtils } from '../../../../state/utils';
import { EntityLoaderState } from '../../../../state/utils/entity-loader/entity-loader-state';
import { ProcessesLoaderState } from '../../../../state/utils/processes-loader/processes-loader-state';
import {
  ConfigurationState,
  CONFIGURATION_FEATURE,
  StateWithConfiguration,
} from '../configuration-state';

// const getConfigurationContentSelector = (state: ConfigurationState) =>
//   state.content;

export const getConfigurationsState: MemoizedSelector<
  StateWithConfiguration,
  ConfigurationState
> = createFeatureSelector<ConfigurationState>(CONFIGURATION_FEATURE);

export const getConfigurationState: MemoizedSelector<
  StateWithConfiguration,
  EntityLoaderState<Configurator.Configuration>
> = createSelector(
  getConfigurationsState,
  (state: ConfigurationState) => state.configurations
);

export const getConfigurationProcessLoaderStateFactory = (
  code: string
): MemoizedSelector<
  StateWithConfiguration,
  ProcessesLoaderState<Configurator.Configuration>
> => {
  return createSelector(getConfigurationState, (details) =>
    StateUtils.entityProcessesLoaderStateSelector(details, code)
  );
};

export const hasPendingChanges = (
  code: string
): MemoizedSelector<StateWithConfiguration, boolean> => {
  return createSelector(getConfigurationState, (details) =>
    StateUtils.entityHasPendingProcessesSelector(details, code)
  );
};

export const getConfigurationFactory = (
  code: string
): MemoizedSelector<StateWithConfiguration, Configurator.Configuration> => {
  return createSelector(
    getConfigurationProcessLoaderStateFactory(code),
    (configurationState) => StateUtils.loaderValueSelector(configurationState)
  );
};

export const getCurrentGroup = (
  ownerKey: string
): MemoizedSelector<StateWithConfiguration, string> => {
  return createSelector(
    getConfigurationFactory(ownerKey),
    (configuration) => configuration.interactionState.currentGroup
  );
};

export const getGroupStatus = (
  ownerKey: string,
  groupId: string
): MemoizedSelector<StateWithConfiguration, Configurator.GroupStatus> => {
  return createSelector(
    getConfigurationFactory(ownerKey),
    (configuration) =>
      configuration?.interactionState?.groupsStatus[groupId] || undefined
  );
};

export const isGroupVisited = (
  ownerKey: string,
  groupId: string
): MemoizedSelector<StateWithConfiguration, Boolean> => {
  return createSelector(
    getConfigurationFactory(ownerKey),
    (configuration) =>
      configuration?.interactionState?.groupsVisited[groupId] || undefined
  );
};

export const areGroupsVisited = (
  ownerKey: string,
  groupIds: string[]
): MemoizedSelector<StateWithConfiguration, Boolean> => {
  return createSelector(getConfigurationFactory(ownerKey), (configuration) => {
    let isVisited: Boolean = true;
    groupIds.forEach((groupId) => {
      if (!isVisited) {
        return;
      }

      isVisited =
        configuration?.interactionState?.groupsVisited[groupId] || undefined;
      if (isVisited === undefined) {
        isVisited = false;
      }
    });

    return isVisited;
  });
};
