import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as fromAction from '../actions/delivery-countries.action';
import { OccMiscsService } from '../../../occ/miscs/miscs.service';

@Injectable()
export class DeliveryCountriesEffects {
  @Effect()
  loadDeliveryCountries$: Observable<
    fromAction.DeliveryCountriesAction
  > = this.actions$.pipe(
    ofType(fromAction.LOAD_DELIVERY_COUNTRIES),
    switchMap(() => {
      return this.occMiscsService.loadDeliveryCountries().pipe(
        map(
          data => new fromAction.LoadDeliveryCountriesSuccess(data.countries)
        ),
        catchError(error => of(new fromAction.LoadDeliveryCountriesFail(error)))
      );
    })
  );

  @Effect()
  resetDeliveryCountries$: Observable<Action> = this.actions$.pipe(
    ofType('[Site-context] Language Change', '[Site-context] Currency Change'),
    map(() => {
      return new fromAction.ResetDeliveryCountries();
    })
  );

  constructor(
    private actions$: Actions,
    private occMiscsService: OccMiscsService
  ) {}
}
