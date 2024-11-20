/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, NgModule, Output } from '@angular/core';

// PRIVATE TESTING UTIL
@Component({
  template: '<ng-content></ng-content>',
  selector: 'cx-split-view',
  standalone: true,
})
export class MockSplitViewComponent {
  @Input() hideMode;
}

@Component({
  template: '<ng-content></ng-content>',
  selector: 'cx-view',
  standalone: true,
})
export class MockViewComponent {
  @Input() position: number;
  @Input() hidden;
  @Output() hiddenChange;
}

const mockComponents = [MockSplitViewComponent, MockViewComponent];

@NgModule({
  imports: [...mockComponents],
  exports: mockComponents,
})
export class SplitViewTestingModule {}
