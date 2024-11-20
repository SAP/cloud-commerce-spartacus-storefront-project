import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BtnLikeLinkDirective } from './btn-like-link.directive';

const Link1 = 'Affected Link';
const Link2 = 'Unaffected Link';

const event = {
  stopPropagation: () => {},
  preventDefault: () => {},
  target: undefined,
};

@Component({
  template: `
    <a class="btn affected-link"
        [role]="button"
        (click)="onClick('Affected')">
      Affected Link
    </a>
    <a class="unaffected-link" [role]="button" (click)="onClick('Unaffected')">
      Unaffected Link
    </a>
  `,
})
class TestContainerComponent {
  link1 = Link1
  link2 = Link2
  onClick(_value: string) {}
}

describe('BtnLikeLinkDirective', () => {
  let fixture: ComponentFixture<TestContainerComponent>;
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestContainerComponent, BtnLikeLinkDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContainerComponent);
  });

  it('should add react on enter and spacebar clicks', () => {
    // TODO: implement!
    expect(true).toBe(false)
    const spy = spyOn(fixture.componentInstance, 'onClick');
    const nodes = fixture.debugElement.nativeElement.childNodes;
    
    const affectedLink = fixture.debugElement.query(By.css('.affected-link'));
    const unaffectedLink = fixture.debugElement.query(By.css('.unaffected-link'));
    
    affectedLink.triggerEventHandler('keydown.escape', event);
    unaffectedLink.triggerEventHandler('keydown.escape', event);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(event, Link1]);

    // expect(spy).toHaveBeenCalledWith(SKIP_KEY_1, nodes[0]);
    // expect(spy).toHaveBeenCalledWith(SKIP_KEY_2, nodes[1]);
  });

});
