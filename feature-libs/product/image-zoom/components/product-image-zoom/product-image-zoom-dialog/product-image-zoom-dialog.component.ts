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
  Input,
} from '@angular/core';
import { useFeatureStyles, I18nModule } from '@spartacus/core';
import { FocusConfig, ICON_TYPE, LaunchDialogService, KeyboardFocusModule, IconModule } from '@spartacus/storefront';
import { ProductImageZoomViewComponent } from '../product-image-zoom-view/product-image-zoom-view.component';

@Component({
    selector: 'cx-product-image-zoom-dialog',
    templateUrl: 'product-image-zoom-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        KeyboardFocusModule,
        IconModule,
        ProductImageZoomViewComponent,
        I18nModule,
    ],
})
export class ProductImageZoomDialogComponent {
  iconType = ICON_TYPE;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  @Input() galleryIndex: number;

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    // Close on click outside the dialog window
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef
  ) {
    useFeatureStyles('a11yCloseProductImageBtnFocus');
  }

  close(reason = ''): void {
    this.launchDialogService.closeDialog(reason);
  }
}
