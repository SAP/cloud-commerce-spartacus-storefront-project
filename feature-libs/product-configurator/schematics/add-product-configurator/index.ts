import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  addLibraryFeature,
  addPackageJsonDependencies,
  CLI_PRODUCT_CONFIGURATOR_FEATURE,
  createDependencies,
  installPackageJsonDependencies,
  LibraryOptions as SpartacusProductConfiguratorOptions,
  readPackageJson,
  SKIP_SCOPES_FEATURES_LIBS,
  SPARTACUS_PRODUCT_CONFIGURATOR,
  validateSpartacusInstallation,
} from '@spartacus/schematics';
import { peerDependencies } from '../../package.json';
import {
  PRODUCT_CONFIGURATOR_FOLDER_NAME,
  PRODUCT_CONFIGURATOR_RULEBASED_FEATURE_NAME,
  PRODUCT_CONFIGURATOR_RULEBASED_MODULE,
  PRODUCT_CONFIGURATOR_RULEBASED_ROOT_MODULE,
  PRODUCT_CONFIGURATOR_SCSS_FILE_NAME,
  PRODUCT_CONFIGURATOR_TEXTFIELD_FEATURE_NAME,
  PRODUCT_CONFIGURATOR_TEXTFIELD_MODULE,
  PRODUCT_CONFIGURATOR_TEXTFIELD_ROOT_MODULE,
  PRODUCT_CONFIGURATOR_TRANSLATIONS,
  PRODUCT_CONFIGURATOR_TRANSLATION_CHUNKS_CONFIG,
  SPARTACUS_PRODUCT_CONFIGURATOR_ASSETS,
  SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED,
  SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED_ROOT,
  SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD,
  SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD_ROOT,
} from '../constants';

export function addProductConfiguratorFeatures(
  options: SpartacusProductConfiguratorOptions
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJson = readPackageJson(tree);
    validateSpartacusInstallation(packageJson);

    return chain([
      addProductConfiguratorRulebasedFeature(options),
      addProductConfiguratorTextfieldFeature(options),

      addProductConfiguratorPackageJsonDependencies(packageJson),
      installPackageJsonDependencies(),
    ]);
  };
}

function addProductConfiguratorPackageJsonDependencies(packageJson: any): Rule {
  const dependencies = createDependencies(
    peerDependencies,
    SKIP_SCOPES_FEATURES_LIBS
  );

  return addPackageJsonDependencies(dependencies, packageJson);
}

function addProductConfiguratorRulebasedFeature(
  options: SpartacusProductConfiguratorOptions
): Rule {
  return addLibraryFeature(options, {
    folderName: PRODUCT_CONFIGURATOR_FOLDER_NAME,
    name: CLI_PRODUCT_CONFIGURATOR_FEATURE,
    lazyModuleName: PRODUCT_CONFIGURATOR_RULEBASED_FEATURE_NAME,
    featureModule: {
      name: PRODUCT_CONFIGURATOR_RULEBASED_MODULE,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED,
    },
    rootModule: {
      name: PRODUCT_CONFIGURATOR_RULEBASED_ROOT_MODULE,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED_ROOT,
    },
    i18n: {
      resources: PRODUCT_CONFIGURATOR_TRANSLATIONS,
      chunks: PRODUCT_CONFIGURATOR_TRANSLATION_CHUNKS_CONFIG,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_ASSETS,
    },
    styles: {
      scssFileName: PRODUCT_CONFIGURATOR_SCSS_FILE_NAME,
      importStyle: SPARTACUS_PRODUCT_CONFIGURATOR,
    },
  });
}

function addProductConfiguratorTextfieldFeature(
  options: SpartacusProductConfiguratorOptions
): Rule {
  return addLibraryFeature(options, {
    folderName: PRODUCT_CONFIGURATOR_FOLDER_NAME,
    name: CLI_PRODUCT_CONFIGURATOR_FEATURE,
    lazyModuleName: PRODUCT_CONFIGURATOR_TEXTFIELD_FEATURE_NAME,
    featureModule: {
      name: PRODUCT_CONFIGURATOR_TEXTFIELD_MODULE,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD,
    },
    rootModule: {
      name: PRODUCT_CONFIGURATOR_TEXTFIELD_ROOT_MODULE,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD_ROOT,
    },
    i18n: {
      resources: PRODUCT_CONFIGURATOR_TRANSLATIONS,
      chunks: PRODUCT_CONFIGURATOR_TRANSLATION_CHUNKS_CONFIG,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_ASSETS,
    },
    styles: {
      scssFileName: PRODUCT_CONFIGURATOR_SCSS_FILE_NAME,
      importStyle: SPARTACUS_PRODUCT_CONFIGURATOR,
    },
  });
}
