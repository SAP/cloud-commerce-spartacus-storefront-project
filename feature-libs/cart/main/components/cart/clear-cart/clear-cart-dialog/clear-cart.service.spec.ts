import { TestBed } from '@angular/core/testing';
import { ActiveCartFacade, OrderEntry } from '@spartacus/cart/main/root';
import { Observable, of } from 'rxjs';
import { takeLast, take } from 'rxjs/operators';
import { ClearCartService } from './clear-cart.service';
import { LaunchDialogService } from '@spartacus/storefront';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import createSpy = jasmine.createSpy;

const mockCloseReason = 'Close Dialog';

class MockGlobalMessageService implements Partial<GlobalMessageService> {
  add = createSpy().and.stub();
}

class MockLaunchDialogService implements Partial<LaunchDialogService> {
  closeDialog(_reason: string): void {}
}

class MockActiveCartFacade implements Partial<ActiveCartFacade> {
  addEntry(_productCode: string, _quantity: number): void {}
  getEntries(): Observable<OrderEntry[]> {
    return of();
  }
  removeEntry(): void {}
  isStable(): Observable<boolean> {
    return of(true);
  }
}

describe('ClearCartService', () => {
  let service: ClearCartService;
  let activeCartFacade: ActiveCartFacade;
  let launchDialogService: LaunchDialogService;
  let globalMessageService: GlobalMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LaunchDialogService, useClass: MockLaunchDialogService },
        { provide: ActiveCartFacade, useClass: MockActiveCartFacade },
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
      ],
    }).compileComponents();

    service = TestBed.inject(ClearCartService);
    launchDialogService = TestBed.inject(LaunchDialogService);
    activeCartFacade = TestBed.inject(ActiveCartFacade);
    globalMessageService = TestBed.inject(GlobalMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call clearActiveCart and display global message', () => {
    spyOn(activeCartFacade, 'isStable').and.returnValue(of(true));
    spyOn(activeCartFacade, 'getEntries').and.returnValue(of());
    service.clearActiveCart();

    // Clearing cart progress: false -> true -> false
    service
      .getClearingCartProgess()
      .pipe(takeLast(2), take(1))
      .subscribe((inProgress) => {
        expect(activeCartFacade['isStable']).not.toHaveBeenCalled();
        expect(inProgress).toEqual(true);
      });

    expect(activeCartFacade['getEntries']).toHaveBeenCalled();

    // Note Global Message might not be used in final release of feature.
    // TODO: remove .not or remove the expect
    expect(globalMessageService.add).not.toHaveBeenCalledWith(
      {
        key: 'clearCart.cartClearedSuccessfully',
      },
      GlobalMessageType.MSG_TYPE_CONFIRMATION
    );
  });

  it('should close dialog on close method', () => {
    spyOn(launchDialogService, 'closeDialog');
    service.closeDialog(mockCloseReason);

    expect(launchDialogService.closeDialog).toHaveBeenCalledWith(
      mockCloseReason
    );
  });
});
