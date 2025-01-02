/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  MissingPackageMigration,
  migrateMissingPackage,
} from '../../mechanism/missing-packages/missing-packages';

const MISSING_PACKAGE_DATA: MissingPackageMigration[] = [];

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    for (const migrationData of MISSING_PACKAGE_DATA) {
      migrateMissingPackage(tree, context, migrationData);
    }
  };
}
