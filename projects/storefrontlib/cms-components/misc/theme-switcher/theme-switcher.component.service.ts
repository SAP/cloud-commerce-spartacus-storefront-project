/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { SiteThemeService, SiteTheme } from '@spartacus/core';
import { Observable } from 'rxjs';

@Injectable()
export class ThemeSwitcherComponentService {
  constructor(protected siteThemeService: SiteThemeService) {}

  getItems(): Observable<SiteTheme[]> {
    return this.siteThemeService.getAll();
  }

  getActiveItem(): Observable<string> {
    return this.siteThemeService.getActive();
  }

  setActive(value: string): void {
    this.siteThemeService.setActive(value);
  }
}
