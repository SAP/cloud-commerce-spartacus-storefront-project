import { Input, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of, Observable } from 'rxjs';

import { CartService } from '@spartacus/core';

import { CartPageLayoutComponent } from './cart-page-layout.component';
import { Cart } from '@spartacus/core';

class MockCartService {
  getActive(): Observable<Cart> {
    return of();
  }
  getCartMergeComplete(): Observable<Boolean> {
    return of();
  }
  removeEntry() {}
  loadDetails() {}
}

@Component({
  selector: 'cx-dynamic-slot',
  template: ''
})
export class MockDynamicSlotComponent {
  @Input()
  position: string;
}

@Component({
  selector: 'cx-cart-details',
  template: ''
})
export class MockCartDetailsComponent {}

describe('CartPageLayoutComponent', () => {
  let component: CartPageLayoutComponent;
  let fixture: ComponentFixture<CartPageLayoutComponent>;
  let service: MockCartService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        CartPageLayoutComponent,
        MockCartDetailsComponent,
        MockDynamicSlotComponent
      ],
      providers: [{ provide: CartService, useClass: MockCartService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartPageLayoutComponent);
    component = fixture.componentInstance;
    service = TestBed.get(CartService);
  });

  it('should create cart page', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(service, 'getActive').and.returnValue(of('mockCart'));
    spyOn(service, 'getCartMergeComplete').and.returnValue(of(true));
    spyOn(service, 'loadDetails').and.stub();

    component.ngOnInit();

    expect(service.loadDetails).toHaveBeenCalled();
    let result;
    component.cart$
      .subscribe(cart => {
        result = cart;
      })
      .unsubscribe();
    expect(result).toBe('mockCart');
  });
});
