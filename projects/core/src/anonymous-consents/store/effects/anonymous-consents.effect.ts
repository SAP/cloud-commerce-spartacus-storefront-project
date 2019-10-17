import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { AuthActions, AuthService } from '../../../auth/index';
import { isFeatureLevel } from '../../../features-config/index';
import { SiteContextActions } from '../../../site-context/index';
import { UserConsentService } from '../../../user/facade/user-consent.service';
import { UserActions } from '../../../user/store/actions/index';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { AnonymousConsentsConfig } from '../../config/anonymous-consents-config';
import { AnonymousConsentTemplatesConnector } from '../../connectors/anonymous-consent-templates.connector';
import { AnonymousConsentsService } from '../../facade/index';
import { AnonymousConsentsActions } from '../actions/index';

@Injectable()
export class AnonymousConsentsEffects {
  @Effect()
  handleLogoutAndLanguageChange$: Observable<
    AnonymousConsentsActions.LoadAnonymousConsentTemplates
  > = this.actions$.pipe(
    ofType(SiteContextActions.LANGUAGE_CHANGE, AuthActions.LOGOUT),
    // TODO(issue:4989) Anonymous consents - remove this filter
    filter(_ => isFeatureLevel(this.anonymousConsentsConfig, '1.3')),
    withLatestFrom(this.authService.isUserLoggedIn()),
    filter(([_, isUserLoggedIn]) => !isUserLoggedIn),
    map(_ => new AnonymousConsentsActions.LoadAnonymousConsentTemplates())
  );

  @Effect()
  loadAnonymousConsentTemplates$: Observable<
    AnonymousConsentsActions.AnonymousConsentsActions
  > = this.actions$.pipe(
    ofType(AnonymousConsentsActions.LOAD_ANONYMOUS_CONSENT_TEMPLATES),
    // TODO(issue:4989) Anonymous consents - remove this filter
    filter(_ => isFeatureLevel(this.anonymousConsentsConfig, '1.3')),
    concatMap(_ =>
      this.anonymousConsentTemplatesConnector
        .loadAnonymousConsentTemplates()
        .pipe(
          withLatestFrom(this.anonymousConsentService.getTemplates()),
          mergeMap(([newConsentTemplates, currentConsentTemplates]) => {
            let updated = false;
            if (
              Boolean(currentConsentTemplates) &&
              currentConsentTemplates.length !== 0
            ) {
              updated = this.anonymousConsentService.detectUpdatedTemplates(
                currentConsentTemplates,
                newConsentTemplates
              );
            }

            return [
              new AnonymousConsentsActions.LoadAnonymousConsentTemplatesSuccess(
                newConsentTemplates
              ),
              new AnonymousConsentsActions.ToggleAnonymousConsentTemplatesUpdated(
                updated
              ),
            ];
          }),
          catchError(error =>
            of(
              new AnonymousConsentsActions.LoadAnonymousConsentTemplatesFail(
                makeErrorSerializable(error)
              )
            )
          )
        )
    )
  );

  @Effect()
  transferAnonymousConsentsToUser$: Observable<
    UserActions.TransferAnonymousConsent | Observable<never>
  > = this.actions$.pipe(
    ofType<AuthActions.LoadUserTokenSuccess>(
      AuthActions.LOAD_USER_TOKEN_SUCCESS
    ),
    filter(
      () =>
        // TODO(issue:4989) Anonymous consents - remove the `isFeatureLevel(this.anonymousConsentsConfig, '1.3')` check
        isFeatureLevel(this.anonymousConsentsConfig, '1.3') &&
        Boolean(this.anonymousConsentsConfig.anonymousConsents) &&
        Boolean(this.anonymousConsentsConfig.anonymousConsents.registerConsent)
    ),
    withLatestFrom(
      this.actions$.pipe(
        ofType<UserActions.RegisterUserSuccess>(
          UserActions.REGISTER_USER_SUCCESS
        )
      )
    ),
    filter(([, registerAction]) => Boolean(registerAction)),
    concatMap(() =>
      this.anonymousConsentService.getConsents().pipe(
        withLatestFrom(
          this.authService.getOccUserId(),
          this.anonymousConsentService.getTemplates(),
          this.authService.isUserLoggedIn()
        ),
        filter(([, , , loggedIn]) => loggedIn),
        concatMap(([consents, userId, templates, _loggedIn]) => {
          const actions: UserActions.TransferAnonymousConsent[] = [];
          for (const consent of consents) {
            if (
              this.anonymousConsentService.isConsentGiven(consent) &&
              (!this.anonymousConsentsConfig.anonymousConsents
                .requiredConsents ||
                !this.anonymousConsentsConfig.anonymousConsents.requiredConsents.includes(
                  consent.templateCode
                ))
            ) {
              for (const template of templates) {
                if (template.id === consent.templateCode) {
                  actions.push(
                    new UserActions.TransferAnonymousConsent({
                      userId,
                      consentTemplateId: template.id,
                      consentTemplateVersion: template.version,
                    })
                  );
                  break;
                }
              }
            }
          }
          if (actions.length > 0) {
            return actions;
          }
          return EMPTY;
        })
      )
    )
  );

  @Effect()
  giveRequiredConsentsToUser$: Observable<
    UserActions.GiveUserConsent | Observable<never>
  > = this.actions$.pipe(
    ofType<AuthActions.LoadUserTokenSuccess>(
      AuthActions.LOAD_USER_TOKEN_SUCCESS
    ),
    filter(
      action =>
        // TODO(issue:4989) Anonymous consents - remove the `isFeatureLevel(this.anonymousConsentsConfig, '1.3')` check
        isFeatureLevel(this.anonymousConsentsConfig, '1.3') &&
        Boolean(this.anonymousConsentsConfig.anonymousConsents) &&
        Boolean(
          this.anonymousConsentsConfig.anonymousConsents.requiredConsents
        ) &&
        Boolean(action)
    ),
    concatMap(() =>
      this.userConsentService.getConsentsResultSuccess().pipe(
        withLatestFrom(
          this.authService.getOccUserId(),
          this.userConsentService.getConsents(),
          this.authService.isUserLoggedIn()
        ),
        filter(([, , , loggedIn]) => loggedIn),
        tap(([loaded, _userId, _templates, _loggedIn]) => {
          if (!loaded) {
            this.userConsentService.loadConsents();
          }
        }),
        map(([_loaded, userId, templates, _loggedIn]) => {
          return { userId, templates };
        }),
        concatMap(({ userId, templates }) => {
          const actions: UserActions.GiveUserConsent[] = [];
          for (const template of templates) {
            if (
              (!template.currentConsent ||
                !template.currentConsent.consentGivenDate ||
                template.currentConsent.consentWithdrawnDate) &&
              this.anonymousConsentsConfig.anonymousConsents.requiredConsents.includes(
                template.id
              )
            ) {
              actions.push(
                new UserActions.GiveUserConsent({
                  userId,
                  consentTemplateId: template.id,
                  consentTemplateVersion: template.version,
                })
              );
            }
          }
          if (actions.length > 0) {
            return actions;
          }
          return EMPTY;
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private anonymousConsentTemplatesConnector: AnonymousConsentTemplatesConnector,
    private authService: AuthService,
    private anonymousConsentsConfig: AnonymousConsentsConfig,
    private anonymousConsentService: AnonymousConsentsService,
    private userConsentService: UserConsentService
  ) {}
}
