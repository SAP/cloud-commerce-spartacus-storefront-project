import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  I18nTestingModule,
  RoutingService,
  OrgUnitService,
  B2BAddress,
} from '@spartacus/core';
import { UnitAddressEditComponent } from './unit-address-edit.component';
import createSpy = jasmine.createSpy;
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UnitAddressFormService } from '../form';
import { CurrentUnitService } from '../../current-unit.service';
import { CurrentUnitAddressService } from '../details/current-unit-address.service';
import { SplitViewTestingModule } from 'projects/storefrontlib/src/shared/components/split-view/testing/spit-view-testing.module';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { IconTestingModule } from 'projects/storefrontlib/src/cms-components/misc/icon/testing/icon-testing.module';

const code = 'b1';
const addressId = 'a1';

const mockAddress: Partial<B2BAddress> = {
  id: addressId,
  firstName: 'orgUnit1',
};
const addressForm = new FormGroup({
  id: new FormControl(mockAddress.id),
  firstName: new FormControl(mockAddress.firstName),
});

class MockRoutingService implements Partial<RoutingService> {
  go = createSpy('go').and.stub();
}

class MockOrgUnitService implements Partial<OrgUnitService> {
  updateAddress = createSpy('updateAddress');
}

class MockUnitAddressFormService implements Partial<UnitAddressFormService> {
  getForm = createSpy('getForm').and.returnValue(addressForm);
}

class MockCurrentUnitService implements Partial<CurrentUnitService> {
  code$ = of(code);
}

class MockCurrentUnitAddressService
  implements Partial<CurrentUnitAddressService> {
  id$ = of(addressId);
  unitAddress$ = of(mockAddress);
}

@Component({
  selector: 'cx-unit-address-form',
  template: '',
})
class MockUnitAddressFormComponent {
  @Input() form: FormGroup;
}

describe('UnitAddressEditComponent', () => {
  let component: UnitAddressEditComponent;
  let fixture: ComponentFixture<UnitAddressEditComponent>;
  let orgUnitsService: OrgUnitService;
  let routingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
        RouterTestingModule,
        UrlTestingModule,
        SplitViewTestingModule,
        IconTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [UnitAddressEditComponent, MockUnitAddressFormComponent],
      providers: [
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: OrgUnitService, useClass: MockOrgUnitService },
        {
          provide: UnitAddressFormService,
          useClass: MockUnitAddressFormService,
        },
        { provide: CurrentUnitService, useClass: MockCurrentUnitService },
        {
          provide: CurrentUnitAddressService,
          useClass: MockCurrentUnitAddressService,
        },
      ],
    }).compileComponents();

    orgUnitsService = TestBed.inject(OrgUnitService);
    routingService = TestBed.inject(RoutingService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitAddressEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save', () => {
    it('should update units address', () => {
      const evt = new Event('submit');

      component.save(evt, addressForm);
      expect(orgUnitsService.updateAddress).toHaveBeenCalledWith(
        code,
        mockAddress.id,
        mockAddress
      );
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'orgUnitAddressDetails',
        params: { id: addressId, uid: code },
      });
    });
  });
});
