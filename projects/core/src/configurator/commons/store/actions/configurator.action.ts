import { Configurator } from '../../../../model/configurator.model';
import { StateEntityLoaderActions } from '../../../../state/utils/index';
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
export const UPDATE_CONFIGURATION = '[Configurator] Update Configuration';
export const UPDATE_CONFIGURATION_FAIL =
  '[Configurator] Update Configuration Fail';
export const UPDATE_CONFIGURATION_SUCCESS =
  '[Configurator] Update Configuration Sucess';

export class CreateConfiguration extends StateEntityLoaderActions.EntityLoadAction {
  readonly type = CREATE_CONFIGURATION;
  constructor(public productCode: string) {
    super(CONFIGURATION_DATA, productCode);
  }
}

export class CreateConfigurationFail extends StateEntityLoaderActions.EntityFailAction {
  readonly type = CREATE_CONFIGURATION_FAIL;
  constructor(productCode: string, public payload: any) {
    super(CONFIGURATION_DATA, productCode, payload);
  }
}

export class CreateConfigurationSuccess extends StateEntityLoaderActions.EntitySuccessAction {
  readonly type = CREATE_CONFIGURATION_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.productCode);
  }
}

export class ReadConfiguration extends StateEntityLoaderActions.EntityLoadAction {
  readonly type = READ_CONFIGURATION;
  constructor(public payload: any) {
    super(CONFIGURATION_DATA, payload.productCode);
  }
}

export class ReadConfigurationFail extends StateEntityLoaderActions.EntityFailAction {
  readonly type = READ_CONFIGURATION_FAIL;
  constructor(productCode: string, public payload: any) {
    super(CONFIGURATION_DATA, productCode, payload);
  }
}

export class ReadConfigurationSuccess extends StateEntityLoaderActions.EntitySuccessAction {
  readonly type = READ_CONFIGURATION_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.productCode);
  }
}

export class UpdateConfiguration extends StateEntityLoaderActions.EntityLoadAction {
  readonly type = UPDATE_CONFIGURATION;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.productCode);
  }
}

export class UpdateConfigurationFail extends StateEntityLoaderActions.EntityFailAction {
  readonly type = UPDATE_CONFIGURATION_FAIL;
  constructor(productCode: string, public payload: any) {
    super(CONFIGURATION_DATA, productCode, payload);
  }
}

export class UpdateConfigurationSuccess extends StateEntityLoaderActions.EntitySuccessAction {
  readonly type = UPDATE_CONFIGURATION_SUCCESS;
  constructor(public payload: Configurator.Configuration) {
    super(CONFIGURATION_DATA, payload.productCode);
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
  | UpdateConfigurationSuccess;
