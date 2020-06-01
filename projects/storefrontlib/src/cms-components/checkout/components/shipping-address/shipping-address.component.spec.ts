import { ChangeDetectionStrategy, Component, Input, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  ActiveCartService,
  Address,
  CheckoutDeliveryService,
  I18nTestingModule,
  UserAddressService,
  PaymentTypeService,
  UserCostCenterService,
  CheckoutCostCenterService,
} from '@spartacus/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Card } from '../../../../shared/components/card/card.component';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { ShippingAddressComponent } from './shipping-address.component';
import createSpy = jasmine.createSpy;

class MockUserAddressService {
  getAddresses(): Observable<Address[]> {
    return of(mockAddresses);
  }
  getAddressesLoading(): Observable<boolean> {
    return of(false);
  }
  loadAddresses(): void {}
}

class MockActiveCartService {
  isGuestCart(): Boolean {
    return false;
  }
}

class MockCheckoutDeliveryService {
  createAndSetAddress = createSpy();
  setDeliveryAddress = createSpy();
  getDeliveryAddress(): Observable<Address> {
    return of(null);
  }
}

class MockCheckoutStepService {
  next = createSpy();
  back = createSpy();
  getBackBntText(): string {
    return 'common.back';
  }
}

const paymentType: BehaviorSubject<string> = new BehaviorSubject<string>(
  'ACCOUNT'
);
class MockPaymentTypeService {
  readonly ACCOUNT_PAYMENT = 'ACCOUNT';
  getSelectedPaymentType(): Observable<string> {
    return paymentType;
  }
}

class MockUserCostCenterService {
  getCostCenterAddresses() {
    return of(mockAddresses);
  }
}

class MockCheckoutCostCenterService {
  getCostCenter() {
    return of('test-cost-center');
  }
}

const mockAddress1: Address = {
  firstName: 'John',
  lastName: 'Doe',
  titleCode: 'mr',
  line1: 'first line',
  line2: 'second line',
  town: 'town',
  id: 'id',
  region: { isocode: 'JP-27' },
  postalCode: 'zip',
  country: { isocode: 'JP' },
};
const mockAddress2: Address = {
  firstName: 'Alice',
  lastName: 'Smith',
  titleCode: 'mrs',
  line1: 'other first line',
  line2: 'other second line',
  town: 'other town',
  id: 'id2',
  region: { isocode: 'JP-27' },
  postalCode: 'other zip',
  country: { isocode: 'JP' },
  defaultAddress: true,
};
const mockAddresses: Address[] = [mockAddress1, mockAddress2];

const mockActivatedRoute = {
  snapshot: {
    url: ['checkout', 'shipping-address'],
  },
};

@Component({
  selector: 'cx-address-form',
  template: '',
})
class MockAddressFormComponent {
  @Input() cancelBtnLabel: string;
  @Input() showTitleCode: boolean;
  @Input() setAsDefaultField: boolean;
  @Input() addressData: Address;
}

@Component({
  selector: 'cx-spinner',
  template: '',
})
class MockSpinnerComponent {}

@Component({
  selector: 'cx-card',
  template: '',
})
class MockCardComponent {
  @Input()
  border: boolean;
  @Input()
  content: Card;
  @Input()
  fitToContainer: boolean;
}

