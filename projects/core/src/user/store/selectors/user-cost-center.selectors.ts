import { createSelector, MemoizedSelector } from '@ngrx/store';
import { CostCenter, B2BAddress } from '../../../model/org-unit.model';
import { StateUtils } from '../../../state/utils/index';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import { StateWithUser, UserState } from '../user-state';
import { getUserState } from './feature.selector';

export const getCostCentersState: MemoizedSelector<
  StateWithUser,
  LoaderState<CostCenter[]>
> = createSelector(getUserState, (state: UserState) => state.costCenters);

export const getCostCenters: MemoizedSelector<
  StateWithUser,
  CostCenter[]
> = createSelector(getCostCentersState, (state: LoaderState<CostCenter[]>) =>
  StateUtils.loaderValueSelector(state)
);

export const getCostCenterAddressesFactory = (
  costCenterId: string
): MemoizedSelector<StateWithUser, B2BAddress[]> =>
  createSelector(getCostCenters, (costCenters) => {
    const costCenter = costCenters.find((cc) => cc.code === costCenterId);
    if (costCenter.unit) {
      return costCenter.unit.addresses;
    }
    return [];
  });
