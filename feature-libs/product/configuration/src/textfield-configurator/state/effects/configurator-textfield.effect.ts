import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CartActions, GenericConfigurator } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../utils/serialization-utils';
import { ConfiguratorTextfieldConnector } from '../../connectors/configurator-textfield.connector';
import { ConfiguratorTextfield } from '../../model/configurator-textfield.model';
import { ConfiguratorTextfieldActions } from '../actions/index';
@Injectable()
export class ConfiguratorTextfieldEffects {
  @Effect()
  createConfiguration$: Observable<
    | ConfiguratorTextfieldActions.CreateConfiguration
    | ConfiguratorTextfieldActions.CreateConfigurationSuccess
    | ConfiguratorTextfieldActions.CreateConfigurationFail
  > = this.actions$.pipe(
    ofType(ConfiguratorTextfieldActions.CREATE_CONFIGURATION),
    map(
      (action: ConfiguratorTextfieldActions.CreateConfiguration) =>
        action.payload
    ),
    mergeMap((payload) => {
      return this.configuratorTextfieldConnector
        .createConfiguration(payload.productCode, payload.owner)
        .pipe(
          switchMap((configuration: ConfiguratorTextfield.Configuration) => {
            return [
              new ConfiguratorTextfieldActions.CreateConfigurationSuccess(
                configuration
              ),
            ];
          }),
          catchError((error) =>
            of(
              new ConfiguratorTextfieldActions.CreateConfigurationFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );

  @Effect()
  addToCart$: Observable<
    | ConfiguratorTextfieldActions.RemoveConfiguration
    | ConfiguratorTextfieldActions.AddToCartFail
    | CartActions.LoadCart
  > = this.actions$.pipe(
    ofType(ConfiguratorTextfieldActions.ADD_TO_CART),
    map((action: ConfiguratorTextfieldActions.AddToCart) => action.payload),
    mergeMap((payload) => {
      return this.configuratorTextfieldConnector.addToCart(payload).pipe(
        switchMap(() => {
          return [
            new ConfiguratorTextfieldActions.RemoveConfiguration(),
            new CartActions.LoadCart({
              cartId: payload.cartId,
              userId: payload.userId,
            }),
          ];
        }),
        catchError((error) =>
          of(
            new ConfiguratorTextfieldActions.AddToCartFail(
              makeErrorSerializable(error)
            )
          )
        )
      );
    })
  );

  @Effect()
  updateCartEntry$: Observable<
    | ConfiguratorTextfieldActions.RemoveConfiguration
    | ConfiguratorTextfieldActions.UpdateCartEntryConfigurationFail
    | CartActions.LoadCart
  > = this.actions$.pipe(
    ofType(ConfiguratorTextfieldActions.UPDATE_CART_ENTRY_CONFIGURATION),
    map(
      (action: ConfiguratorTextfieldActions.UpdateCartEntryConfiguration) =>
        action.payload
    ),
    mergeMap((payload) => {
      return this.configuratorTextfieldConnector
        .updateConfigurationForCartEntry(payload)
        .pipe(
          switchMap(() => {
            return [
              new ConfiguratorTextfieldActions.RemoveConfiguration(),
              new CartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId,
              }),
            ];
          }),
          catchError((error) =>
            of(
              new ConfiguratorTextfieldActions.UpdateCartEntryConfigurationFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );

  @Effect()
  readConfigurationForCartEntry$: Observable<
    | ConfiguratorTextfieldActions.ReadCartEntryConfigurationSuccess
    | ConfiguratorTextfieldActions.ReadCartEntryConfigurationFail
  > = this.actions$.pipe(
    ofType(ConfiguratorTextfieldActions.READ_CART_ENTRY_CONFIGURATION),
    switchMap(
      (action: ConfiguratorTextfieldActions.ReadCartEntryConfiguration) => {
        const parameters: GenericConfigurator.ReadConfigurationFromCartEntryParameters =
          action.payload;

        return this.configuratorTextfieldConnector
          .readConfigurationForCartEntry(parameters)
          .pipe(
            switchMap((result: ConfiguratorTextfield.Configuration) => [
              new ConfiguratorTextfieldActions.ReadCartEntryConfigurationSuccess(
                result
              ),
            ]),
            catchError((error) => [
              new ConfiguratorTextfieldActions.ReadCartEntryConfigurationFail(
                makeErrorSerializable(error)
              ),
            ])
          );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private configuratorTextfieldConnector: ConfiguratorTextfieldConnector
  ) {}
}
