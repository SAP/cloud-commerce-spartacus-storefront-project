import { StateUtils } from '@spartacus/core';

export const BUNDLE_FEATURE = 'bundle';
export const BUNDLE_DATA = '[Bundle] Bundle Data';

export interface StateWithBundle {
  [BUNDLE_FEATURE]: BundlesState;
}

export interface BundlesState {
  availableEntries: StateUtils.LoaderState<AvailableEntriesState>;
}

export interface AvailableEntriesState {
  availableEntriesEntities: any;
}
