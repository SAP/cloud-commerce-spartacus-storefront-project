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
  OnInit,
} from '@angular/core';
import { Address, useFeatureStyles } from '@spartacus/core';
import {
  FocusConfig,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import { take } from 'rxjs/operators';
import { MockTranslatePipe } from '../../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../../projects/core/src/i18n/translate.pipe';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { FeatureDirective } from '../../../../../../../projects/core/src/features-config/directives/feature.directive';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FocusDirective } from '../../../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';

@Component({
  selector: 'cx-suggested-addresses-dialog',
  templateUrl: './suggested-addresses-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FocusDirective,
    NgIf,
    FeatureDirective,
    IconComponent,
    FormsModule,
    NgFor,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class SuggestedAddressDialogComponent implements OnInit {
  iconTypes = ICON_TYPE;
  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  selectedAddress: Address;

  data$ = this.launchDialogService.data$;

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.closeModal('Cross click');
    }
  }

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef
  ) {
    useFeatureStyles('a11yExpandedFocusIndicator');
  }

  ngOnInit(): void {
    this.data$.pipe(take(1)).subscribe((data) => this.setSelectedAddress(data));
  }

  closeModal(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }

  setSelectedAddress(data: {
    suggestedAddresses: Address[];
    enteredAddress: Address;
  }): void {
    this.selectedAddress = data.suggestedAddresses?.length
      ? data.suggestedAddresses[0]
      : data.enteredAddress;
  }
}
