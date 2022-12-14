import { Component, Directive, Input } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TrapFocusConfig } from '../keyboard-focus.model';
import { TrapFocusDirective } from './trap-focus.directive';
import { TrapFocusService } from './trap-focus.service';

@Directive({
  selector: '[cxTrapFocus]',
})
class CustomFocusDirective extends TrapFocusDirective {
  @Input('cxTrapFocus') protected config: TrapFocusConfig;
}

@Component({
  selector: 'cx-host',
  template: `
    <div cxTrapFocus id="a"></div>
    <div [cxTrapFocus]="{ trap: true }" id="b"></div>
    <div [cxTrapFocus]="{ trap: false }" id="c"></div>
    <div [cxTrapFocus]="ignoreArrowsConfig" id="d"></div>
  `,
})
class MockComponent {
  ignoreArrowsConfig: TrapFocusConfig = {
    trap: true,
  };
}

class MockTrapFocusService {
  hasFocusableChildren() {
    return true;
  }
  moveFocus() {}
  shouldFocus() {}
}

describe('TrapFocusDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let service: TrapFocusService;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MockComponent, CustomFocusDirective],
        providers: [
          {
            provide: TrapFocusService,
            useClass: MockTrapFocusService,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MockComponent);
      service = TestBed.inject(TrapFocusService);
    })
  );

  const event = {
    preventDefault: () => {},
    stopPropagation: () => {},
  };

  const arrowDownEvent = {
    ...event,
    code: 'ArrowDown',
  };

  const arrowUpEvent = {
    ...event,
    code: 'ArrowUp',
  };

  describe('configuration', () => {
    it('should use trap=true by default', () => {
      const host = fixture.debugElement.query(By.css('#a'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.arrowup', event);
      host.triggerEventHandler('keydown.arrowdown', event);
      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      expect(service.moveFocus).toHaveBeenCalledTimes(4);
    });

    it('should move when trap = true', () => {
      const host = fixture.debugElement.query(By.css('#b'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.arrowup', event);
      host.triggerEventHandler('keydown.arrowdown', event);
      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      expect(service.moveFocus).toHaveBeenCalledTimes(4);
    });

    it('should not move when trap = false', () => {
      const host = fixture.debugElement.query(By.css('#c'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.arrowup', event);
      host.triggerEventHandler('keydown.arrowdown', event);
      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      expect(service.moveFocus).toHaveBeenCalledTimes(0);
    });

    it('should not move when there are not focusable childs', () => {
      spyOn(service, 'hasFocusableChildren').and.returnValue(false);
      const host = fixture.debugElement.query(By.css('#b'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.arrowup', event);
      host.triggerEventHandler('keydown.arrowdown', event);
      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      expect(service.moveFocus).toHaveBeenCalledTimes(0);
    });

    it('should move focus on ArrowUp and ArrowDown arrow events when ignoreArrows config is disabled', () => {
      const host = fixture.debugElement.query(By.css('#d'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      host.triggerEventHandler('keydown.arrowdown', arrowDownEvent);
      host.triggerEventHandler('keydown.arrowup', arrowUpEvent);
      host.triggerEventHandler('keydown.arrowdown', arrowDownEvent);
      expect(service.moveFocus).toHaveBeenCalledTimes(5);
    });

    it('should not move focus on ArrowUp and ArrowDown arrow events when ignoreArrows config is enabled', () => {
      fixture.componentRef.instance.ignoreArrowsConfig = {
        trap: true,
        ignoreArrows: true,
      };
      fixture.detectChanges();

      const host = fixture.debugElement.query(By.css('#d'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      host.triggerEventHandler('keydown.arrowdown', arrowDownEvent);
      host.triggerEventHandler('keydown.arrowup', arrowUpEvent);
      host.triggerEventHandler('keydown.arrowdown', arrowDownEvent);
      expect(service.moveFocus).toHaveBeenCalledTimes(2);
    });
  });
});
