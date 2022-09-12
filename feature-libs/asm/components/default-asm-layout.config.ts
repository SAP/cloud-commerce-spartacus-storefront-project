/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutConfig } from '@commerce-storefront-toolset/storefront';
import { AsmMainUiComponent } from './asm-main-ui/asm-main-ui.component';

export const defaultAsmLayoutConfig: LayoutConfig = {
  launch: {
    ASM: {
      outlet: 'cx-storefront',
      component: AsmMainUiComponent,
    },
  },
};
