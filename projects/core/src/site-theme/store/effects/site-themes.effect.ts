/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  bufferCount,
  catchError,
  exhaustMap,
  filter,
  map,
  take,
} from 'rxjs/operators';
import { LoggerService } from '../../../logger';
import { SiteTheme } from '../../../model/misc.model';
import { BaseSiteService } from '../../../site-context/facade/base-site.service';
import { normalizeHttpError } from '../../../util/normalize-http-error';
import { SiteThemeConfig } from '../../config/site-theme-config';
import { SiteThemeActions } from '../actions/index';
import { getActiveSiteTheme } from '../selectors/site-themes.selectors';
import { StateWithSiteTheme } from '../state';

@Injectable()
export class SiteThemesEffects {
  protected logger = inject(LoggerService);
  protected actions$ = inject(Actions);
  protected state = inject(Store<StateWithSiteTheme>);
  protected config = inject(SiteThemeConfig);
  protected baseSiteService = inject(BaseSiteService);

  loadSiteThemes$: Observable<
    SiteThemeActions.LoadSiteThemesSuccess | SiteThemeActions.LoadSiteThemesFail
  > = createEffect(() =>
    this.actions$.pipe(
      ofType(SiteThemeActions.LOAD_SITE_THEMES),
      exhaustMap(() => {
        return this.getCustomSiteTheme().pipe(
          // just a not related cleanup
          map((siteTheme) => {
            let siteThemes = this.config.siteTheme?.siteThemes || [];
            let hasDefaultTheme = false;

            siteThemes = siteThemes.map((theme) => {
              if (theme.default) {
                hasDefaultTheme = true;
                return { ...theme, className: siteTheme ?? '' };
              }
              return theme;
            });

            if (!hasDefaultTheme) {
              siteThemes.push(this.getNewDefaultTheme(siteTheme));
            }

            return new SiteThemeActions.LoadSiteThemesSuccess(siteThemes);
          }),
          catchError((error) =>
            of(
              new SiteThemeActions.LoadSiteThemesFail(
                normalizeHttpError(error, this.logger)
              )
            )
          )
        );
      })
    )
  );

  activateSiteTheme$: Observable<SiteThemeActions.SiteThemeChange> =
    createEffect(() =>
      this.state.select(getActiveSiteTheme).pipe(
        bufferCount(2, 1),
        filter(([previous]) => !!previous),
        map(
          ([previous, current]) =>
            new SiteThemeActions.SiteThemeChange({ previous, current })
        )
      )
    );

  private getCustomSiteTheme(): Observable<string | undefined> {
    return this.baseSiteService.get().pipe(
      take(1),
      map((baseSite) => baseSite?.theme)
    );
  }

  private getNewDefaultTheme(siteTheme: string | undefined): SiteTheme {
    return {
      i18nNameKey: 'themeSwitcher.themes.default',
      className: siteTheme || '',
      default: true,
    };
  }
}