fdescribe('ShippingAddressComponent', () => {
  let component: ShippingAddressComponent;
  let fixture: ComponentFixture<ShippingAddressComponent>;
  let checkoutDeliveryService: CheckoutDeliveryService;
  let userAddressService: UserAddressService;
  let activeCartService: ActiveCartService;
  let checkoutStepService: CheckoutStepService;
  let userCostCenterService: UserCostCenterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        ShippingAddressComponent,
        MockAddressFormComponent,
        MockCardComponent,
        MockSpinnerComponent,
      ],
      providers: [
        { provide: UserAddressService, useClass: MockUserAddressService },
        { provide: ActiveCartService, useClass: MockActiveCartService },
        {
          provide: CheckoutDeliveryService,
          useClass: MockCheckoutDeliveryService,
        },
        { provide: CheckoutStepService, useClass: MockCheckoutStepService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PaymentTypeService, useClass: MockPaymentTypeService },
        { provide: UserCostCenterService, useClass: MockUserCostCenterService },
        {
          provide: CheckoutCostCenterService,
          useClass: MockCheckoutCostCenterService,
        },
      ],
    })
      .overrideComponent(ShippingAddressComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    checkoutDeliveryService = TestBed.inject(CheckoutDeliveryService);
    activeCartService = TestBed.inject(ActiveCartService);
    checkoutStepService = TestBed.inject(
      CheckoutStepService as Type<CheckoutStepService>
    );
    userAddressService = TestBed.inject(UserAddressService);
    userCostCenterService = TestBed.inject(UserCostCenterService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingAddressComponent);
    component = fixture.componentInstance;

    spyOn(component, 'addAddress').and.callThrough();
    spyOn(component, 'selectAddress').and.callThrough();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get isGuestCheckout', () => {
    expect(component.isGuestCheckout).toBeFalsy();
  });

  it('should get isAccount', () => {
    paymentType.next('CARD');
    component.ngOnInit();
    expect(component.isAccount).toBeFalsy();

    paymentType.next('ACCOUNT');
    component.ngOnInit();
    expect(component.isAccount).toBeTruthy();
  });

  describe('should call ngOnInit', () => {
    it('for login user, should load user addresses if payment type is card', () => {
      spyOn(userAddressService, 'loadAddresses').and.stub();
      paymentType.next('CARD');

      component.ngOnInit();
      expect(component.paymentType).toEqual('CARD');
      expect(userAddressService.loadAddresses).toHaveBeenCalled();
    });

    it('for login user, should not load user addresses if payment type is account', () => {
      spyOn(userAddressService, 'loadAddresses').and.stub();
      paymentType.next('ACCOUNT');

      component.ngOnInit();
      expect(component.paymentType).toEqual('ACCOUNT');
      expect(userAddressService.loadAddresses).not.toHaveBeenCalled();
    });

    it('for guest user, should not load user addresses', () => {
      spyOn(activeCartService, 'isGuestCart').and.returnValue(true);
      spyOn(userAddressService, 'loadAddresses').and.stub();
      paymentType.next('CARD');

      component.ngOnInit();
      expect(userAddressService.loadAddresses).not.toHaveBeenCalled();
    });
  });

  it('should call showNewAddressForm()', () => {
    component.showNewAddressForm();
    expect(component.addressFormOpened).toEqual(true);
  });

  it('should call hideNewAddressForm()', () => {
    component.hideNewAddressForm();
    expect(component.addressFormOpened).toEqual(false);

    spyOn(component, 'back');
    component.hideNewAddressForm(true);
    expect(component.back).toHaveBeenCalled();
  });

  it('should be able to go to next step', () => {
    component.next();
    expect(checkoutStepService.next).toHaveBeenCalledWith(
      <any>mockActivatedRoute
    );
  });

  it('should be able to go to previous step', () => {
    component.back();
    expect(checkoutStepService.back).toHaveBeenCalledWith(
      <any>mockActivatedRoute
    );
  });

  it('should be able to select address', () => {
    component.selectAddress({});
    expect(checkoutDeliveryService.setDeliveryAddress).toHaveBeenCalledWith({});
  });

  it('should be able to add address', () => {
    component.addAddress({});
    expect(component.forceLoader).toBeTruthy();
    expect(checkoutDeliveryService.createAndSetAddress).toHaveBeenCalledWith(
      {}
    );
  });

  it('should be able to get card content', () => {
    const card = component.getCardContent(
      mockAddress1,
      undefined,
      'default',
      'shipTo',
      'selected'
    );
    expect(card.title).toEqual('');
    expect(card.textBold).toEqual('John Doe');
    expect(card.text).toEqual([
      'first line',
      'second line',
      'town, JP-27, JP',
      'zip',
      undefined,
    ]);
  });

  describe('should automatically select default shipping address when there is no current selection', () => {
    it('if payment type is credit card', () => {
      component.setDefaultAddress(false, mockAddresses, undefined);
      expect(component.selectAddress).toHaveBeenCalledWith(mockAddress2);
    });

    it('if payment type is account', () => {
      component.setDefaultAddress(true, [{ id: 'test addrss' }], undefined);
      expect(component.selectAddress).toHaveBeenCalledWith({
        id: 'test addrss',
      });
    });
  });

  describe('should be able to get supported address', () => {
    it('for ACCOUNT payment', () => {
      spyOn(userCostCenterService, 'getCostCenterAddresses').and.stub();
      paymentType.next('ACCOUNT');
      component.ngOnInit();
      component.getSupportedAddresses();
      expect(userCostCenterService.getCostCenterAddresses).toHaveBeenCalledWith(
        'test-cost-center'
      );
    });

    it('for CARD payment', () => {
      spyOn(userAddressService, 'getAddresses').and.stub();
      paymentType.next('CARD');
      component.ngOnInit();
      component.getSupportedAddresses();
      expect(userAddressService.getAddresses).toHaveBeenCalled();
    });
  });

  describe('UI continue button', () => {
    const getContinueBtn = () =>
      fixture.debugElement.query(By.css('.cx-checkout-btns .btn-primary'));

    it('should be disabled when no address is selected', () => {
      component.selectedAddress = undefined;
      fixture.detectChanges();
      expect(getContinueBtn().nativeElement.disabled).toEqual(true);
    });

    it('should be enabled when address is selected', () => {
      component.selectedAddress = mockAddress1;
      fixture.detectChanges();
      expect(getContinueBtn().nativeElement.disabled).toEqual(false);
    });

    it('should call "next" function after being clicked', () => {
      spyOn(component, 'next');
      component.selectedAddress = mockAddress1;
      fixture.detectChanges();
      getContinueBtn().nativeElement.click();
      expect(component.next).toHaveBeenCalled();
    });
  });

  describe('UI back button', () => {
    const getBackBtn = () =>
      fixture.debugElement
        .queryAll(By.css('.btn-action'))
        .find((el) => el.nativeElement.innerText === 'common.back');

    it('should call "back" function after being clicked', () => {
      spyOn(component, 'back').and.callThrough();
      fixture.detectChanges();
      getBackBtn().nativeElement.click();
      expect(component.back).toHaveBeenCalled();
    });
  });

  describe('UI cards with addresses', () => {
    const getCards = () => fixture.debugElement.queryAll(By.css('cx-card'));

    it('should represent all existing addresses', () => {
      fixture.detectChanges();
      expect(getCards().length).toEqual(2);
    });

    it('should not display if there are no existng addresses', () => {
      spyOn(userAddressService, 'getAddresses').and.returnValue(of([]));
      fixture.detectChanges();
      expect(getCards().length).toEqual(0);
    });

    it('should not display if existng addresses are loading', () => {
      spyOn(userAddressService, 'getAddressesLoading').and.returnValue(
        of(true)
      );
      spyOn(userAddressService, 'getAddresses').and.returnValue(of([]));
      fixture.detectChanges();
      expect(getCards().length).toEqual(0);
    });
  });

  describe('UI new address form', () => {
    const getAddNewAddressBtn = () =>
      fixture.debugElement
        .queryAll(By.css('.btn-action'))
        .find(
          (el) => el.nativeElement.innerText === 'checkoutAddress.addNewAddress'
        );
    const getNewAddressForm = () =>
      fixture.debugElement.query(By.css('cx-address-form'));

    it('should render only after user clicks "add new address" button if there are some existing addresses', () => {
      spyOn(userAddressService, 'getAddressesLoading').and.returnValue(
        of(false)
      );
      spyOn(userAddressService, 'getAddresses').and.returnValue(
        of(mockAddresses)
      );

      fixture.detectChanges();
      expect(getNewAddressForm()).toBeFalsy();

      getAddNewAddressBtn().nativeElement.click();
      fixture.detectChanges();
      expect(getNewAddressForm()).toBeTruthy();
    });

    it('should render on init if there are no existing addresses', () => {
      spyOn(userAddressService, 'getAddressesLoading').and.returnValue(
        of(false)
      );
      spyOn(userAddressService, 'getAddresses').and.returnValue(of([]));

      fixture.detectChanges();
      expect(getNewAddressForm()).toBeTruthy();
    });

    it('should not render on init if there are some existing addresses', () => {
      spyOn(userAddressService, 'getAddressesLoading').and.returnValue(
        of(false)
      );
      spyOn(userAddressService, 'getAddresses').and.returnValue(
        of(mockAddresses)
      );

      fixture.detectChanges();
      expect(getNewAddressForm()).toBeFalsy();
    });

    it('should not render when existing addresses are loading', () => {
      spyOn(userAddressService, 'getAddressesLoading').and.returnValue(
        of(true)
      );
      spyOn(userAddressService, 'getAddresses').and.returnValue(of([]));

      fixture.detectChanges();
      expect(getNewAddressForm()).toBeFalsy();
    });
  });

  describe('UI spinner', () => {
    const getSpinner = () => fixture.debugElement.query(By.css('cx-spinner'));

    it('should render only when existing addresses are loading', () => {
      spyOn(userAddressService, 'getAddressesLoading').and.returnValue(
        of(true)
      );
      spyOn(userAddressService, 'getAddresses').and.returnValue(of([]));

      fixture.detectChanges();
      expect(getSpinner()).toBeTruthy();
    });

    it('should NOT render when existing addresses are NOT loading', () => {
      spyOn(userAddressService, 'getAddressesLoading').and.returnValue(
        of(false)
      );
      spyOn(userAddressService, 'getAddresses').and.returnValue(
        of(mockAddresses)
      );

      fixture.detectChanges();
      expect(getSpinner()).toBeFalsy();
    });
  });
});
