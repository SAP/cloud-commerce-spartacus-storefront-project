import { Pipe, PipeTransform, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import {
  I18nTestingModule,
  RoutingService,
  RoutesConfig,
  RoutingConfig,
  OrgUnitService,
  B2BAddress,
} from '@spartacus/core';
import { BehaviorSubject, of } from 'rxjs';

import { InteractiveTableModule } from '../../../../shared/components/interactive-table/interactive-table.module';
import { UnitManageAddressesComponent } from './unit-manage-addresses.component';
import createSpy = jasmine.createSpy;
import { defaultStorefrontRoutesConfig } from '../../../../cms-structure/routing/default-routing-config';

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

const code = 'b1';
const addressId = 'a1';

const mockAddress: Partial<B2BAddress> = {
  id: addressId,
  firstName: 'firstName',
  lastName: 'lastName',
  formattedAddress: 'formattedAddress',
};

const mockAddresses = { values: [mockAddress] };
const mockAddressUI = {
  values: [
    {
      id: addressId,
      name: 'firstName lastName',
      code,
      formattedAddress: 'formattedAddress',
    },
  ],
};

const addressList = new BehaviorSubject(mockAddresses);

class MockOrgUnitService implements Partial<OrgUnitService> {
  loadAddresses = createSpy('loadAddresses');
  getAddress = createSpy('getAddress').and.returnValue(of(mockAddress));
  getAddresses = createSpy('getAddresses').and.returnValue(of(mockAddresses));
}

class MockRoutingService {
  go = createSpy('go').and.stub();
  getRouterState() {
    return of({
      state: {
        params: {
          code,
        },
      },
    });
  }
}
const mockRoutesConfig: RoutesConfig = defaultStorefrontRoutesConfig;
class MockRoutingConfig {
  getRouteConfig(routeName: string) {
    return mockRoutesConfig[routeName];
  }
}

describe('UnitManageAddressesComponent', () => {
  let component: UnitManageAddressesComponent;
  let fixture: ComponentFixture<UnitManageAddressesComponent>;
  let orgUnitService: MockOrgUnitService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, InteractiveTableModule, I18nTestingModule],
      declarations: [UnitManageAddressesComponent, MockUrlPipe],
      providers: [
        { provide: RoutingConfig, useClass: MockRoutingConfig },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: OrgUnitService, useClass: MockOrgUnitService },
      ],
    }).compileComponents();

    orgUnitService = TestBed.get(OrgUnitService as Type<OrgUnitService>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitManageAddressesComponent);
    component = fixture.componentInstance;
    addressList.next(mockAddresses);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // TODO:
  xit('should display No addresses found page if no addresses are found', () => {
    const emptyAddressList = { values: [] };

    addressList.next(emptyAddressList);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.cx-no-items'))).not.toBeNull();
  });

  describe('ngOnInit', () => {
    it('should read addresses list', () => {
      component.ngOnInit();

      let addressesList: any;
      component.data$.subscribe((value) => {
        addressesList = value;
      });

      expect(orgUnitService.loadAddresses).toHaveBeenCalledWith(code);
      expect(orgUnitService.getAddresses).toHaveBeenCalledWith(code);
      expect(addressesList).toEqual(mockAddressUI);
    });
  });
});
