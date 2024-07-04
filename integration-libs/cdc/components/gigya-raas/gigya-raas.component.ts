/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { GigyaRaasComponentData } from '@spartacus/cdc/core';
import { CdcConfig, CdcJsService } from '@spartacus/cdc/root';
import {
  AuthRedirectService,
  AuthService,
  BaseSiteService,
  LanguageService,
  RoutingService,
  WindowRef,
} from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-gigya-raas',
  templateUrl: './gigya-raas.component.html',
  styleUrls: ['./gigya-raas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GigyaRaasComponent implements OnInit {
  protected renderScreenSet = true;
  language$: Observable<string>;
  jsError$: Observable<boolean>;
  jsLoaded$: Observable<boolean>;

  protected authService = inject(AuthService);
  protected routingService = inject(RoutingService);
  protected authRedirectService = inject(AuthRedirectService);

  public constructor(
    public component: CmsComponentData<GigyaRaasComponentData>,
    private baseSiteService: BaseSiteService,
    private languageService: LanguageService,
    private cdcConfig: CdcConfig,
    private winRef: WindowRef,
    private cdcJSService: CdcJsService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.component.data$.subscribe((data) => {
      this.canActivate(data).subscribe((canActivate) => {
        if (canActivate) {
          this.jsLoaded$ = this.cdcJSService.didLoad();
          this.jsError$ = this.cdcJSService.didScriptFailToLoad();
          this.language$ = this.languageService.getActive().pipe(
            distinctUntilChanged(),
            // On language change we want to rerender CDC screen with proper translations
            tap(() => (this.renderScreenSet = true))
          );
        }
      });
    });
  }

  /**
   * Display screen set in embed mode
   *
   * @param data - GigyaRaasComponentData
   * @param lang - language
   */
  displayScreenSet(data: GigyaRaasComponentData, lang: string): void {
    if (this.renderScreenSet) {
      this.showScreenSet(data, lang);
    }
    this.renderScreenSet = false;
  }

  /**
   * Show screen set
   *
   * @param data - GigyaRaasComponentData
   * @param lang - language
   */
  showScreenSet(data: GigyaRaasComponentData, lang: string) {
    (this.winRef.nativeWindow as { [key: string]: any })?.[
      'gigya'
    ]?.accounts?.showScreenSet({
      screenSet: data.screenSet,
      startScreen: data.startScreen,
      lang,
      ...(this.displayInEmbedMode(data)
        ? { containerID: data.containerID }
        : {}),
      ...(this.isLoginScreenSet(data)
        ? { sessionExpiration: this.getSessionExpirationValue() }
        : {
            onAfterSubmit: (...params: any[]) => {
              this.zone.run(() =>
                this.cdcJSService.onProfileUpdateEventHandler(...params)
              );
            },
          }),
    });
  }

  protected isLoginScreenSet(data: GigyaRaasComponentData): boolean {
    const profileEditScreen: boolean =
      data.profileEdit === 'true' ? true : false;

    return !profileEditScreen;
  }

  protected getSessionExpirationValue(): number {
    if (this.cdcConfig?.cdc !== undefined) {
      const filteredConfigs: any = this.cdcConfig.cdc.filter(
        (conf) => conf.baseSite === this.getCurrentBaseSite()
      );
      if (filteredConfigs && filteredConfigs.length > 0) {
        return filteredConfigs[0].sessionExpiration;
      }
    }
    // Return a default value
    return 3600;
  }

  private getCurrentBaseSite(): string {
    let baseSite: string = '';
    this.baseSiteService
      .getActive()
      .pipe(take(1))
      .subscribe((data) => (baseSite = data));
    return baseSite;
  }

  /**
   * Check if the component should be displayed in embed mode
   *
   * @param data - GigyaRaasComponentData
   */
  displayInEmbedMode(data: GigyaRaasComponentData): boolean {
    const embedValue: boolean = data.embed === 'true' ? true : false;
    if (embedValue && data.containerID && data.containerID.length > 0) {
      return true;
    }
    return false;
  }

  canActivate(data: GigyaRaasComponentData): Observable<boolean> {
    return this.authService.isUserLoggedIn().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn && data.showAnonymous === 'false') {
          this.authRedirectService.saveCurrentNavigationUrl();
          this.routingService.go({ cxRoute: 'login' });
          return false;
        }
        if (isLoggedIn && data.showLoggedIn === 'false') {
          this.routingService.go({ cxRoute: 'home' });
          return false;
        }
        return true;
      })
    );
  }
}
