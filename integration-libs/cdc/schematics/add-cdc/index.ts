import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  addLibraryFeature,
  addPackageJsonDependencies,
  addSchematicsTasks,
  createDependencies,
  installSpartacusFeatures,
  LibraryOptions as SpartacusCdcOptions,
  readPackageJson,
  SPARTACUS_ASM,
  SPARTACUS_CDC,
  SPARTACUS_USER,
  validateSpartacusInstallation,
} from '@spartacus/schematics';
import { peerDependencies } from '../../package.json';
import {
  CDC_CONFIG,
  CDC_FEATURE,
  CDC_FOLDER_NAME,
  CDC_MODULE,
  CDC_ROOT_MODULE,
  CLI_CDC_FEATURE,
  SPARTACUS_CDC_ROOT,
} from '../constants';

export function addCdcFeature(options: SpartacusCdcOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = readPackageJson(tree);
    validateSpartacusInstallation(packageJson);

    return chain([
      addCdc(options),

      addCdcPackageJsonDependencies(packageJson, context, options),
    ]);
  };
}

function addCdcPackageJsonDependencies(
  packageJson: any,
  context: SchematicContext,
  options: SpartacusCdcOptions
): Rule {
  const spartacusDeps = [SPARTACUS_ASM, SPARTACUS_USER];

  const rule = installSpartacusFeatures(spartacusDeps);
  const thirdPartyDependencies = createDependencies(peerDependencies);
  const thirdPartyPackagesRule = addPackageJsonDependencies(
    thirdPartyDependencies,
    packageJson
  );

  addSchematicsTasks(spartacusDeps, context, {
    ...options,
    features: [],
  });

  return chain([rule, thirdPartyPackagesRule]);
}

function addCdc(options: SpartacusCdcOptions): Rule {
  return addLibraryFeature(options, {
    folderName: CDC_FOLDER_NAME,
    name: CLI_CDC_FEATURE,
    rootModule: {
      importPath: SPARTACUS_CDC_ROOT,
      name: CDC_ROOT_MODULE,
      content: `${CDC_ROOT_MODULE}`,
    },
    featureModule: {
      importPath: SPARTACUS_CDC,
      name: CDC_MODULE,
    },
    lazyModuleName: `[CDC_FEATURE]`,
    customConfig: {
      import: [
        {
          moduleSpecifier: SPARTACUS_CDC_ROOT,
          namedImports: [CDC_CONFIG, CDC_FEATURE],
        },
      ],
      content: `<${CDC_CONFIG}>{
          cdc: [
            {
              baseSite: 'electronics-spa',
              javascriptUrl: '<url-to-cdc-script>',
              sessionExpiration: 3600
            },
          ],
        }`,
    },
  });
}
