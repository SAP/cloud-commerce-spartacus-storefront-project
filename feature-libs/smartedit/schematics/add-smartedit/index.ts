import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  addLibraryFeature,
  addPackageJsonDependencies,
  createDependencies,
  installPackageJsonDependencies,
  LibraryOptions as SpartacusSmartEditOptions,
  readPackageJson,
  SPARTACUS_SMARTEDIT,
  validateSpartacusInstallation,
} from '@spartacus/schematics';
import { peerDependencies } from '../../package.json';
import {
  SMARTEDIT_FEATURE_NAME,
  SMARTEDIT_FOLDER_NAME,
  SMARTEDIT_MODULE,
  SMARTEDIT_ROOT_MODULE,
  SPARTACUS_SMARTEDIT_ASSETS,
  SPARTACUS_SMARTEDIT_ROOT,
} from '../constants';

export function addSmartEditFeatures(options: SpartacusSmartEditOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJson = readPackageJson(tree);
    validateSpartacusInstallation(packageJson);

    return chain([
      addSmartEditFeature(options),

      addSmarteditPackageJsonDependencies(packageJson),
      installPackageJsonDependencies(),
    ]);
  };
}

function addSmarteditPackageJsonDependencies(packageJson: any): Rule {
  const dependencies = createDependencies(peerDependencies);

  return addPackageJsonDependencies(dependencies, packageJson);
}

function addSmartEditFeature(options: SpartacusSmartEditOptions): Rule {
  return addLibraryFeature(options, {
    folderName: SMARTEDIT_FOLDER_NAME,
    name: SMARTEDIT_FEATURE_NAME,
    featureModule: {
      name: SMARTEDIT_MODULE,
      importPath: SPARTACUS_SMARTEDIT,
    },
    rootModule: {
      name: SMARTEDIT_ROOT_MODULE,
      importPath: SPARTACUS_SMARTEDIT_ROOT,
    },
    assets: {
      input: SPARTACUS_SMARTEDIT_ASSETS,
      glob: '**/*',
    },
  });
}
