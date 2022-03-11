import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { migrateConstructorDeprecation } from '../../mechanism/constructor-deprecations/constructor-deprecations';
import { CONSTRUCTOR_DEPRECATIONS_DATA } from './data/constructor-deprecations.migration';

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return migrateConstructorDeprecation(
      tree,
      context,
      CONSTRUCTOR_DEPRECATIONS_DATA
    );
  };
}
