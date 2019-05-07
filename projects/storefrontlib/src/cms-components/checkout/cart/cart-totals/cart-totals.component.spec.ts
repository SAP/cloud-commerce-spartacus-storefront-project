import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CartTotalsComponent } from './cart-totals.component';
import {
  UICart,
  UIOrderEntry,
  CartService,
  I18nTestingModule,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { Input, Component, Pipe, PipeTransform } from '@angular/core';

const cartMock: UICart = {
  name: 'cart-mock',
};

const entriesMock: UIOrderEntry[] = [
  {
    entryNumber: 1,
  },
  {
    entryNumber: 2,
  },
];

@Component({
  template: '',
  selector: 'cx-order-summary',
})
class MockOrderSummaryComponent {
  @Input()
  cart: Observable<UICart>;
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockCartService {
  getActive(): Observable<UICart> {
    return of(cartMock);
  }
  getEntries(): Observable<UIOrderEntry[]> {
    return of(entriesMock);
  }
}

describe('CartTotalsComponent', () => {
  let component: CartTotalsComponent;
  let fixture: ComponentFixture<CartTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [
        CartTotalsComponent,
        MockOrderSummaryComponent,
        MockUrlPipe,
      ],
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartTotalsComponent);
    component = fixture.componentInstance;
  });

  it('should get active cart on ngOnInit()', () => {
    let cart: UICart;

    component.ngOnInit();
    fixture.detectChanges();

    component.cart$.subscribe((data: UICart) => (cart = data));
    expect(cart).toEqual(cartMock);
  });

  it('should get entries on ngOnInit()', () => {
    let entries: UIOrderEntry[];

    component.ngOnInit();
    fixture.detectChanges();

    component.entries$.subscribe((data: UIOrderEntry[]) => (entries = data));
    expect(entries).toEqual(entriesMock);
  });
});
