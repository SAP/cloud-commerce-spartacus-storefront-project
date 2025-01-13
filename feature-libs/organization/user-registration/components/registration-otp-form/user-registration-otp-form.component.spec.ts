import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import {
  Country,
  GlobalMessageService,
  GlobalMessageType,
  I18nTestingModule,
  Region,
  RoutingService,
  Title,
  Translatable,
} from '@spartacus/core';
import { VerificationTokenFacade } from '@spartacus/user/account/root';
import { UserRegistrationOTPFormComponent } from './user-registration-otp-form.component';
import { UserRegistrationFormService } from '../form';
import createSpy = jasmine.createSpy;
import { Pipe, PipeTransform } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormErrorsModule,
  NgSelectA11yDirective,
  SpinnerComponent,
} from '@spartacus/storefront';
import { MockFeatureDirective } from 'projects/storefrontlib/shared/test/mock-feature-directive';

class MockRoutingService implements Partial<RoutingService> {
  go = () => Promise.resolve(true);
}

class MockGlobalMessageService implements Partial<GlobalMessageService> {
  add(_: string | Translatable, __: GlobalMessageType, ___?: number): void {}
}

class MockVerificationTokenFacade implements Partial<VerificationTokenFacade> {
  createVerificationToken = createSpy().and.returnValue(
    of({ tokenId: 'testTokenId', expiresIn: '300' })
  );
}

const mockForm: FormGroup = new FormGroup({
  titleCode: new FormControl(),
  firstName: new FormControl(),
  lastName: new FormControl(),
  companyName: new FormControl(),
  email: new FormControl(),
  country: new FormGroup({
    isocode: new FormControl(),
  }),
  region: new FormGroup({
    isocode: new FormControl(),
  }),
  town: new FormControl(),
  line1: new FormControl(),
  line2: new FormControl(),
  postalCode: new FormControl(),
  phoneNumber: new FormControl(),
  message: new FormControl(),
});

const mockRegions: Region[] = [
  {
    isocode: 'CA-ON',
    name: 'Ontario',
  },
  {
    isocode: 'CA-QC',
    name: 'Quebec',
  },
];

const mockTitles: Title[] = [
  {
    code: '0002',
    name: 'Mr.',
  },
  {
    code: '0001',
    name: 'Mrs.',
  },
];

const mockCountries: Country[] = [
  {
    isocode: 'CA',
    name: 'Canada',
  },
  {
    isocode: 'PL',
    name: 'Poland',
  },
];

class MockUserRegistrationFormService
  implements Partial<UserRegistrationFormService>
{
  getTitles(): Observable<Title[]> {
    return of(mockTitles);
  }

  getCountries(): Observable<Country[]> {
    return of(mockCountries);
  }

  getRegions(): Observable<Region[]> {
    return of(mockRegions);
  }

  get form(): FormGroup {
    return mockForm;
  }
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}
describe('UserRegistrationOTPFormComponent', () => {
  let component: UserRegistrationOTPFormComponent;
  let fixture: ComponentFixture<UserRegistrationOTPFormComponent>;
  let verificationTokenFacade: VerificationTokenFacade;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        I18nTestingModule,
        NgSelectModule,
        FormErrorsModule,
      ],
      declarations: [
        UserRegistrationOTPFormComponent,
        MockUrlPipe,
        NgSelectA11yDirective,
        SpinnerComponent,
        MockFeatureDirective,
      ],
      providers: [
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
        {
          provide: VerificationTokenFacade,
          useClass: MockVerificationTokenFacade,
        },
        {
          provide: UserRegistrationFormService,
          useClass: MockUserRegistrationFormService,
        },
      ],
    });
    verificationTokenFacade = TestBed.inject(VerificationTokenFacade);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegistrationOTPFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.registerForm.setValue({
      titleCode: '0001',
      firstName: 'John',
      lastName: 'Doe',
      companyName: 'Company',
      email: '',
      country: { isocode: 'CA' },
      region: { isocode: 'CA-ON' },
      town: 'Townsville',
      line1: '123 Main St',
      line2: '',
      postalCode: '12345',
      phoneNumber: '1234567890',
      message: '',
    });
    component.onSubmit();
    expect(
      verificationTokenFacade.createVerificationToken
    ).not.toHaveBeenCalled();
  });

  it('should submit form when valid', () => {
    const verificationData = {
      loginId: 'test@example.com',
      purpose: 'REGISTRATION',
    };
    component.registerForm.setValue({
      titleCode: '0001',
      firstName: 'John',
      lastName: 'Doe',
      companyName: 'Company',
      email: 'test@example.com',
      country: { isocode: 'CA' },
      region: { isocode: 'CA-ON' },
      town: 'Townsville',
      line1: '123 Main St',
      line2: '',
      postalCode: '12345',
      phoneNumber: '1234567890',
      message: '',
    });
    component.onSubmit();
    expect(
      verificationTokenFacade.createVerificationToken
    ).toHaveBeenCalledWith(verificationData);
  });

  it('should mark all fields as touched if form is invalid', () => {
    spyOn(component.registerForm, 'markAllAsTouched').and.callThrough();
    component.registerForm.patchValue({
      email: '',
    });
    component.onSubmit();
    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
    expect(
      verificationTokenFacade.createVerificationToken
    ).not.toHaveBeenCalled();
  });

  it('should navigate to verifyTokenRegister route', () => {
    const routingService = TestBed.inject(RoutingService);
    spyOn(routingService, 'go').and.callThrough();
    const verificationToken = { tokenId: 'testToken', expiresIn: '300' };
    const formData = {
      email: 'test@example.com',
      titleCode: '0001',
      firstName: 'John',
      lastName: 'Doe',
      companyName: 'Company',
      country: { isocode: 'CA' },
      region: { isocode: 'CA-ON' },
      town: 'Townsville',
      line1: '123 Main St',
      line2: '',
      postalCode: '12345',
      phoneNumber: '1234567890',
      message: '',
    };
    component.registerForm.setValue(formData);
    component['goToVerificationTokenForm'](verificationToken);
    expect(routingService.go).toHaveBeenCalledWith(
      { cxRoute: 'registerVerifyToken' },
      {
        state: {
          form: formData,
          loginId: 'test@example.com',
          tokenId: 'testToken',
          expiresIn: '300',
        },
      }
    );
  });
});
