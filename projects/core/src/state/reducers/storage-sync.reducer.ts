import { Action, ActionReducer, INIT, MetaReducer, UPDATE } from '@ngrx/store';
import { deepMerge } from '../../config/utils/deep-merge';
import { WindowRef } from '../../window/window-ref';
import { StateConfig, StateConfigType } from '../config/state-config';
import { getKeysOfType, getStateSlice } from '../utils/get-state-slice';

export function getStorageSyncReducer<T>(
  winRef: WindowRef,
  config?: StateConfig
): MetaReducer<T, Action> {
  if (!winRef.nativeWindow || !config || !config.state || !config.state.keys) {
    return undefined;
  }

  return (reducer: ActionReducer<T, Action>): ActionReducer<T, Action> => {
    return (state, action): T => {
      const oldState = { ...state };
      let newState = { ...oldState };

      if (action.type === INIT && !exists(newState)) {
        newState = reducer(state, action);
      }

      if (action.type === INIT || action.type === UPDATE) {
        const rehydratedState = rehydrate(config, winRef);
        return deepMerge(newState, rehydratedState);
      }

      newState = reducer(newState, action);

      if (action.type !== INIT) {
        // handle local storage
        const localStorageKeys = getKeysOfType(
          config.state.keys,
          StateConfigType.LOCAL_STORAGE
        );
        const localStorageStateSlices = getStateSlice(localStorageKeys, state);
        persistToStorage(
          config.state.localStorageKeyName,
          localStorageStateSlices,
          winRef.localStorage
        );

        // handle session storage
        const sessionStorageKeys = getKeysOfType(
          config.state.keys,
          StateConfigType.SESSION_STORAGE
        );
        const sessionStorageStateSlices = getStateSlice(
          sessionStorageKeys,
          state
        );
        persistToStorage(
          config.state.sessionStorageKeyName,
          sessionStorageStateSlices,
          winRef.sessionStorage
        );
      }

      return newState;
    };
  };
}

export function rehydrate<T>(config: StateConfig, winRef: WindowRef): T {
  const localStorageValue = readFromStorage(
    winRef.localStorage,
    config.state.localStorageKeyName
  );
  const sessionStorageValue = readFromStorage(
    winRef.sessionStorage,
    config.state.sessionStorageKeyName
  );

  return deepMerge(localStorageValue, sessionStorageValue);
}

export function exists(value: Object): boolean {
  if (value != null) {
    if (typeof value === 'object') {
      return Object.keys(value).length !== 0;
    } else if (value === '') {
      return false;
    } else {
      return true;
    }
  }

  return false;
}

export function getStorage(
  storageType: StateConfigType,
  winRef: WindowRef
): Storage {
  let storage: Storage;

  switch (storageType) {
    case StateConfigType.LOCAL_STORAGE: {
      storage = winRef.localStorage;
      break;
    }
    case StateConfigType.SESSION_STORAGE: {
      storage = winRef.sessionStorage;
      break;
    }
    case StateConfigType.NO_STORAGE: {
      storage = undefined;
      break;
    }

    default: {
      storage = winRef.sessionStorage;
    }
  }

  return storage;
}

export function persistToStorage(
  configKey: string,
  value: Object,
  storage: Storage
): void {
  if (!isSsr(storage) && value) {
    storage.setItem(configKey, JSON.stringify(value));
  }
}

export function readFromStorage(storage: Storage, key: string): Object {
  if (isSsr(storage)) {
    return;
  }

  const storageValue = storage.getItem(key);
  if (!storageValue) {
    return;
  }

  return JSON.parse(storageValue);
}

export function isSsr(storage: Storage): boolean {
  return !Boolean(storage);
}
