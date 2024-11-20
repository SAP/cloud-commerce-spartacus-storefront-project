/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { OutletRefDirective } from '../../../../storefrontlib/cms-structure/outlet/outlet-ref/outlet-ref.directive';
import { PageLayoutComponent } from '../../../../storefrontlib/cms-structure/page/page-layout/page-layout.component';

@Component({
  selector: 'cx-test-outlet-component',
  templateUrl: './test-outlet-component.component.html',
  standalone: true,
  imports: [PageLayoutComponent, OutletRefDirective],
})
export class TestOutletComponentComponent {
  testComponent = 'CMSParagraphComponent';
}
