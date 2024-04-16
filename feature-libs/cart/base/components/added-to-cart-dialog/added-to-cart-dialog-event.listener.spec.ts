import { AbstractType, ElementRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  CartAddEntryFailEvent,
  CartAddEntrySuccessEvent,
  CartUiEventAddToCart,
} from '@spartacus/cart/base/root';
import { CxEvent, EventService } from '@spartacus/core';
import { LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { AddedToCartDialogEventListener } from './added-to-cart-dialog-event.listener';

const mockEventStream$ = new BehaviorSubject<CxEvent>({});
const mockEventSuccessStream$ = new BehaviorSubject<CxEvent>({});

class MockEventService implements Partial<EventService> {
  get<T>(eventType: AbstractType<T>): Observable<T> {
    if (
      eventType.name === CartUiEventAddToCart.type ||
      eventType.name === CartAddEntryFailEvent.type
    ) {
      return mockEventStream$.asObservable() as Observable<T>;
    } else {
      return mockEventSuccessStream$.asObservable() as Observable<T>;
    }
  }
}

class MockLaunchDialogService implements Partial<LaunchDialogService> {
  openDialog(
    _caller: LAUNCH_CALLER,
    _openElement?: ElementRef,
    _vcr?: ViewContainerRef
  ) {
    return EMPTY;
  }
  closeDialog(_reason: string): void {}
}

const mockEvent = new CartUiEventAddToCart();
const mockSuccessEvent = new CartAddEntrySuccessEvent();
mockEvent.productCode = 'test';
mockEvent.quantity = 3;
mockEvent.numberOfEntriesBeforeAdd = 1;
mockEvent.pickupStoreName = 'testStore';

const mockFailEvent = new CartAddEntryFailEvent();
mockFailEvent.error = {};

describe('AddToCartDialogEventListener', () => {
  let listener: AddedToCartDialogEventListener;
  let launchDialogService: LaunchDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddedToCartDialogEventListener,
        {
          provide: EventService,
          useClass: MockEventService,
        },
        {
          provide: LaunchDialogService,
          useClass: MockLaunchDialogService,
        },
      ],
    });

    listener = TestBed.inject(AddedToCartDialogEventListener);
    launchDialogService = TestBed.inject(LaunchDialogService);
  });

  describe('onAddToCart', () => {
    it('Should open modal on event', () => {
      spyOn(listener as any, 'openModalAfterSuccess').and.stub();
      mockEventStream$.next(mockEvent);
      mockEventSuccessStream$.next(mockSuccessEvent);
      expect(listener['openModalAfterSuccess']).toHaveBeenCalledWith(
        mockEvent,
        mockSuccessEvent
      );
    });

    it('Should close modal on fail event', () => {
      spyOn(listener as any, 'closeModal').and.stub();
      mockEventStream$.next(mockFailEvent);
      expect(listener['closeModal']).toHaveBeenCalledWith(mockFailEvent);
    });
  });

  describe('openModal', () => {
    it('Should open the add to cart dialog', () => {
      spyOn(launchDialogService, 'openDialog').and.callThrough();
      listener['openModal'](mockEvent);
      expect(launchDialogService.openDialog).toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('Should close the add to cart dialog', () => {
      spyOn(launchDialogService, 'closeDialog').and.stub();
      listener['closeModal']('reason');
      expect(launchDialogService.closeDialog).toHaveBeenCalledWith('reason');
    });
  });
});
