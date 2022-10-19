/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { MethodPropertyDeprecation } from '../../../shared/utils/file-utils';
import { migrateMethodPropertiesDeprecation } from '../../mechanism/methods-and-properties-deprecations/methods-and-properties-deprecations';
import { GENERATED_METHODS_AND_PROPERTIES_MIGRATION } from './data/generated-methods-and-properties.migration';
import { CDS_MERCHANDISING_PRODUCT_SERVICE_MIGRATION } from './data/cds-merchandising-product.service.migration';

export const METHODS_AND_PROPERTIES_DEPRECATIONS_DATA: MethodPropertyDeprecation[] =
  [
    ...GENERATED_METHODS_AND_PROPERTIES_MIGRATION,
    ...CDS_MERCHANDISING_PRODUCT_SERVICE_MIGRATION,
  ];

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return migrateMethodPropertiesDeprecation(
      tree,
      context,
      METHODS_AND_PROPERTIES_DEPRECATIONS_DATA
    );
  };
}
