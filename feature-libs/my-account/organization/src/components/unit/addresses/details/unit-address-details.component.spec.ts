import { TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  B2BAddress,
  I18nTestingModule,
  OrgUnitService,
  RoutingService,
} from '@spartacus/core';
import { ModalService, Table2Module } from '@spartacus/storefront';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { of } from 'rxjs';
import { SplitViewTestingModule } from '../../../../../../../../projects/storefrontlib/src/shared/components/split-view/testing/spit-view-testing.module';
import { CurrentUnitService } from '../../current-unit.service';
import { CurrentUnitAddressService } from './current-unit-address.service';
import { UnitAddressDetailsComponent } from './unit-address-details.component';
import createSpy = jasmine.createSpy;

const code = 'b1';
const addressId = 'a1';
const unit = { name: 'testUnit' };

const mockAddress: Partial<B2BAddress> = {
  id: addressId,
  firstName: 'orgUnit1',
};

class MockOrgUnitService implements Partial<OrgUnitService> {
  deleteAddress = createSpy('deleteAddress');
}

class MockRoutingService {
  go = createSpy('go').and.stub();
}

class MockModalService {
  open = createSpy('open').and.stub();
}

class MockCurrentUnitService {
  unit$ = of(unit);
  code$ = of(code);
}

class MockCurrentUnitAddressService {
  unitAddress$ = of(mockAddress);
}

xdescribe('UnitAddressDetailsComponent', () => {
  let component: UnitAddressDetailsComponent;
  let fixture: ComponentFixture<UnitAddressDetailsComponent>;
  let routingService: RoutingService;
  let orgUnitsService: OrgUnitService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        Table2Module,
        I18nTestingModule,
        UrlTestingModule,
        SplitViewTestingModule,
      ],
      declarations: [UnitAddressDetailsComponent],
      providers: [
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: OrgUnitService, useClass: MockOrgUnitService },
        { provide: ModalService, useClass: MockModalService },
        { provide: CurrentUnitService, useClass: MockCurrentUnitService },
        {
          provide: CurrentUnitAddressService,
          useClass: MockCurrentUnitAddressService,
        },
      ],
    }).compileComponents();

    routingService = TestBed.inject(RoutingService);
    orgUnitsService = TestBed.inject(OrgUnitService);
    modalService = TestBed.inject(ModalService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should deleteAddress', () => {
    component.addressId = mockAddress.id;
    component.deleteAddress();
    expect(orgUnitsService.deleteAddress).toHaveBeenCalledWith(code, addressId);
  });

  it('openModal', () => {
    component.openModal(mockAddress, {} as TemplateRef<any>);
    expect(modalService.open).toHaveBeenCalledWith({}, { centered: true });
    expect(routingService.go).toHaveBeenCalledWith({
      cxRoute: 'orgUnitManageAddresses',
      params: { uid: code },
    });
  });
});
