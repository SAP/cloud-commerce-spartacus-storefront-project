import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { OccUserService } from '../../occ/index';
import * as fromUpdateEmailAction from '../actions/update-email.action';

@Injectable()
export class UpdateEmailEffect {
  constructor(
    private actions$: Actions,
    private occUserService: OccUserService
  ) {}

  @Effect()
  updateEmail$: Observable<
    | fromUpdateEmailAction.UpdateEmailSuccessAction
    | fromUpdateEmailAction.UpdateEmailErrorAction
  > = this.actions$.pipe(
    ofType(fromUpdateEmailAction.UPDATE_EMAIL),
    map((action: fromUpdateEmailAction.UpdateEmailAction) => action.payload),
    concatMap(payload =>
      this.occUserService
        .updateEmail(payload.userId, payload.currentPassword, payload.newUserId)
        .pipe(
          map(
            () =>
              new fromUpdateEmailAction.UpdateEmailSuccessAction(
                payload.newUserId
              )
          ),
          catchError(error =>
            of(new fromUpdateEmailAction.UpdateEmailErrorAction(error))
          )
        )
    )
  );
}
