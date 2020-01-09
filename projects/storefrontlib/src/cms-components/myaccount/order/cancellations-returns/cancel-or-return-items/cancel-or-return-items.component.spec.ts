import { Component, Input, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { I18nTestingModule } from '@spartacus/core';
import { OrderAmendService } from '../order-amend.service';
import { CancelOrReturnItemsComponent } from './cancel-or-return-items.component';
import createSpy = jasmine.createSpy;

const mockEntries = [
  {
    id: 1,
    quantity: 5,
    entryNumber: 1,
    returnableQuantity: 4,
    returnedQuantity: 3,
    cancellableQuantity: 2,
    cancelledQuantity: 1,
    product: { code: 'test' },
  },
];
const mockForm: FormGroup = new FormGroup({});
const entryGroup = new FormGroup({});
mockForm.addControl('entries', entryGroup);
mockEntries.forEach(entry => {
  const key = entry.entryNumber.toString();
  entryGroup.addControl(key, new FormControl(0));
});

@Component({
  template: '',
  selector: 'cx-media',
})
class MockMediaComponent {
  @Input() container;
  @Input() format;
}

@Component({
  template: '',
  selector: 'cx-item-counter',
})
class MockItemCounterComponent {
  @Input() step;
  @Input() min;
  @Input() max;
  @Input() isValueChangeable;
}

class MockOrderAmendService {
  getAmendedPrice = createSpy();
  getForm() {}
  getMaxAmmendQuantity() {
    return 99;
  }
}

describe('CancelOrReturnItemsComponent', () => {
  let component: CancelOrReturnItemsComponent;
  let fixture: ComponentFixture<CancelOrReturnItemsComponent>;
  let orderAmendService: OrderAmendService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, I18nTestingModule],
      providers: [
        {
          provide: OrderAmendService,
          useClass: MockOrderAmendService,
        },
      ],
      declarations: [
        CancelOrReturnItemsComponent,
        MockMediaComponent,
        MockItemCounterComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelOrReturnItemsComponent);
    component = fixture.componentInstance;
    orderAmendService = TestBed.get(OrderAmendService as Type<
      OrderAmendService
    >);

    component.entries = mockEntries;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set all quanities to max values', () => {
    component.setAll(mockForm);
    expect(entryGroup.get('1').value).toEqual(99);
  });

  it('should call getAmendedPrice', () => {
    component.getItemPrice(mockEntries[0]);
    expect(orderAmendService.getAmendedPrice).toHaveBeenCalledWith(
      mockEntries[0]
    );
  });
});
