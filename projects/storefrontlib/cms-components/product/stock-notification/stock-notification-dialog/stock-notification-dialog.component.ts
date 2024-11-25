/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NotificationPreference,
  useFeatureStyles,
  UserInterestsService,
} from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { FocusConfig } from '../../../../layout/a11y/keyboard-focus/keyboard-focus.model';
import { LaunchDialogService } from '../../../../layout/index';
import { FocusDirective } from '../../../../layout/a11y/keyboard-focus/focus.directive';
import { FeatureDirective } from '@spartacus/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-stock-notification-dialog',
  templateUrl: './stock-notification-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FocusDirective,
    FeatureDirective,
    NgIf,
    NgFor,
    RouterLink,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class StockNotificationDialogComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  subscribeSuccess$: Observable<boolean>;
  enabledPrefs: NotificationPreference[] = [];

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }

  constructor(
    private interestsService: UserInterestsService,
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef
  ) {
    useFeatureStyles('a11yExpandedFocusIndicator');
  }

  close(reason?: any) {
    this.launchDialogService.closeDialog(reason);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        if (data) {
          this.init(data.subscribeSuccess$, data.enabledPrefs);
        }
      })
    );
  }

  init(
    subscribeSuccess$: Observable<boolean>,
    enabledPrefs: NotificationPreference[]
  ) {
    this.subscribeSuccess$ = subscribeSuccess$;
    this.enabledPrefs = enabledPrefs;
  }

  ngOnDestroy(): void {
    if (this.subscribeSuccess$) {
      this.subscribeSuccess$
        .subscribe((success) => {
          if (success) {
            this.interestsService.resetAddInterestState();
          }
        })
        .unsubscribe();
    }

    this.subscription.unsubscribe();
  }
}
