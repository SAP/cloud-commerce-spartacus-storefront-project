import { InjectionToken, Provider } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { Configurator, StateUtils } from '@spartacus/core';
import { ConfigurationState, CONFIGURATOR_DATA } from '../configuration-state';
import * as StateReduce from './configurator.reducer';

export { configuratorReducer as ɵConfiguratorReducer } from './configurator.reducer';

export function getConfiguratorReducers(): ActionReducerMap<
  ConfigurationState
> {
  return {
    configurations: StateUtils.entityProcessesLoaderReducer<
      Configurator.Configuration
    >(CONFIGURATOR_DATA, StateReduce.configuratorReducer),
  };
}

export const configuratorReducerToken: InjectionToken<ActionReducerMap<
  ConfigurationState
>> = new InjectionToken<ActionReducerMap<ConfigurationState>>(
  'ConfiguratorReducers'
);

export const configuratorReducerProvider: Provider = {
  provide: configuratorReducerToken,
  useFactory: getConfiguratorReducers,
};

export function clearConfigurationState(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return function (state, action) {
    return reducer(state, action);
  };
}

export const metaConfiguratorReducers: MetaReducer<any>[] = [
  clearConfigurationState,
];
