/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { WindowRef } from '@spartacus/core';

export interface SkipFocusConfig {
  isEnabled: boolean;
  skipSelectors?: string[];
}

@Directive({
  selector: '[cxSkipFocus]',
})
export class SkipFocusDirective implements OnChanges {
  @Input('cxSkipFocus') config: SkipFocusConfig = { isEnabled: false };

  constructor(
    protected elementRef: ElementRef,
    protected winRef: WindowRef
  ) {}

  public ngOnChanges(_changes: SimpleChanges): void {
    this.excludeFromFocus(this.config.isEnabled, this.config.skipSelectors);
  }

  protected excludeFromFocus(
    isEnabled: boolean,
    skipSelectors: string[] = []
  ): void {
    const tabindex = isEnabled ? '-1' : '0';
    const focusableElementsSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]';

    const focusableElements = this.elementRef.nativeElement.querySelectorAll(
      focusableElementsSelector
    );
    Array.from(focusableElements || []).forEach((el) => {
      const element = el as HTMLElement;
      const shouldSkip = skipSelectors.some((selector) => {
        return (element as HTMLElement).matches(selector);
      });
      if (!shouldSkip && this.isElementVisible(element as HTMLElement)) {
        element.setAttribute('tabindex', tabindex);
      }
    });
  }

  protected isElementVisible(element: HTMLElement): boolean {
    const style = this.winRef.nativeWindow?.getComputedStyle(element);
    return (
      style?.visibility !== 'hidden' &&
      style?.display !== 'none' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }
}
