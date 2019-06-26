import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { GlobalMessageType } from '../../../global-message/models/global-message.model';
import { GlobalMessageActions } from '../../../global-message/store/actions/index';
import { UserAdapter } from '../../connectors/user/user.adapter';
import { UserConnector } from '../../connectors/user/user.connector';
import * as fromActions from '../actions/index';
import { ForgotPasswordEffects } from './forgot-password.effect';

describe('', () => {
  let service: UserConnector;
  let effect: ForgotPasswordEffects;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ForgotPasswordEffects,
        { provide: UserAdapter, useValue: {} },
        provideMockActions(() => actions$),
      ],
    });

    effect = TestBed.get(ForgotPasswordEffects);
    service = TestBed.get(UserConnector);

    spyOn(service, 'requestForgotPasswordEmail').and.returnValue(of({}));
  });

  describe('requestForgotPasswordEmail$', () => {
    it('should be able to request a forgot password email', () => {
      const action = new fromActions.ForgotPasswordEmailRequest(
        'test@test.com'
      );
      const completion1 = new fromActions.ForgotPasswordEmailRequestSuccess();
      const completion2 = new GlobalMessageActions.AddMessage({
        text: { key: 'forgottenPassword.passwordResetEmailSent' },
        type: GlobalMessageType.MSG_TYPE_CONFIRMATION,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: completion1, c: completion2 });

      expect(effect.requestForgotPasswordEmail$).toBeObservable(expected);
    });
  });
});
