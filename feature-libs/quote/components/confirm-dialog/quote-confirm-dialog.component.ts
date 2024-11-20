/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CxDatePipe, TranslationService } from '@spartacus/core';
import { QuoteCoreConfig } from '@spartacus/quote/core';
import {
  FocusConfig,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ConfirmationContext } from './quote-confirm-dialog.model';
import { MockDatePipe } from '../../../../projects/core/src/i18n/testing/mock-date.pipe';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { CxDatePipe as CxDatePipe_1 } from '../../../../projects/core/src/i18n/date.pipe';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { IconComponent } from '../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { FeatureDirective } from '../../../../projects/core/src/features-config/directives/feature.directive';
import { NgIf, AsyncPipe } from '@angular/common';
import { FocusDirective } from '../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';

@Component({
  selector: 'cx-quote-confirm-dialog',
  templateUrl: './quote-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CxDatePipe],
  standalone: true,
  imports: [
    FocusDirective,
    NgIf,
    FeatureDirective,
    IconComponent,
    AsyncPipe,
    TranslatePipe,
    CxDatePipe_1,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class QuoteConfirmDialogComponent implements OnInit {
  protected launchDialogService = inject(LaunchDialogService);
  protected quoteCoreConfig = inject(QuoteCoreConfig);
  protected translationService = inject(TranslationService);
  protected cxDatePipe = inject(CxDatePipe);

  iconTypes = ICON_TYPE;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  confirmationContext$: Observable<ConfirmationContext>;

  ngOnInit(): void {
    this.confirmationContext$ = this.launchDialogService.data$.pipe(
      filter((data) => !!data),
      map((data) => data.confirmationContext)
    );
  }

  /**
   * Closes a modal with a certain reason.
   *
   * @param reason - Reason
   */
  dismissModal(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }

  protected isNotEmpty(value: string): boolean {
    return value && value.trim()?.length !== 0 ? true : false;
  }

  /**
   * Retrieves an accessibility text for the confirmation modal.
   *
   * @param context - confirmation context
   */
  getA11yModalText(context: ConfirmationContext): string {
    let translatedText = '';
    if (context.warningNote && this.isNotEmpty(context.warningNote)) {
      this.translationService
        .translate(context.warningNote)
        .pipe(take(1))
        .subscribe((text) => (translatedText += text));
    }

    if (
      context.validity &&
      this.isNotEmpty(context.validity) &&
      context.quote.expirationTime
    ) {
      this.translationService
        .translate(context.validity)
        .pipe(take(1))
        .subscribe((text) => (translatedText += text));

      const date = new Date(context.quote.expirationTime);
      translatedText += this.cxDatePipe.transform(date);
    }

    this.translationService
      .translate(context.confirmNote)
      .pipe(take(1))
      .subscribe((text) => (translatedText += text));

    return translatedText;
  }
}
