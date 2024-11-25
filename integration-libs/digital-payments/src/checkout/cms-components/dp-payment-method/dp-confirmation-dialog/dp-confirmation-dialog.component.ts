/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FocusConfig,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import { DP_CARD_REGISTRATION_STATUS } from '../../../../utils/dp-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { FocusDirective } from '../../../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';
import { FeatureDirective } from '../../../../../../../projects/core/src/features-config/directives/feature.directive';
import { IconComponent } from '../../../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { TranslatePipe } from '../../../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
  selector: 'cx-dp-confirmation-dialog',
  templateUrl: './dp-confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FocusDirective,
    FeatureDirective,
    IconComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class DpConfirmationDialogComponent {
  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };
  iconTypes = ICON_TYPE;
  protected launchDialogService = inject(LaunchDialogService);
  protected activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);
  cardSaveCancelled: boolean = false;

  dismissDialog(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }

  continue() {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };
    delete queryParams[DP_CARD_REGISTRATION_STATUS];
    this.router.navigate([], {
      queryParams,
      relativeTo: this.activatedRoute,
    });
    this.cardSaveCancelled = true;
    this.launchDialogService.closeDialog('continue clicked');
  }
}
