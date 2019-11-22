import { Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  Consignment,
  FeaturesConfig,
  FeaturesConfigModule,
  I18nTestingModule,
  Order,
  PromotionResult,
} from '@spartacus/core';
import { of } from 'rxjs';
import { CardModule } from '../../../../../shared/components/card/card.module';
import { OrderDetailsService } from '../order-details.service';
import { OrderDetailItemsComponent } from './order-detail-items.component';
import { PromotionsModule } from '../../../../checkout';

const mockOrder: Order = {
  code: '1',
  statusDisplay: 'Shipped',
  deliveryAddress: {
    firstName: 'John',
    lastName: 'Smith',
    line1: 'Buckingham Street 5',
    line2: '1A',
    phone: '(+11) 111 111 111',
    postalCode: 'MA8902',
    town: 'London',
    country: {
      isocode: 'UK',
    },
  },
  deliveryMode: {
    name: 'Standard order-detail-shipping',
    description: '3-5 days',
  },
  paymentInfo: {
    accountHolderName: 'John Smith',
    cardNumber: '************6206',
    expiryMonth: '12',
    expiryYear: '2026',
    cardType: {
      name: 'Visa',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      line1: 'Buckingham Street 5',
      line2: '1A',
      phone: '(+11) 111 111 111',
      postalCode: 'MA8902',
      town: 'London',
      country: {
        isocode: 'UK',
      },
    },
  },
  created: new Date('2019-02-11T13:02:58+0000'),
  consignments: [
    {
      code: 'a00000341',
      status: 'SHIPPED',
      statusDate: new Date('2019-02-11T13:05:12+0000'),
      entries: [{ orderEntry: {}, quantity: 1, shippedQuantity: 1 }],
    },
  ],
};

@Component({
  selector: 'cx-cart-item-list',
  template: '',
})
class MockCartItemListComponent {
  @Input()
  isReadOnly = false;
  @Input()
  hasHeader = true;
  @Input()
  items = [];
  @Input()
  appliedProductPromotions: PromotionResult[] = [];
  @Input()
  cartIsLoading = false;
}

@Component({
  selector: 'cx-consignment-tracking',
  template: '',
})
class MockConsignmentTrackingComponent {
  @Input()
  consignment: Consignment;
  @Input()
  orderCode: string;
}

const mockedOrder: Order = {
  guid: '1',
  appliedOrderPromotions: [
    {
      consumedEntries: [
        {
          orderEntryNumber: 2,
        },
      ],
      description: 'test applied order promotion',
    },
  ],
};

describe('OrderDetailItemsComponent', () => {
  let component: OrderDetailItemsComponent;
  let fixture: ComponentFixture<OrderDetailItemsComponent>;
  let mockOrderDetailsService: OrderDetailsService;
  let el: DebugElement;

  beforeEach(async(() => {
    mockOrderDetailsService = <OrderDetailsService>{
      getOrderDetails() {
        return of(mockOrder);
      },
    };

    TestBed.configureTestingModule({
      imports: [
        CardModule,
        I18nTestingModule,
        PromotionsModule,
        FeaturesConfigModule,
      ],
      providers: [
        { provide: OrderDetailsService, useValue: mockOrderDetailsService },
        {
          provide: FeaturesConfig,
          useValue: {
            features: { level: '1.1', consignmentTracking: '1.2' },
          },
        },
      ],
      declarations: [
        OrderDetailItemsComponent,
        MockCartItemListComponent,
        MockConsignmentTrackingComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailItemsComponent);
    el = fixture.debugElement;

    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ', () => {
    fixture.detectChanges();
    let order: Order;
    component.order$
      .subscribe(value => {
        order = value;
      })
      .unsubscribe();
    expect(order).toEqual(mockOrder);
  });

  it('should order details item be rendered', () => {
    fixture.detectChanges();
    expect(el.query(By.css('.cx-list'))).toBeTruthy();
  });

  describe('when order has applied promotions and applied promotions are defined', () => {
    it('should contain applied promotion', () => {
      const expectedResult: PromotionResult[] = [
        {
          consumedEntries: [
            {
              orderEntryNumber: 2,
            },
          ],
          description: 'test applied order promotion',
        },
      ];

      const promotions = component.getAppliedPromotionsForOrder(mockedOrder);
      expect(promotions).toEqual(expectedResult);
    });
  });
});
