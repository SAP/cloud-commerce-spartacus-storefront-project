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
import { FocusDirective } from '@spartacus/storefront';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '@spartacus/core';
import { IconComponent } from '@spartacus/storefront';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-suggested-addresses-dialog',
  templateUrl: './suggested-addresses-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FocusDirective,
    NgIf,
    FeatureDirective,
    IconComponent,
    FormsModule,
    NgFor,
    AsyncPipe,
    TranslatePipe,
    TranslatePipe,
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
