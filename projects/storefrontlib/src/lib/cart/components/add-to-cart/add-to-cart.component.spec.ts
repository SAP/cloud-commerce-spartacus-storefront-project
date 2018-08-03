import {
  ComponentFixture,
  TestBed,
  async,
  inject
} from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import { CartService } from '../../../cart/services/cart.service';
import { CartDataService } from '../../../cart/services/cart-data.service';
import * as fromCart from '../../../cart/store';
import * as fromRoot from '../../../routing/store';
import * as fromUser from '../../../user/store';
import { AddToCartComponent } from './add-to-cart.component';
import { AddToCartModule } from './add-to-cart.module';

describe('AddToCartComponent', () => {
  let store: Store<fromCart.CartState>;
  let addToCartComponent: AddToCartComponent;
  let fixture: ComponentFixture<AddToCartComponent>;

  const productCode = '1234';
  const mockCartEntry: any = [
    { '1234': { entryNumber: 0, product: { code: productCode } } }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AddToCartModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          cart: combineReducers(fromCart.reducers),
          user: combineReducers(fromUser.reducers)
        })
      ],
      providers: [CartService, CartDataService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCartComponent);
    addToCartComponent = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'select').and.returnValue(of(mockCartEntry));
  });

  it('should be created', () => {
    expect(addToCartComponent).toBeTruthy();
  });

  it('should call ngOnChanges()', () => {
    addToCartComponent.productCode = productCode;
    addToCartComponent.ngOnChanges();
    addToCartComponent.cartEntry$.subscribe(entry =>
      expect(entry).toEqual(mockCartEntry)
    );
  });

  it('should call addToCart()', inject(
    [CartService, MatDialog],
    (cartService: CartService, dialog: MatDialog) => {
      spyOn(cartService, 'addCartEntry').and.callThrough();
      spyOn(dialog, 'open').and.callThrough();

      addToCartComponent.productCode = productCode;
      addToCartComponent.addToCart();

      fixture.detectChanges();
      dialog.closeAll(); // prevent poluting Jasmine UI on browser

      expect(dialog.open).toHaveBeenCalled();
      expect(cartService.addCartEntry).toHaveBeenCalledWith(productCode, 1);
    }
  ));

  // UI test will be added after replacing Material
});
