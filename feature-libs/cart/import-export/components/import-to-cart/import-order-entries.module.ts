/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CmsConfig,
  ConfigModule,
  I18nModule,
  provideConfig,
} from '@commerce-storefront-toolset/core';
import {
  FileUploadModule,
  FormErrorsModule,
  IconModule,
  KeyboardFocusModule,
} from '@commerce-storefront-toolset/storefront';
import { defaultImportEntriesLayoutConfig } from './default-import-entries-layout.config';
import { ImportEntriesDialogComponent } from './import-entries-dialog/import-entries-dialog.component';
import { ImportEntriesFormComponent } from './import-entries-dialog/import-entries-form/import-entries-form.component';
import { ImportEntriesSummaryComponent } from './import-entries-dialog/import-entries-summary/import-entries-summary.component';
import { ImportToNewSavedCartFormComponent } from './import-entries-dialog/import-to-new-saved-cart-form/import-to-new-saved-cart-form.component';
import { ImportOrderEntriesComponent } from './import-entries/import-order-entries.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
    IconModule,
    KeyboardFocusModule,
    FileUploadModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ImportOrderEntriesComponent: {
          component: ImportOrderEntriesComponent,
        },
      },
    }),
  ],
  declarations: [
    ImportOrderEntriesComponent,
    ImportEntriesDialogComponent,
    ImportEntriesFormComponent,
    ImportEntriesSummaryComponent,
    ImportToNewSavedCartFormComponent,
  ],
  exports: [
    ImportOrderEntriesComponent,
    ImportEntriesDialogComponent,
    ImportEntriesFormComponent,
    ImportEntriesSummaryComponent,
    ImportToNewSavedCartFormComponent,
  ],
  providers: [provideConfig(defaultImportEntriesLayoutConfig)],
})
export class ImportOrderEntriesModule {}
