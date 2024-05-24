/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, OnDestroy } from '@angular/core';
import {
  BaseSite,
  BaseSiteService,
  CaptchaConfig,
  LanguageService,
  ScriptLoader,
  SiteAdapter,
} from '@spartacus/core';
import {
  forkJoin,
  Observable,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { CaptchaProvider, RenderParams } from './captcha.model';
import { RecaptchaApiConfig } from './mockRecaptcha/config/recaptcha-api-config';

/**
 * Global function to be passes as "onload" url param for captcha <script>, to be
 * triggered once script and dependencies are loaded
 */
declare global {
  interface Window {
    onCaptchaLoad: () => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export abstract class RecaptchaService implements CaptchaProvider, OnDestroy {
  protected token: string;
  protected subscription = new Subscription();
  protected captchaConfigSubject$ = new ReplaySubject<CaptchaConfig>(1);
  protected captchaConfig: CaptchaConfig;

  constructor(
    protected adapter: SiteAdapter,
    protected apiConfig: RecaptchaApiConfig,
    protected languageService: LanguageService,
    protected scriptLoader: ScriptLoader,
    protected baseSiteService: BaseSiteService
  ) {
    this.initialize();
  }

  /**
   * Retrieve captcha configuration from the backend, and if enabled
   * call @function loadScript with active language
   */
  initialize(): void {
    this.subscription.add(
      forkJoin([
        this.languageService.getActive().pipe(take(1)),
        this.baseSiteService.getActive().pipe(
          concatMap((value) => this.adapter.loadBaseSite(value)),
          take(1)
        ),
      ]).subscribe((result) => {
        const lang = result[0] as string;
        const baseSite = result[1] as BaseSite;
        // -- test code starts
        if (baseSite) {
          baseSite.captchaConfig = {
            enabled: true
          };
        }
        // -- test code ends

        if (baseSite?.captchaConfig?.enabled) {
          this.captchaConfig = baseSite.captchaConfig;
          this.loadResource({
            lang: lang,
            config: this.captchaConfig,
          });
        } else {
          this.captchaConfigSubject$.next({ enabled: false });
        }
      })
    );
  }

  getCaptchaConfig(): Observable<CaptchaConfig> {
    return this.captchaConfigSubject$.asObservable();
  }

  /**
   * Trigger rendering function configured in RecaptchaApiConfig
   * @param {HTMLElement} elem - HTML element to render captcha widget within.
   */
  abstract renderCaptcha(renderParams: RenderParams): Observable<string>;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getToken(): string {
    return this.token;
  }

  /**
   * Load external resource if needed with dependencies to be added to <head>.
   * @param - Language and configuration read from server
   */
  loadResource(params?: { lang: string; config: CaptchaConfig }): void {
    console.log(params);
    this.captchaConfigSubject$.next(this.captchaConfig);
  }
}
