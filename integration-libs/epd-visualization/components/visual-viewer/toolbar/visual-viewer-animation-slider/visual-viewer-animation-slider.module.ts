/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { VisualViewerAnimationSliderComponent } from './visual-viewer-animation-slider.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [VisualViewerAnimationSliderComponent],
  exports: [VisualViewerAnimationSliderComponent],
})
export class VisualViewerAnimationSliderModule {}
