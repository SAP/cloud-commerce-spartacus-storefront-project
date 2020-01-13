import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nTestingModule, ReturnRequest } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { ReturnRequestService } from '../return-request.service';
import { ReturnRequestTotalsComponent } from './return-request-totals.component';

const mockReturnRequest: ReturnRequest = {
  rma: 'test',
  returnEntries: [],
};
class MockCheckoutService {
  getReturnRequest(): Observable<ReturnRequest> {
    return of(mockReturnRequest);
  }
}

describe('ReturnRequestTotalsComponent', () => {
  let component: ReturnRequestTotalsComponent;
  let fixture: ComponentFixture<ReturnRequestTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [ReturnRequestTotalsComponent],
      providers: [
        { provide: ReturnRequestService, useClass: MockCheckoutService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestTotalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
