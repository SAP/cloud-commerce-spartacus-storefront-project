import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Permission } from '../../../model/permission.model';
import { Occ } from '../../../occ/occ-models/occ.models';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { PermissionConnector } from '../../connectors/permission/permission.connector';
import { PermissionActions } from '../actions/index';
import PermissionsList = Occ.PermissionsList;

@Injectable()
export class PermissionEffects {
  @Effect()
  loadPermission$: Observable<
    | PermissionActions.LoadPermissionSuccess
    | PermissionActions.LoadPermissionFail
  > = this.actions$.pipe(
    ofType(PermissionActions.LOAD_PERMISSION),
    map((action: PermissionActions.LoadPermission) => action.payload),
    switchMap(({ userId, permissionCode }) => {
      return this.permissionConnector.get(userId, permissionCode).pipe(
        map((permission: Permission) => {
          return new PermissionActions.LoadPermissionSuccess([permission]);
        }),
        catchError(error =>
          of(
            new PermissionActions.LoadPermissionFail(
              permissionCode,
              makeErrorSerializable(error)
            )
          )
        )
      );
    })
  );

  @Effect()
  loadPermissions$: Observable<
    | PermissionActions.LoadPermissionsSuccess
    | PermissionActions.LoadPermissionSuccess
    | PermissionActions.LoadPermissionsFail
  > = this.actions$.pipe(
    ofType(PermissionActions.LOAD_PERMISSIONS),
    map((action: PermissionActions.LoadPermissions) => action.payload),
    switchMap(payload =>
      this.permissionConnector.getList(payload.userId, payload.params).pipe(
        switchMap((permissions: PermissionsList) => {
          // normalization
          // TODO: extract into the same service with denormalization
          const permissionsEntities = permissions.orderApprovalPermissions;
          const permissionPage = {
            ids: permissionsEntities.map(permission => permission.code),
            pagination: permissions.pagination,
            sorts: permissions.sorts,
          };
          return [
            new PermissionActions.LoadPermissionSuccess(permissionsEntities),
            new PermissionActions.LoadPermissionsSuccess({
              permissionPage,
              params: payload.params,
            }),
          ];
        }),
        catchError(error =>
          of(
            new PermissionActions.LoadPermissionsFail({
              params: payload.params,
              error: makeErrorSerializable(error),
            })
          )
        )
      )
    )
  );

  @Effect()
  createPermission$: Observable<
    | PermissionActions.CreatePermissionSuccess
    | PermissionActions.CreatePermissionFail
  > = this.actions$.pipe(
    ofType(PermissionActions.CREATE_PERMISSION),
    map((action: PermissionActions.CreatePermission) => action.payload),
    switchMap(payload =>
      this.permissionConnector.create(payload.userId, payload.permission).pipe(
        map(data => new PermissionActions.CreatePermissionSuccess(data)),
        catchError(error =>
          of(
            new PermissionActions.CreatePermissionFail(
              payload.permission.code,
              makeErrorSerializable(error)
            )
          )
        )
      )
    )
  );

  @Effect()
  updatePermission$: Observable<
    | PermissionActions.UpdatePermissionSuccess
    | PermissionActions.UpdatePermissionFail
  > = this.actions$.pipe(
    ofType(PermissionActions.UPDATE_PERMISSION),
    map((action: PermissionActions.UpdatePermission) => action.payload),
    switchMap(payload =>
      this.permissionConnector
        .update(payload.userId, payload.permissionCode, payload.permission)
        .pipe(
          map(data => new PermissionActions.UpdatePermissionSuccess(data)),
          catchError(error =>
            of(
              new PermissionActions.UpdatePermissionFail(
                payload.permission.code,
                makeErrorSerializable(error)
              )
            )
          )
        )
    )
  );

  constructor(
    private actions$: Actions,
    private permissionConnector: PermissionConnector
  ) {}
}
