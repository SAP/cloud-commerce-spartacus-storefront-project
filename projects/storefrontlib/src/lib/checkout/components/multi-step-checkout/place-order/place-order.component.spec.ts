import { CheckoutService } from '@spartacus/core';
import { Pipe, PipeTransform } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { PlaceOrderComponent } from './place-order.component';

const checkoutServiceStub = {
  placeOrder(): void {}
};

@Pipe({
  name: 'cxTranslateUrl'
})
class MockTranslateUrlPipe implements PipeTransform {
  transform(): any {}
}

fdescribe('PlaceOrderComponent', () => {
  let component: PlaceOrderComponent;
  let fixture: ComponentFixture<PlaceOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MockTranslateUrlPipe, PlaceOrderComponent],
      providers: [{ provide: CheckoutService, useValue: checkoutServiceStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceOrderComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('UI Place order button', () => {
    const placeOrderChbx = () =>
      fixture.debugElement.query(By.css('.form-check-input'));

    const placeOrderBtn = () =>
      fixture.debugElement.query(By.css('.btn-block'));

    it('should be disabled by default', () => {
      fixture.detectChanges();

      expect(placeOrderChbx().nativeElement.checked).toBeFalsy();
      expect(placeOrderBtn().nativeElement.disabled).toBeTruthy();
    });

    it('should be enabled when TandC checkbox is selected', () => {
      placeOrderChbx().nativeElement.click();

      fixture.detectChanges();

      expect(placeOrderChbx().nativeElement.checked).toBeTruthy();
      expect(placeOrderBtn().nativeElement.disabled).toBeFalsy();
    });
  });
});
