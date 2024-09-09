/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { FocusConfig } from './keyboard-focus.model';
import { LockFocusDirective } from './lock/lock-focus.directive';
import { KeyboardFocusService } from './services/keyboard-focus.service';

@Directive({
    selector: '[cxFocus]',
    standalone: true,
})
export class FocusDirective extends LockFocusDirective {
  protected defaultConfig: FocusConfig = {};

  @Input('cxFocus') config: FocusConfig = {};

  constructor(
    protected elementRef: ElementRef,
    protected service: KeyboardFocusService,
    protected renderer: Renderer2
  ) {
    super(elementRef, service, renderer);
  }
}
