import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CpqQuoteDiscountComponent } from './cpq-quote.component';
import { CartItemContext, OrderEntry } from '@spartacus/cart/base/root';
import { ReplaySubject } from 'rxjs';
import { CpqDiscounts } from '@spartacus/cpq-quote/root';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { take } from 'rxjs/operators';

class MockCartItemContext implements Partial<CartItemContext> {
  item$ = new ReplaySubject<OrderEntry>(1);
}

@Component({
  selector: 'cx-cpq-quote',
  template: '',
})
class MockConfigureCpqDiscountsComponent {
  @Input() cartEntry: Partial<OrderEntry & Array<CpqDiscounts>>;
}

describe('Cpq Quote Discount Component', () => {
  let component: CpqQuoteDiscountComponent;
  let fixture: ComponentFixture<CpqQuoteDiscountComponent>;
  let mockCartItemContext: MockCartItemContext;

  beforeEach(
    waitForAsync(() => {
      mockCartItemContext = new MockCartItemContext();

      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          CpqQuoteDiscountComponent,
          MockConfigureCpqDiscountsComponent,
        ],
        providers: [
          { provide: CartItemContext, useValue: mockCartItemContext },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CpqQuoteDiscountComponent);
    component = fixture.componentInstance;
    mockCartItemContext = TestBed.inject(CartItemContext) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose orderEntry$', (done) => {
    const orderEntry: Partial<OrderEntry & Array<CpqDiscounts>> = {
      orderCode: '123',
      cpqDiscounts: [],
    };
    component.orderEntry$.pipe(take(1)).subscribe((value: any) => {
      expect(value).toBe(orderEntry);
      done();
    });

    mockCartItemContext.item$.next(orderEntry);
  });

  describe('Cpq Quote Discount Percentage', () => {
    it('should not be displayed if model provides empty array', () => {
      mockCartItemContext.item$.next({
        cpqDiscounts: undefined,
      });

      const htmlElem = fixture.nativeElement;
      expect(htmlElem.querySelectorAll('.cx-total').length).toBe(0);
    });

    it('should be displayed if model provides data', () => {
      mockCartItemContext.item$.next({
        cpqDiscounts: [{ appliedValue: 30, isoCode: 'USD', value: 15 }],
      });

      fixture.detectChanges();
      const htmlElem = fixture.nativeElement;
      expect(htmlElem.querySelectorAll('.cx-total').length).toBe(1);
    });
    it('Display  appliedValue data', () => {
      const discounts: CpqDiscounts[] = [
        { appliedValue: 30, isoCode: 'USD', value: 15 },
      ];
      mockCartItemContext.item$.next({
        cpqDiscounts: discounts,
      });

      fixture.detectChanges();
      const htmlElem = fixture.nativeElement;
      const discountsDisplayed = htmlElem.querySelectorAll('.cx-total');
      expect(discountsDisplayed.length).toBe(discounts.length);

      for (let i = 0; i < discountsDisplayed.length; i++) {
        expect(discountsDisplayed[i].textContent).toContain(
          discounts[i].appliedValue
        );
        expect(discountsDisplayed[i].textContent).toContain(
          discounts[i].appliedValue
        );
      }
    });
  });
});
