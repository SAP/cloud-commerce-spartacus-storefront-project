import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CdcJsService } from '@spartacus/cdc/root';
import {
  Command,
  CommandService,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';
import { User } from '@spartacus/user/account/root';
import { RegisterComponentService } from '@spartacus/user/profile/components';
import { UserRegisterFacade, UserSignUp } from '@spartacus/user/profile/root';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class CDCRegisterComponentService extends RegisterComponentService {
  protected registerCommand: Command<{ user: UserSignUp }, User> =
    this.command.create(({ user }) =>
      // Registering user through CDC Gigya SDK
      this.cdcJSService.registerUserWithoutScreenSet(user).pipe(
        tap((result) => {
          if (result.status !== 'OK') {
            throw new Error(`Received an unexpected status: ${result.status}`);
          }
        })
      )
    );

  constructor(
    protected userRegisterFacade: UserRegisterFacade,
    protected command: CommandService,
    protected store: Store,
    protected cdcJSService: CdcJsService,
    protected globalMessageService: GlobalMessageService
  ) {
    super(userRegisterFacade);
  }

  /**
   * Register a new user using CDC SDK.
   *
   * @param user as UserSignUp
   */
  register(user: UserSignUp): Observable<User> {
    if (!user.firstName || !user.lastName || !user.uid || !user.password) {
      throw new Error(`The provided user is not valid: ${user}`);
    }

    return this.cdcJSService.didLoad().pipe(
      tap((cdcLoaded) => {
        if (!cdcLoaded) {
          this.globalMessageService.add(
            {
              key: 'errorHandlers.scriptFailedToLoad',
            },
            GlobalMessageType.MSG_TYPE_ERROR
          );
          throw new Error(`CDC script didn't load.`);
        }
      }),
      switchMap(() =>
        // Logging in using CDC Gigya SDK, update the registerCommand
        this.registerCommand.execute({ user })
      )
    );
  }
}
