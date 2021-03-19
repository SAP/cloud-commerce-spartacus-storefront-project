import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LaunchDialogService, LAUNCH_CALLER } from '@spartacus/storefront';
import { of } from 'rxjs';
import { SavedCartFormLaunchDialogService } from './saved-cart-form-launch-dialog.service';

@Component({
  template: '',
})
class TestContainerComponent {
  constructor(public vcr: ViewContainerRef) {}
}

class MockLaunchDialogService implements Partial<LaunchDialogService> {
  launch(
    _caller: LAUNCH_CALLER | string,
    _vcr?: ViewContainerRef,
    _data?: any
  ): void {}
  clear(_caller: LAUNCH_CALLER | string) {}
  get dialogClose() {
    return of('close');
  }
}

describe('SavedCartFormLaunchDialogService', () => {
  let service: SavedCartFormLaunchDialogService;
  let launchDialogService: LaunchDialogService;
  let component: TestContainerComponent;
  let componentRef: ComponentRef<TestContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestContainerComponent],
      providers: [
        { provide: LaunchDialogService, useClass: MockLaunchDialogService },
      ],
    }).compileComponents();

    service = TestBed.inject(SavedCartFormLaunchDialogService);
    launchDialogService = TestBed.inject(LaunchDialogService);
    component = TestBed.createComponent(TestContainerComponent)
      .componentInstance;
    componentRef = TestBed.createComponent(TestContainerComponent).componentRef;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDialog', () => {
    beforeEach(() => {
      spyOn(launchDialogService, 'launch').and.returnValue(of(componentRef));
    });

    it('should call LaunchDialogService launch', () => {
      service.openDialog(undefined, component.vcr, { test: 123 });

      expect(launchDialogService.launch).toHaveBeenCalledWith(
        LAUNCH_CALLER.ADD_TO_SAVED_CART,
        component.vcr,
        {
          test: 123,
        }
      );
    });

    it('should call LaunchDialogService clear on close', () => {
      spyOn(launchDialogService, 'clear');

      const comp = service.openDialog(undefined, component.vcr);
      comp?.subscribe();

      expect(launchDialogService.clear).toHaveBeenCalledWith(
        LAUNCH_CALLER.ADD_TO_SAVED_CART
      );
    });

    it('should destroy component on close', () => {
      spyOn(componentRef, 'destroy');

      const comp = service.openDialog(undefined, component.vcr);
      comp?.subscribe();

      expect(componentRef.destroy).toHaveBeenCalled();
    });
  });
});
