import { createSelector, MemoizedSelector } from '@ngrx/store';
import {
  EntityState,
  StateEntitySelectors,
} from '../../../../state/utils/index';
import {
  ConfigurationState,
  StateWithConfiguration,
  UiState,
} from '../configuration-state';
import { getConfigurationsState } from './configurator.selector';

export const getUiState: MemoizedSelector<
  StateWithConfiguration,
  EntityState<UiState>
> = createSelector(
  getConfigurationsState,
  (state: ConfigurationState) => state.uiState
);

export const getUiStateFactory = (
  code: string
): MemoizedSelector<StateWithConfiguration, UiState> => {
  return createSelector(
    getUiState,
    details => StateEntitySelectors.entitySelector(details, code)
  );
};
