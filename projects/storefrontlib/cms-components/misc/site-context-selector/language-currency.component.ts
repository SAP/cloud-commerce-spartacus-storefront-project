/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SiteContextType } from './site-context.model';
import { SiteContextSelectorComponent } from './site-context-selector.component';

@Component({
    selector: 'cx-language-currency-selector',
    template: `
    <cx-site-context-selector
      [context]="siteContextType.LANGUAGE"
    ></cx-site-context-selector>
    <cx-site-context-selector
      [context]="siteContextType.CURRENCY"
    ></cx-site-context-selector>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SiteContextSelectorComponent],
})
export class LanguageCurrencyComponent {
  readonly siteContextType = SiteContextType;
}
