import { Component, Input, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { CheckoutService, I18nTestingModule, Order } from '@spartacus/core';

import { OrderConfirmationThankYouMessageComponent } from './order-confirmation-thank-you-message.component';

import createSpy = jasmine.createSpy;

@Component({ selector: 'cx-add-to-home-screen-banner', template: '' })
class MockAddtoHomeScreenBannerComponent {}

@Component({ selector: 'cx-guest-register-form', template: '' })
class MockGuestRegisterFormComponent {
  @Input() guid;
  @Input() email;
}

class MockCheckoutService {
  clearCheckoutData = createSpy();
  getOrderDetails(): Observable<Order> {
    return of({
      code: 'test-code-412',
      guid: 'guid',
      guestCustomer: true,
      paymentInfo: { billingAddress: { email: 'test@test.com' } },
    });
  }
}

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationThankYouMessageComponent;
  let fixture: ComponentFixture<OrderConfirmationThankYouMessageComponent>;

  let checkoutService: CheckoutService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        OrderConfirmationThankYouMessageComponent,
        MockAddtoHomeScreenBannerComponent,
        MockGuestRegisterFormComponent,
      ],
      providers: [{ provide: CheckoutService, useClass: MockCheckoutService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      OrderConfirmationThankYouMessageComponent
    );
    component = fixture.componentInstance;
    checkoutService = TestBed.get(CheckoutService as Type<CheckoutService>);
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should display order code', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.cx-page-title')).nativeElement
        .innerHTML
    ).toContain('test-code-412');
  });

  it('should display guest register form for guest user', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('cx-guest-register-form'))
    ).not.toBeNull();
  });

  it('should not display guest register form for login user', () => {
    spyOn(checkoutService, 'getOrderDetails').and.returnValue(
      of({ guid: 'guid', guestCustomer: false })
    );
    component.ngOnInit();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('cx-guest-register-form'))
    ).toBeNull();
  });
});
