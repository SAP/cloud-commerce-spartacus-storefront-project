import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PromotionLocation } from '@spartacus/cart/base/root';
import { FeaturesConfig, FeatureConfigService, I18nTestingModule } from '@spartacus/core';
import { Consignment, Order } from '@spartacus/order/root';
import { CardModule, OutletModule } from '@spartacus/storefront';
import { OrderConsignedEntriesComponent } from './order-consigned-entries.component';
import { OrderConsignmentService } from '@spartacus/order/core';

const mockProduct = { product: { code: 'test' } };

const mockOrder: Order = {
  code: '1',
  statusDisplay: 'Shipped',
  consignments: [
    {
      code: 'a00000341',
      status: 'SHIPPED',
      statusDate: new Date('2019-02-11T13:05:12+0000'),
      entries: [
        {
          orderEntry: mockProduct,
          quantity: 1,
          shippedQuantity: 1,
        },
      ],
    },
  ],
};

@Component({
  selector: 'cx-consignment-tracking',
  template: '',
})
class MockConsignmentTrackingComponent {
  @Input() consignment: Consignment;
  @Input() orderCode: string;
}

describe('OrderConsignedEntriesComponent', () => {
  let component: OrderConsignedEntriesComponent;
  let fixture: ComponentFixture<OrderConsignedEntriesComponent>;
  let el: DebugElement;
  let mockFeatureConfigService: jasmine.SpyObj<FeatureConfigService>;
  let mockOrderConsignmentService: jasmine.SpyObj<OrderConsignmentService>;

  beforeEach(waitForAsync(() => {
    mockFeatureConfigService = jasmine.createSpyObj('FeatureConfigService', ['isEnabled']);
    mockOrderConsignmentService = jasmine.createSpyObj('OrderConsignmentService', ['assignEntryGroupsToConsignments']);

    TestBed.configureTestingModule({
      imports: [
        CardModule,
        I18nTestingModule,
        RouterTestingModule,
        OutletModule,
      ],
      providers: [
        {
          provide: FeaturesConfig,
          useValue: {
            features: { level: '1.4', consignmentTracking: true },
          },
        },
        { provide: FeatureConfigService, useValue: mockFeatureConfigService },
        { provide: OrderConsignmentService, useValue: mockOrderConsignmentService },
      ],
      declarations: [
        OrderConsignedEntriesComponent,
        MockConsignmentTrackingComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConsignedEntriesComponent);
    el = fixture.debugElement;

    component = fixture.componentInstance;
    component.order = mockOrder;
    component.consignments = mockOrder.consignments;
    component.promotionLocation = PromotionLocation.Order;

    mockFeatureConfigService.isEnabled.and.returnValue(false);
    mockOrderConsignmentService.assignEntryGroupsToConsignments.and.callFake(
      (_order: any, consignments: any) => consignments
    );
      });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render order consignment entries', () => {
    fixture.detectChanges();
    expect(el.query(By.css('.cx-list'))).toBeTruthy();
  });

  it('should not modify consignments if enableBundles is disabled', () => {
    mockFeatureConfigService.isEnabled.and.returnValue(false);

    component.ngOnInit();

    expect(mockOrderConsignmentService.assignEntryGroupsToConsignments).not.toHaveBeenCalled();
    expect(component.consignments).toEqual(mockOrder.consignments);
  });

  it('should assign entry groups to consignments if enableBundles is enabled', () => {
    const modifiedConsignments = [{ code: 'modified' }] as Consignment[];
    mockFeatureConfigService.isEnabled.and.returnValue(true);
    mockOrderConsignmentService.assignEntryGroupsToConsignments.and.returnValue(modifiedConsignments);

    component.ngOnInit();

    expect(mockOrderConsignmentService.assignEntryGroupsToConsignments).toHaveBeenCalledWith(mockOrder, mockOrder.consignments);
    expect(component.consignments).toEqual(modifiedConsignments);
  });
});
