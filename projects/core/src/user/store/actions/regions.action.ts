import { Action } from '@ngrx/store';

import { LoaderResetAction } from '../../../state';
import { Region } from '../../../occ/occ-models/index';

export const LOAD_REGIONS = '[User] Load Regions';
export const LOAD_REGIONS_SUCCESS = '[User] Load Regions Success';
export const LOAD_REGIONS_FAIL = '[User] Load Regions Fail';
export const RESET_REGIONS = '[User] Reset Regions';

export class LoadRegions implements Action {
  readonly type = LOAD_REGIONS;
  constructor(public payload: string) {}
}

export class LoadRegionsFail implements Action {
  readonly type = LOAD_REGIONS_FAIL;
  constructor(public payload: any) {}
}

export class LoadRegionsSuccess implements Action {
  readonly type = LOAD_REGIONS_SUCCESS;
  constructor(public payload: Region[]) {}
}

export class ResetRegions extends LoaderResetAction {
  readonly type = RESET_REGIONS;
  constructor() {
    super(RESET_REGIONS);
  }
}

export type RegionsAction = LoadRegions | LoadRegionsFail | LoadRegionsSuccess;
