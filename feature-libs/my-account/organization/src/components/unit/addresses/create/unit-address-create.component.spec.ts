import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  I18nTestingModule,
  RoutingService,
  OrgUnitService,
  Occ,
} from '@spartacus/core';
import { UnitAddressCreateComponent } from './unit-address-create.component';
import createSpy = jasmine.createSpy;
import { RouterTestingModule } from '@angular/router/testing';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { SplitViewTestingModule } from 'projects/storefrontlib/src/shared/components/split-view/testing/spit-view-testing.module';
import { TableModule } from '@spartacus/storefront';
import { IconTestingModule } from 'projects/storefrontlib/src/cms-components/misc/icon/testing/icon-testing.module';
import { UnitAddressFormService } from '../form/unit-address-form.service';
import { CurrentUnitService } from '../../current-unit.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import B2BAddress = Occ.B2BAddress;
import { Component, Input } from '@angular/core';

const orgUnitId = 'b1';
const addressId = 'a1';

const mockAddress: Partial<B2BAddress> = {
  id: addressId,
  firstName: 'orgUnit1',
};

const mockAddressForm = new FormGroup({
  id: new FormControl(addressId),
  firstName: new FormControl('orgUnit1'),
});

class MockOrgUnitService implements Partial<OrgUnitService> {
  createAddress = createSpy('createAddress');
}

class MockRoutingService implements Partial<RoutingService> {
  go = createSpy('go').and.stub();
}

class MockUnitAddressFormService implements Partial<UnitAddressFormService> {
  getForm = createSpy('getForm').and.returnValue(new FormGroup({}));
}

class MockCurrentUnitService implements Partial<CurrentUnitService> {
  code$ = of(orgUnitId);
}

@Component({
  selector: 'cx-unit-address-form',
  template: '',
})
class MockUnitAddressFormComponent {
  @Input() form: FormGroup;
}

describe('UnitAddressCreateComponent', () => {
  let component: UnitAddressCreateComponent;
  let fixture: ComponentFixture<UnitAddressCreateComponent>;
  let orgUnitService: OrgUnitService;
  let routingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        I18nTestingModule,
        UrlTestingModule,
        SplitViewTestingModule,
        TableModule,
        IconTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [UnitAddressCreateComponent, MockUnitAddressFormComponent],
      providers: [
        { provide: OrgUnitService, useClass: MockOrgUnitService },
        { provide: RoutingService, useClass: MockRoutingService },
        {
          provide: UnitAddressFormService,
          useClass: MockUnitAddressFormService,
        },
        { provide: CurrentUnitService, useClass: MockCurrentUnitService },
      ],
    }).compileComponents();

    orgUnitService = TestBed.inject(OrgUnitService);
    routingService = TestBed.inject(RoutingService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitAddressCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save', () => {
    it('should create orgUnit Address', () => {
      const evt = new Event('submit');
      component.save(evt, mockAddressForm);
      expect(orgUnitService.createAddress).toHaveBeenCalledWith(
        orgUnitId,
        mockAddress
      );
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'orgUnitManageAddresses',
        params: { uid: orgUnitId },
      });
    });
  });
});
