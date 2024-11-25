/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';
import { SkipLink } from '../config/skip-link.config';
import { SkipLinkService } from '../service/skip-link.service';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FocusDirective } from '../../keyboard-focus/focus.directive';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-skip-link',
  templateUrl: './skip-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, FocusDirective, NgFor, AsyncPipe, TranslatePipe],
})
export class SkipLinkComponent {
  skipLinks$: Observable<SkipLink[]> = this.skipLinkService.getSkipLinks();

  constructor(private skipLinkService: SkipLinkService) {
    useFeatureStyles('a11yVisibleFocusOverflows');
  }

  scrollToTarget(skipLink: SkipLink): void {
    this.skipLinkService.scrollToTarget(skipLink);
  }
}
