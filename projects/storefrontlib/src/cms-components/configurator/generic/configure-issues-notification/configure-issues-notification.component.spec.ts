import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigComponentTestUtilsService } from '../service/config-component-test-utils.service';
import { ConfigureIssuesNotificationComponent } from './configure-issues-notification.component';

@Pipe({
  name: 'cxTranslate',
})
class MockTranslatePipe implements PipeTransform {
  transform(): any {}
}

describe('ConfigureIssuesNotificationComponent', () => {
  let component: ConfigureIssuesNotificationComponent;
  let fixture: ComponentFixture<ConfigureIssuesNotificationComponent>;
  let htmlElem: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureIssuesNotificationComponent, MockTranslatePipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureIssuesNotificationComponent);
    component = fixture.componentInstance;
    htmlElem = fixture.nativeElement;
    component.item = {
      statusSummaryList: [],
      product: {
        configurable: true,
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return no issue message key if the number of issues is null/undefined or equals zero', () => {
    let result = component.getIssueMessageKey(null);
    expect(result).toEqual('');

    result = component.getIssueMessageKey(undefined);
    expect(result).toEqual('');

    result = component.getIssueMessageKey(0);
    expect(result).toEqual('');
  });

  it('should return number of issues of ERROR status', () => {
    component.item.statusSummaryList = [{ numberOfIssues: 2, status: 'ERROR' }];
    expect(component.getNumberOfIssues()).toBe(2);
  });

  it('should return number of issues of ERROR status if ERROR and SUCCESS statuses are present', () => {
    component.item.statusSummaryList = [
      { numberOfIssues: 1, status: 'SUCCESS' },
      { numberOfIssues: 3, status: 'ERROR' },
    ];
    expect(component.getNumberOfIssues()).toBe(3);
  });

  it('should return number of issues as 0 if only SUCCESS status is present', () => {
    component.item.statusSummaryList = [
      { numberOfIssues: 2, status: 'SUCCESS' },
    ];
    expect(component.getNumberOfIssues()).toBe(0);
  });

  it('should return number of issues as 0 if statusSummaryList is undefined', () => {
    component.item.statusSummaryList = undefined;
    expect(component.getNumberOfIssues()).toBe(0);
  });

  it('should return number of issues as 0 if statusSummaryList is empty', () => {
    component.item.statusSummaryList = [];
    expect(component.getNumberOfIssues()).toBe(0);
  });

  it('should return true if number of issues of ERROR status is > 0', () => {
    component.item.statusSummaryList = [{ numberOfIssues: 2, status: 'ERROR' }];
    fixture.detectChanges();
    expect(component.hasIssues()).toBeTrue();
    ConfigComponentTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'cx-configure-cart-entry'
    );
  });

  it('should return false if number of issues of ERROR status is = 0', () => {
    component.item.statusSummaryList = [
      { numberOfIssues: 2, status: 'SUCCESS' },
    ];
    fixture.detectChanges();
    expect(component.hasIssues()).toBeFalse();
    ConfigComponentTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      'cx-configure-cart-entry'
    );
  });
});
