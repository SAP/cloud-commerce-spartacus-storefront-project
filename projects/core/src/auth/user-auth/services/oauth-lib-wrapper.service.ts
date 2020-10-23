import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { WindowRef } from '../../../window/window-ref';
import { StateWithClientAuth } from '../../client-auth/store/client-auth-state';
import { AuthConfigService } from './auth-config.service';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class OAuthLibWrapperService {
  constructor(
    protected store: Store<StateWithClientAuth>,
    protected oAuthService: OAuthService,
    protected authStorageService: AuthStorageService,
    protected authConfigService: AuthConfigService,
    @Inject(PLATFORM_ID) protected platformId: Object,
    protected winRef: WindowRef
  ) {
    this.initialize();
  }

  protected initialize() {
    const isSSR = isPlatformServer(this.platformId);
    this.oAuthService.configure({
      tokenEndpoint: this.authConfigService.getTokenEndpoint(),
      loginUrl: this.authConfigService.getLoginEndpoint(),
      clientId: this.authConfigService.getClientId(),
      dummyClientSecret: this.authConfigService.getClientSecret(),
      revocationEndpoint: this.authConfigService.getRevokeEndpoint(),
      logoutUrl: this.authConfigService.getLogoutUrl(),
      userinfoEndpoint: this.authConfigService.getUserinfoEndpoint(),
      issuer:
        this.authConfigService.getOAuthLibConfig()?.issuer ??
        this.authConfigService.getBaseUrl(),
      redirectUri:
        this.authConfigService.getOAuthLibConfig()?.redirectUri ?? !isSSR
          ? this.winRef.nativeWindow.location.origin
          : '',
      ...this.authConfigService.getOAuthLibConfig(),
    });
  }

  authorizeWithPasswordFlow(
    userId: string,
    password: string
  ): Promise<TokenResponse> {
    return this.oAuthService.fetchTokenUsingPasswordFlow(userId, password);
  }

  refreshToken(): void {
    this.oAuthService.refreshToken();
  }

  revokeAndLogout(): Promise<any> {
    return new Promise((resolve) => {
      this.oAuthService
        .revokeTokenAndLogout()
        .catch(() => {
          // when there would be some kind of error during revocation we can't do anything else, so at least we logout user.
          this.oAuthService.logOut();
        })
        .finally(() => {
          resolve();
        });
    });
  }

  logout(): void {
    this.oAuthService.logOut();
  }

  // TODO: Play more with id token stuff
  getIdToken(): string {
    return this.oAuthService.getIdToken();
  }

  initLoginFlow() {
    return this.oAuthService.initLoginFlow();
  }

  // TODO: We don't load discovery document, because it doesn't contain revoke endpoint information
  tryLogin() {
    return this.oAuthService.tryLogin({
      disableOAuth2StateCheck: true,
    });
  }
}
