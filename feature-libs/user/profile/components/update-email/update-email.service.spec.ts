import { TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import {
  AuthService,
  GlobalMessage,
  GlobalMessageService,
  GlobalMessageType,
  I18nTestingModule,
  RoutingService,
  UrlCommands,
} from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';
import { UserEmailFacade } from '@spartacus/user/profile/root';
import { Observable, of } from 'rxjs';
import { UpdateEmailService } from './update-email.service';

class MockUserEmailService implements Partial<UserEmailFacade> {
  update(_password: string, _newUid: string): Observable<unknown> {
    return of({});
  }
}

class MockAuthService {
  coreLogout() {
    return Promise.resolve();
  }
}

class MockRoutingService {
  go(
    _commands: any[] | UrlCommands,
    _query?: object,
    _extras?: NavigationExtras
  ): void {}
}
class MockGlobalMessageService {
  add(_message: GlobalMessage): void {}
}

describe('UpdateEmailService', () => {
  let service: UpdateEmailService;
  let userService: UserEmailFacade;
  let authService: AuthService;
  let routingService: RoutingService;
  let globalMessageService: GlobalMessageService;
  let newUid: AbstractControl;
  let confirmNewUid: AbstractControl;
  let password: AbstractControl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, I18nTestingModule, FormErrorsModule],
      providers: [
        UpdateEmailService,
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
        {
          provide: UserEmailFacade,
          useClass: MockUserEmailService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(UpdateEmailService);

    routingService = TestBed.inject(RoutingService);
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserEmailFacade);
    globalMessageService = TestBed.inject(GlobalMessageService);

    newUid = service.form.controls.email;
    confirmNewUid = service.form.controls.confirmEmail;
    password = service.form.controls.password;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('reset()', () => {
    spyOn(service.form, 'reset').and.callThrough();
    service.reset();

    expect(service.form.reset).toHaveBeenCalled();
  });

  describe('save', () => {
    beforeEach(() => {
      spyOn(userService, 'update').and.callThrough();
      spyOn(globalMessageService, 'add').and.stub();
      spyOn(authService, 'coreLogout').and.callThrough();
      spyOn(routingService, 'go').and.stub();
      newUid.setValue('tester@sap.com');
      confirmNewUid.setValue('tester@sap.com');
      password.setValue('Qwe123!');
    });

    it('should not save invalid email', () => {
      confirmNewUid.setValue('diff@sap.com');
      service.save();
      expect(userService.update).not.toHaveBeenCalled();
      expect(globalMessageService.add).not.toHaveBeenCalled();
      expect(authService.coreLogout).not.toHaveBeenCalled();
      expect(routingService.go).not.toHaveBeenCalled();
    });

    it('should save valid email', () => {
      service.save();
      expect(userService.update).toHaveBeenCalledWith(
        'Qwe123!',
        'tester@sap.com'
      );
    });

    it('should show message', () => {
      service.save();
      expect(globalMessageService.add).toHaveBeenCalledWith(
        {
          key: 'updateEmailForm.emailUpdateSuccess',
          params: { newUid: 'tester@sap.com' },
        },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    });

    it('should logout', () => {
      service.save();
      expect(authService.coreLogout).toHaveBeenCalled();
    });

    it('should reroute to the login page', (done: DoneFn) => {
      service.save();
      authService.coreLogout().then(() => {
        expect(routingService.go).toHaveBeenCalledWith(
          { cxRoute: 'login' },
          undefined,
          {
            state: {
              newUid: 'tester@sap.com',
            },
          }
        );

        done();
      });
    });
  });
});
