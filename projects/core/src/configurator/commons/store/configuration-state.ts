import { Configurator } from '../../../model/configurator.model';
import { EntityLoaderState } from '../../../state/utils/entity-loader/entity-loader-state';
import { EntityState } from '../../../state/utils/entity/entity-state';

export const CONFIGURATION_FEATURE = 'productConfiguration';
export const CONFIGURATION_DATA = '[Configurator] Configuration Data';
export const CONFIGURATION_UI_DATA = '[Configurator] Configuration UI Data';

export interface StateWithConfiguration {
  [CONFIGURATION_FEATURE]: ConfigurationState;
}

export interface ConfigurationState {
  configurations: EntityLoaderState<Configurator.Configuration>;
  uiState?: EntityState<UiState>;
}

export interface UiState {
  currentGroup: string;
}
