import { CartSharedModule } from './../../cart-shared/cart-shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromRoot from '../../../../routing/store';
import { CartDataService } from '../../../services/cart-data.service';
import { CartService } from '../../../services/cart.service';
import * as fromReducer from '../../../store/reducers';
import { CartDetailsComponent } from './cart-details.component';
import { CartItemListComponent } from './../cart-item-list/cart-item-list.component';
import { ComponentsModule } from '../../../../ui/components/components.module';

class MockCartService {
  removeCartEntry() {}
  loadCartDetails() {}
  updateCartEntry() {}
}

const mockData = [
  {
    cart: {
      id: 1,
      potentialOrderPromotions: [
        {
          consumedEntries: [
            {
              orderEntryNumber: 1
            }
          ],
          description: 'test applied product promtion'
        }
      ],
      appliedOrderPromotions: [
        {
          consumedEntries: [
            {
              orderEntryNumber: 2
            }
          ],
          description: 'test potential product promtion'
        }
      ]
    },
    expectedResult: [
      {
        consumedEntries: [
          {
            orderEntryNumber: 1
          }
        ],
        description: 'test applied product promtion'
      },
      {
        consumedEntries: [
          {
            orderEntryNumber: 2
          }
        ],
        description: 'test potential product promtion'
      }
    ]
  },
  {
    cart: {
      id: 2,
      potentialOrderPromotions: [],
      appliedOrderPromotions: [
        {
          consumedEntries: [
            {
              orderEntryNumber: 2
            }
          ],
          description: 'test potential product promtion'
        }
      ]
    },
    expectedResult: [
      {
        consumedEntries: [
          {
            orderEntryNumber: 2
          }
        ],
        description: 'test potential product promtion'
      }
    ]
  },
  {
    cart: {
      id: 3,
      potentialOrderPromotions: [
        {
          consumedEntries: [
            {
              orderEntryNumber: 1
            }
          ],
          description: 'test applied product promtion'
        }
      ],
      appliedOrderPromotions: []
    },
    expectedResult: [
      {
        consumedEntries: [
          {
            orderEntryNumber: 1
          }
        ],
        description: 'test applied product promtion'
      }
    ]
  },
  {
    cart: {
      id: 4,
      potentialOrderPromotions: [
        {
          consumedEntries: [
            {
              orderEntryNumber: 1
            }
          ],
          description: 'test applied product promtion'
        }
      ]
    },
    expectedResult: [
      {
        consumedEntries: [
          {
            orderEntryNumber: 1
          }
        ],
        description: 'test applied product promtion'
      }
    ]
  },
  {
    cart: {
      id: 5,
      appliedOrderPromotions: [
        {
          consumedEntries: [
            {
              orderEntryNumber: 2
            }
          ],
          description: 'test potential product promtion'
        }
      ]
    },
    expectedResult: [
      {
        consumedEntries: [
          {
            orderEntryNumber: 2
          }
        ],
        description: 'test potential product promtion'
      }
    ]
  }
];

describe('CartDetailsComponent', () => {
  let store: Store<fromReducer.CartState>;
  let component: CartDetailsComponent;
  let fixture: ComponentFixture<CartDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          cart: combineReducers(fromReducer.getReducers())
        }),
        ComponentsModule,
        CartSharedModule
      ],
      declarations: [CartDetailsComponent, CartItemListComponent],
      providers: [
        CartDataService,
        { provide: CartService, useClass: MockCartService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartDetailsComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
  });

  it('should create cart details component', () => {
    expect(component).toBeTruthy();
  });

  mockData.forEach(({ cart, expectedResult }) => {
    it(`should get all promotions for  cart ${cart.id}`, () => {
      spyOn(store, 'select').and.returnValues(of(cart));

      const promotions = component.getAllPromotionsForCart(cart);
      expect(promotions).toEqual(expectedResult);
    });

    it(`should check if cart has promotions ${cart.id}`, () => {
      spyOn(store, 'select').and.returnValues(of(cart));

      const hasPromotion = component.cartHasPromotions(cart);
      expect(hasPromotion).toEqual(expectedResult.length > 0);
    });
  });
});
