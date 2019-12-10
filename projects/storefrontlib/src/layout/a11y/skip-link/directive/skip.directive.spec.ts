import { Component, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SkipLinkService } from '../service/skip-link.service';
import { SkipDirective } from './skip.directive';
import { SkipLinkConfig } from '../config';

const SKIP_KEY_1 = 'Key1';
const SKIP_KEY_2 = 'Key2';

@Component({
  template: `
    <ng-container [cxSkipLink]="'${SKIP_KEY_1}'"></ng-container>
    <div [cxSkipLink]="'${SKIP_KEY_2}'"></div>
  `,
})
class TestContainerComponent {}

describe('SkipDirective', () => {
  let fixture: ComponentFixture<TestContainerComponent>;
  let service: SkipLinkService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestContainerComponent, SkipDirective],
      providers: [
        SkipLinkService,
        {
          provide: SkipLinkConfig,
          useValue: { skipLinks: [] },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContainerComponent);
    service = TestBed.get(SkipLinkService as Type<SkipLinkService>);
  });

  it('should add skip links on component creation', () => {
    const spy = spyOn(service, 'add');
    const nodes = fixture.debugElement.nativeElement.childNodes;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(SKIP_KEY_1, nodes[0]);
    expect(spy).toHaveBeenCalledWith(SKIP_KEY_2, nodes[1]);
  });

  it('should remove skip links on component destruction', () => {
    const spy = spyOn(service, 'remove');
    fixture.detectChanges();
    fixture.destroy();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(SKIP_KEY_1);
    expect(spy).toHaveBeenCalledWith(SKIP_KEY_2);
  });
});
