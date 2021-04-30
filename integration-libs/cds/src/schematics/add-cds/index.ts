import {
  chain,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import {
  addLibraryFeature,
  addPackageJsonDependencies,
  CDS_CONFIG,
  CLI_CDS_FEATURE,
  createDependencies,
  createSpartacusDependencies,
  CustomConfig,
  installPackageJsonDependencies,
  readPackageJson,
  shouldAddFeature,
  SPARTACUS_CDS,
  validateSpartacusInstallation,
} from '@spartacus/schematics';
import { peerDependencies } from '../../../package.json';
import { CDS_FOLDER_NAME, CDS_MODULE, CDS_MODULE_NAME } from '../constants';
import { Schema as SpartacusCdsOptions } from './schema';

export function addCdsFeature(options: SpartacusCdsOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJson = readPackageJson(tree);
    validateSpartacusInstallation(packageJson);

    return chain([
      shouldAddFeature(CLI_CDS_FEATURE, options.features)
        ? addCds(options)
        : noop(),

      addCdsPackageJsonDependencies(packageJson),
      installPackageJsonDependencies(),
    ]);
  };
}

function validateCdsOptions({ tenant, baseUrl }: SpartacusCdsOptions): void {
  if (!tenant) {
    throw new SchematicsException(`Please specify tenant name.`);
  }
  if (!baseUrl) {
    throw new SchematicsException(`Please specify the base URL.`);
  }
}

function addCdsPackageJsonDependencies(packageJson: any): Rule {
  const spartacusLibraries = createSpartacusDependencies(peerDependencies);
  const thirdPartyDependencies = createDependencies(peerDependencies);
  const dependencies = spartacusLibraries.concat(thirdPartyDependencies);

  return addPackageJsonDependencies(dependencies, packageJson);
}

function addCds(options: SpartacusCdsOptions): Rule {
  validateCdsOptions(options);

  const customConfig: CustomConfig[] = [
    {
      import: [
        {
          moduleSpecifier: SPARTACUS_CDS,
          namedImports: [CDS_CONFIG],
        },
      ],
      content: `<${CDS_CONFIG}>{
      cds: {
        tenant: '${options.tenant}',
        baseUrl: '${options.baseUrl}',
        endpoints: {
          strategyProducts: '/strategy/\${tenant}/strategies/\${strategyId}/products',
        },
        merchandising: {
          defaultCarouselViewportThreshold: 80,
        },
      },
    }`,
    },
  ];
  if (options.profileTagLoadUrl && options.profileTagConfigUrl) {
    customConfig.push({
      import: [
        {
          moduleSpecifier: SPARTACUS_CDS,
          namedImports: [CDS_CONFIG],
        },
      ],
      content: `<${CDS_CONFIG}>{
          cds: {
            profileTag: {
              javascriptUrl:
                '${options.profileTagLoadUrl}',
              configUrl:
                '${options.profileTagConfigUrl}',
              allowInsecureCookies: true,
            },
          },
        }`,
    });
  }

  return addLibraryFeature(
    { ...options, lazy: false },
    {
      folderName: CDS_FOLDER_NAME,
      moduleName: CDS_MODULE_NAME,
      featureModule: {
        importPath: SPARTACUS_CDS,
        name: CDS_MODULE,
        content: `${CDS_MODULE}.forRoot()`,
      },
      customConfig,
    }
  );
}
