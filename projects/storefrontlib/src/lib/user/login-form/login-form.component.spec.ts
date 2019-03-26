import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { AuthService, RoutingService, UserToken } from '@spartacus/core';

import { of, Observable } from 'rxjs';

import createSpy = jasmine.createSpy;

import { GlobalMessageService } from '@spartacus/core';
import { PipeTransform, Pipe } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

@Pipe({
  name: 'cxTranslateUrl'
})
class MockTranslateUrlPipe implements PipeTransform {
  transform() {}
}

import { LoginFormComponent } from './login-form.component';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

class MockAuthService {
  authorize = createSpy();
  getUserToken(): Observable<UserToken> {
    return of({ access_token: 'test' } as UserToken);
  }
}

class MockRoutingService {
  goByUrl = createSpy();
  clearRedirectUrl = createSpy();
  getRedirectUrl() {
    return of('/test');
  }
}

class MockGlobalMessageService {
  remove = createSpy();
}

class MockActivatedRoute {
  snapshot = {
    queryParams: {
      forced: false
    }
  };
}

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  let authService: MockAuthService;
  let routingService: MockRoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [LoginFormComponent, MockTranslateUrlPipe],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    routingService = TestBed.get(RoutingService);

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form property', () => {
    expect(component.form.controls['userId'].value).toBe('');
    expect(component.form.controls['password'].value).toBe('');
  });

  it('should login', () => {
    component.form.controls['userId'].setValue('test@email.com');
    component.form.controls['password'].setValue('secret');
    component.login();

    expect(authService.authorize).toHaveBeenCalledWith(
      'test@email.com',
      'secret'
    );
  });

  it('should redirect to returnUrl saved in store if there is one', () => {
    expect(routingService.goByUrl).toHaveBeenCalledWith('/test');
  });

  describe('userId form field', () => {
    let control: AbstractControl;

    beforeEach(() => {
      control = component.form.controls['userId'];
    });

    it('should NOT be valid when empty', () => {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    });

    it('should NOT be valid when is an invalid email', () => {
      control.setValue('with space@email.com');
      expect(control.valid).toBeFalsy();

      control.setValue('without.domain@');
      expect(control.valid).toBeFalsy();

      control.setValue('without.at.com');
      expect(control.valid).toBeFalsy();

      control.setValue('@without.username.com');
      expect(control.valid).toBeFalsy();
    });

    it('should be valid when is a valid email', () => {
      control.setValue('valid@email.com');
      expect(control.valid).toBeTruthy();

      control.setValue('valid123@example.email.com');
      expect(control.valid).toBeTruthy();
    });
  });

  describe('password form field', () => {
    let control: AbstractControl;

    beforeEach(() => {
      control = component.form.controls['password'];
    });

    it('should be valid when not empty', () => {
      control.setValue('not-empty');
      expect(control.valid).toBeTruthy();

      control.setValue('not empty');
      expect(control.valid).toBeTruthy();

      control.setValue(' ');
      expect(control.valid).toBeTruthy();
    });

    it('should NOT be valid when empty', () => {
      control.setValue('');
      expect(control.valid).toBeFalsy();

      control.setValue(null);
      expect(control.valid).toBeFalsy();
    });
  });

  describe('guest checkout', () => {
    it('should show "Register" when forced flag is false', () => {
      const registerLinkElement: HTMLElement = fixture.debugElement.query(
        By.css('.btn-register')
      ).nativeElement;
      const guestLink = fixture.debugElement.query(By.css('.btn-guest'));

      expect(guestLink).toBeFalsy();
      expect(registerLinkElement.textContent).toContain('Register');
    });

    it('should show "Guest checkout" when forced flag is true', () => {
      component.loginAsGuest = true;
      fixture.detectChanges();

      const guestLinkElement: HTMLElement = fixture.debugElement.query(
        By.css('.btn-guest')
      ).nativeElement;
      const registerLink = fixture.debugElement.query(By.css('.btn-register'));

      expect(registerLink).toBeFalsy();
      expect(guestLinkElement.textContent).toContain('Guest Checkout');
    });
  });
});
