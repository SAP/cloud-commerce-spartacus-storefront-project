import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { normalizeHttpError, PointOfService } from '@spartacus/core';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { PickupLocationConnector } from '../../connectors';
import {
  GetStoreDetailsById,
  SetStoreDetailsFailure,
  SetStoreDetailsSuccess,
} from '../actions/pickup-location.action';
import { PickupLocationEffect } from './pickup-location.effect';

class MockPickupLocationConnector {
  getStoreDetails(_storeName: string): Observable<PointOfService> {
    return of({});
  }
}

class MockPickupLocationConnectorWithError {
  getStoreDetails(_storeName: string): Observable<PointOfService> {
    console.log('+++++++I am run');
    return throwError(normalizeHttpError({ payload: {} }));
  }
}

describe('PickupLocationEffect', () => {
  let pickupLocationEffects: PickupLocationEffect;
  let actions$: Observable<any>;
  let pickupLocationConnector: PickupLocationConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],

      providers: [
        {
          provide: PickupLocationConnector,
          useClass: MockPickupLocationConnector,
        },
        PickupLocationEffect,

        provideMockActions(() => actions$),
      ],
    });

    pickupLocationEffects = TestBed.inject(PickupLocationEffect);
    pickupLocationConnector = TestBed.inject(PickupLocationConnector);
  });

  xit('should call the connection on the GET_STORE_DETAILS action and create SetStoreDetailsSuccess action', () => {
    spyOn(pickupLocationConnector, 'getStoreDetails').and.callThrough();
    const action = GetStoreDetailsById({ payload: 'storeId' });
    const actionSuccess = SetStoreDetailsSuccess({ payload: {} });
    actions$ = hot('-a', { a: action });
    const expected = cold('-(b)', { b: actionSuccess });
    expect(pickupLocationEffects.storeDetails$).toBeObservable(expected);
  });
});

describe('PickupLocationEffect with Error', () => {
  let pickupLocationEffects: PickupLocationEffect;
  let actions$: Observable<any>;
  let pickupLocationConnector: PickupLocationConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],

      providers: [
        {
          provide: PickupLocationConnector,
          useClass: MockPickupLocationConnectorWithError,
        },
        PickupLocationEffect,

        provideMockActions(() => actions$),
      ],
    });

    pickupLocationEffects = TestBed.inject(PickupLocationEffect);
    pickupLocationConnector = TestBed.inject(PickupLocationConnector);
  });

  it('should call the connection on the GET_STORE_DETAILS action and create SetStoreDetailsFailure action', () => {
    spyOn(pickupLocationConnector, 'getStoreDetails').and.callThrough();
    const action = GetStoreDetailsById({ payload: 'storeId' });
    const actionFailure = SetStoreDetailsFailure({ payload: {} });
    console.log('*********actionFailure', actionFailure);
    actions$ = hot('-a', { a: action });
    const expected = cold('-(b)', { b: actionFailure });
    expect(pickupLocationEffects.storeDetails$).toBeObservable(expected);
  });
});
