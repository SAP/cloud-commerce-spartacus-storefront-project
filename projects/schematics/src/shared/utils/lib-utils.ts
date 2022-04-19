import { dasherize } from '@angular-devkit/core/src/utils/strings';
import {
  chain,
  ExecutionOptions,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  TaskId,
  Tree,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import {
  CMS_CONFIG,
  I18N_CONFIG,
  PROVIDE_CONFIG_FUNCTION,
  UTF_8,
} from '../constants';
import {
  SPARTACUS_CONFIGURATION_MODULE,
  SPARTACUS_CORE,
  SPARTACUS_FEATURES_MODULE,
  SPARTACUS_FEATURES_NG_MODULE,
  SPARTACUS_SETUP,
} from '../libs-constants';
import { getB2bConfiguration } from './config-utils';
import { getSpartacusFeaturesModule } from './feature-utils';
import {
  crossFeatureInstallationOrder,
  crossLibraryInstallationOrder,
} from './graph-utils';
import { createImports } from './import-utils';
import {
  addModuleImport,
  addModuleProvider,
  ensureModuleExists,
  Import,
} from './new-module-utils';
import {
  createDependencies,
  createSpartacusDependencies,
  getPrefixedSpartacusSchematicsVersion,
  readPackageJson,
} from './package-utils';
import { createProgram, saveAndFormat } from './program';
import { getProjectTsConfigPaths } from './project-tsconfig-paths';
import {
  getDefaultProjectNameFromWorkspace,
  getSourceRoot,
  getWorkspace,
  scaffoldStructure,
} from './workspace-utils';

export interface LibraryOptions extends Partial<ExecutionOptions> {
  project: string;
  lazy?: boolean;
  features?: string[];
  /**
   * When enabled, prints the additional logs.
   */
  // TODO:#schematics - leverage this flag and print the cross-feature order
  debug?: boolean;
  /**
   * Meta.
   * Populated when programmatically invoking
   * Spartacus installation schematics in order
   * to install them as dependencies.
   */
  options?: LibraryOptions;
}

export interface FeatureConfig {
  /**
   * Library options
   */
  library: {
    /**
     * The feature name, e.g. CHECKOUT_BASE_FEATURE
     */
    // TODO:#schematics - [at the end] - rename to featureName
    cli: string;
    /**
     * Spartacus library scope, e.g. `@spartacus/checkout`
     */
    mainScope: string;
    /**
     * E.g. `@spartacus/checkout/base/b2b`
     */
    featureScope?: string;
    /**
     * If the feature is a b2b feature, it will provide the b2b configuration.
     */
    b2b?: boolean;
  };
  /**
   * The folder in which we will generate the feature module. E.g. app/spartacus/features/__organization__ (__NOTE__: just the `organization` part should be provided.).
   */
  folderName: string;
  /**
   * Used as the generated feature module's file name.
   * Also, used as the lazy loading's feature name if the `lazyLoadingChunk` config is not provided.
   */
  moduleName: string;
  /**
   * The feature module configuration.
   */
  featureModule: Module | Module[];
  /**
   * The root module configuration.
   */
  rootModule?: Module;
  /**
   * The lazy loading chunk's name.
   * It's usually a constant imported from a library.
   */
  lazyLoadingChunk?: Import;
  /**
   * Translation chunk configuration
   */
  i18n?: I18NConfig;
  /**
   * Styling configuration
   */
  styles?: StylingConfig;
  /**
   * Assets configuration
   */
  assets?: AssetsConfig;
  /**
   * An optional custom configuration to provide to the generated module.
   */
  customConfig?: CustomConfig | CustomConfig[];
  /**
   * Contains the feature dependencies.
   * The key is a Spartacus scope, while the value is an array of its features.
   */
  dependencyManagement?: Record<string, string[]>;
  /**
   * Configuration for generating the wrapper modules.
   *
   * The key is the feature module name for which to search for
   * in either the feature module or the wrapper module.
   *
   * The values is the feature module name which should be added
   * to the wrapper module.
   */
  wrappers?: Record<string, string>;
}

export interface CustomConfig {
  import: Import[];
  content: string;
}

export interface Module {
  name: string;
  importPath: string;
  content?: string;
}

export interface I18NConfig {
  resources: string;
  chunks: string;
  importPath: string;
}

export interface StylingConfig {
  scssFileName: string;
  importStyle: string;
}

export interface AssetsConfig {
  input: string;
  output?: string;
  glob: string;
}

export function shouldAddFeature(
  feature: string,
  features: string[] = []
): boolean {
  return features.includes(feature);
}

export function addLibraryFeature<T extends LibraryOptions>(
  options: T,
  config: FeatureConfig
): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const spartacusFeatureModuleExistsInApp = checkAppStructure(
      tree,
      options.project
    );
    if (!spartacusFeatureModuleExistsInApp) {
      context.logger.info('Scaffolding the new app structure...');
      context.logger.warn(
        'Please migrate manually the rest of your feature modules to the new app structure: https://sap.github.io/spartacus-docs/reference-app-structure/'
      );
    }

    return chain([
      spartacusFeatureModuleExistsInApp ? noop() : scaffoldStructure(options),

      handleFeature(options, config),
      config.styles ? addLibraryStyles(config.styles, options) : noop(),
      config.assets ? addLibraryAssets(config.assets, options) : noop(),

      /**
       * TODO:#schematics - the ordering should happen:
       * 1. when Spartacus is already installed (dirty installation)
       * 2. when invoking feature library's schematics
       *
       * In other words, it's not necessary when installing Spartacus for the first time.
       */
    ]);
  };
}

export function checkAppStructure(tree: Tree, project: string): boolean {
  const { buildPaths } = getProjectTsConfigPaths(tree, project);

  if (!buildPaths.length) {
    throw new SchematicsException(
      `Could not find any tsconfig file. Can't find ${SPARTACUS_FEATURES_NG_MODULE}.`
    );
  }

  const basePath = process.cwd();
  for (const tsconfigPath of buildPaths) {
    if (getSpartacusFeaturesModule(tree, basePath, tsconfigPath)) {
      return true;
    }
  }
  return false;
}

function handleFeature<T extends LibraryOptions>(
  options: T,
  config: FeatureConfig
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const rules: Rule[] = [];

    rules.push(
      ensureModuleExists({
        name: createSpartacusFeatureFileName(config.moduleName),
        path: createSpartacusFeatureFolderPath(config.folderName),
        module: SPARTACUS_FEATURES_MODULE,
        project: options.project,
      })
    );
    rules.push(addRootModule(options, config));
    rules.push(addFeatureModule(options, config));
    rules.push(addFeatureTranslations(options, config));
    rules.push(addCustomConfig(options, config));
    if (config.library.b2b) {
      rules.push(configureB2bFeatures(options, readPackageJson(tree)));
    }

    return chain(rules);
  };
}

export function createSpartacusFeatureFolderPath(folderName: string): string {
  return `app/spartacus/features/${dasherize(folderName)}`;
}

export function createSpartacusFeatureFileName(name: string): string {
  return `${dasherize(name)}-feature`;
}

export function createSpartacusWrapperModuleFileName(name: string): string {
  return `${dasherize(name)}-wrapper`;
}

function addRootModule<T extends LibraryOptions>(
  options: T,
  config: FeatureConfig
): Rule {
  return (tree: Tree): Tree => {
    if (!config.rootModule) {
      return tree;
    }

    const basePath = process.cwd();
    const moduleFileName = createModuleFileName(config);

    const { buildPaths } = getProjectTsConfigPaths(tree, options.project);
    for (const tsconfigPath of buildPaths) {
      const { appSourceFiles } = createProgram(tree, basePath, tsconfigPath);

      for (const sourceFile of appSourceFiles) {
        if (!sourceFile.getFilePath().endsWith('/' + moduleFileName)) {
          continue;
        }

        addModuleImport(sourceFile, {
          import: {
            moduleSpecifier: config.rootModule.importPath,
            namedImports: [config.rootModule.name],
          },
          content: config.rootModule.content || config.rootModule.name,
        });

        saveAndFormat(sourceFile);
        break;
      }
    }

    return tree;
  };
}

function addFeatureModule<T extends LibraryOptions>(
  options: T,
  config: FeatureConfig
): Rule {
  return (tree: Tree) => {
    const basePath = process.cwd();
    const moduleFileName = createModuleFileName(config);

    /**
     * TODO:#schematics - skip if the feature the wrapper module is used.
     * first, check if the feature should be composed by checking the .wrappers
     * is it enough to just skip the adding if the wrapper config is present?
     */

    const { buildPaths } = getProjectTsConfigPaths(tree, options.project);
    for (const tsconfigPath of buildPaths) {
      const { appSourceFiles } = createProgram(tree, basePath, tsconfigPath);

      for (const sourceFile of appSourceFiles) {
        if (!sourceFile.getFilePath().endsWith('/' + moduleFileName)) {
          continue;
        }

        const configFeatures = ([] as Module[]).concat(config.featureModule);

        if (options.lazy) {
          let content = `${PROVIDE_CONFIG_FUNCTION}(<${CMS_CONFIG}>{
            featureModules: {`;
          for (let i = 0; i < configFeatures.length; i++) {
            const featureModule = configFeatures[i];
            let lazyLoadingChunkName = config.moduleName;
            if (config.lazyLoadingChunk) {
              const namedImportsContent =
                config.lazyLoadingChunk.namedImports[i];
              lazyLoadingChunkName = `[${namedImportsContent}]`;
              createImports(sourceFile, config.lazyLoadingChunk);
            }
            content =
              content +
              `${lazyLoadingChunkName}: {
              module: () =>
                import('${featureModule.importPath}').then((m) => m.${featureModule.name}),
            },`;
          }
          addModuleProvider(sourceFile, {
            import: [
              {
                moduleSpecifier: SPARTACUS_CORE,
                namedImports: [PROVIDE_CONFIG_FUNCTION, CMS_CONFIG],
              },
            ],
            content: content + `}})`,
          });
        } else {
          for (const featureModule of configFeatures) {
            addModuleImport(sourceFile, {
              import: {
                moduleSpecifier: featureModule.importPath,
                namedImports: [featureModule.name],
              },
              content: featureModule.content || featureModule.name,
            });
          }
        }

        saveAndFormat(sourceFile);
        break;
      }
    }
    return tree;
  };
}

export function addFeatureTranslations<T extends LibraryOptions>(
  options: T,
  config: FeatureConfig
): Rule {
  return (tree: Tree): Tree => {
    if (!config.i18n) {
      return tree;
    }

    const basePath = process.cwd();
    const moduleFileName = createModuleFileName(config);

    const { buildPaths } = getProjectTsConfigPaths(tree, options.project);
    for (const tsconfigPath of buildPaths) {
      const { appSourceFiles } = createProgram(tree, basePath, tsconfigPath);

      for (const sourceFile of appSourceFiles) {
        if (!sourceFile.getFilePath().endsWith('/' + moduleFileName)) {
          continue;
        }

        addModuleProvider(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_CORE,
              namedImports: [PROVIDE_CONFIG_FUNCTION, I18N_CONFIG],
            },
            {
              moduleSpecifier: config.i18n.importPath,
              namedImports: [config.i18n.chunks, config.i18n.resources],
            },
          ],
          content: `${PROVIDE_CONFIG_FUNCTION}(<${I18N_CONFIG}>{
              i18n: {
                resources: ${config.i18n.resources},
                chunks: ${config.i18n.chunks},
              },
            })`,
        });

        saveAndFormat(sourceFile);
        break;
      }
    }
    return tree;
  };
}

function addCustomConfig<T extends LibraryOptions>(
  options: T,
  config: FeatureConfig
): Rule {
  return (tree: Tree): Tree => {
    if (!config.customConfig) {
      return tree;
    }

    const basePath = process.cwd();
    const moduleFileName = createModuleFileName(config);

    const { buildPaths } = getProjectTsConfigPaths(tree, options.project);
    for (const tsconfigPath of buildPaths) {
      const { appSourceFiles } = createProgram(tree, basePath, tsconfigPath);

      for (const sourceFile of appSourceFiles) {
        if (!sourceFile.getFilePath().endsWith('/' + moduleFileName)) {
          continue;
        }

        const customConfigs = ([] as CustomConfig[]).concat(
          config.customConfig
        );
        customConfigs.forEach((customConfig) => {
          addModuleProvider(sourceFile, {
            import: [
              {
                moduleSpecifier: SPARTACUS_CORE,
                namedImports: [PROVIDE_CONFIG_FUNCTION],
              },
              ...customConfig.import,
            ],
            content: `${PROVIDE_CONFIG_FUNCTION}(${customConfig.content})`,
          });
        });

        saveAndFormat(sourceFile);
        break;
      }
    }
    return tree;
  };
}

function addLibraryAssets(
  assetsConfig: AssetsConfig,
  options: LibraryOptions
): Rule {
  return (tree: Tree) => {
    const { path, workspace: angularJson } = getWorkspace(tree);
    const defaultProject = getDefaultProjectNameFromWorkspace(tree);
    const project = options.project || defaultProject;
    const architect = angularJson.projects[project].architect;

    // `build` architect section
    const architectBuild = architect?.build;
    const buildAssets = createAssetsArray(
      assetsConfig,
      (architectBuild?.options as any)?.assets
    );
    const buildOptions = {
      ...architectBuild?.options,
      assets: buildAssets,
    };

    // `test` architect section
    const architectTest = architect?.test;
    const testAssets = createAssetsArray(
      assetsConfig,
      (architectTest?.options as any)?.assets
    );
    const testOptions = {
      ...architectTest?.options,
      assets: testAssets,
    };

    const updatedAngularJson = {
      ...angularJson,
      projects: {
        ...angularJson.projects,
        [project]: {
          ...angularJson.projects[project],
          architect: {
            ...architect,
            build: {
              ...architectBuild,
              options: buildOptions,
            },
            test: {
              ...architectTest,
              options: testOptions,
            },
          },
        },
      },
    };

    const initialContent = tree.read(path)?.toString(UTF_8) ?? '';
    const toUpdate = JSON.stringify(updatedAngularJson, null, 2);
    // prevent the unnecessary Angular logs about the files being updated
    if (initialContent !== toUpdate) {
      tree.overwrite(path, toUpdate);
    }
  };
}

function createAssetsArray(
  assetsConfig: AssetsConfig,
  angularJsonAssets: any[] = []
): unknown[] {
  for (const asset of angularJsonAssets) {
    if (typeof asset === 'object') {
      if (
        asset.glob === assetsConfig.glob &&
        asset.input === `./node_modules/@spartacus/${assetsConfig.input}` &&
        asset.output === (assetsConfig.output || 'assets/')
      ) {
        return angularJsonAssets;
      }
    }
  }

  angularJsonAssets = [
    ...angularJsonAssets,
    {
      glob: assetsConfig.glob,
      input: `./node_modules/@spartacus/${assetsConfig.input}`,
      output: assetsConfig.output || 'assets/',
    },
  ];

  return angularJsonAssets;
}

export function addLibraryStyles(
  stylingConfig: StylingConfig,
  options: LibraryOptions
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const defaultProject = getDefaultProjectNameFromWorkspace(tree);
    const project = options.project || defaultProject;
    const libraryScssPath = `${getSourceRoot(tree, {
      project: project,
    })}/styles/spartacus/${stylingConfig.scssFileName}`;
    const toAdd = `@import "${stylingConfig.importStyle}";`;

    if (tree.exists(libraryScssPath)) {
      const initialContent = tree.read(libraryScssPath)?.toString(UTF_8) ?? '';
      let content = initialContent;

      if (!content.includes(toAdd)) {
        content += `\n${toAdd}`;
      }

      // prevent the unnecessary Angular logs about the files being updated
      if (initialContent !== content) {
        tree.overwrite(libraryScssPath, content);
      }
      return tree;
    }

    tree.create(libraryScssPath, toAdd);

    const { path, workspace: angularJson } = getWorkspace(tree);
    const architect = angularJson.projects[project].architect;

    // `build` architect section
    const architectBuild = architect?.build;
    const buildOptions = {
      ...architectBuild?.options,
      styles: [
        ...((architectBuild?.options as any)?.styles
          ? (architectBuild?.options as any)?.styles
          : []),
        libraryScssPath,
      ],
    };

    // `test` architect section
    const architectTest = architect?.test;
    const testOptions = {
      ...architectTest?.options,
      styles: [
        ...(architectTest?.options?.styles
          ? architectTest?.options?.styles
          : []),
        libraryScssPath,
      ],
    };

    const updatedAngularJson = {
      ...angularJson,
      projects: {
        ...angularJson.projects,
        [project]: {
          ...angularJson.projects[project],
          architect: {
            ...architect,
            build: {
              ...architectBuild,
              options: buildOptions,
            },
            test: {
              ...architectTest,
              options: testOptions,
            },
          },
        },
      },
    };
    tree.overwrite(path, JSON.stringify(updatedAngularJson, null, 2));
  };
}

export function createNodePackageInstallationTask(
  context: SchematicContext
): TaskId {
  return context.addTask(new NodePackageInstallTask());
}

export function installPackageJsonDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    createNodePackageInstallationTask(context);
    return tree;
  };
}

export function addPackageJsonDependencies(
  dependencies: NodeDependency[],
  packageJson: any
): Rule {
  return (tree: Tree, context: SchematicContext): Tree => {
    for (const dependency of dependencies) {
      if (!dependencyExists(dependency, packageJson)) {
        addPackageJsonDependency(tree, dependency);
        context.logger.info(
          `✅️ Added '${dependency.name}' into ${dependency.type}`
        );
      }
    }
    return tree;
  };
}

/**
 * Adds libraries dependencies to package.json
 */
export function addPackageJsonDependenciesForLibrary<
  OPTIONS extends LibraryOptions
>(dependencies: Record<string, string>, _options: OPTIONS): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const packageJson = readPackageJson(tree);
    const spartacusLibraries = createSpartacusDependencies(dependencies);
    const thirdPartyLibraries = createDependencies(dependencies);
    const libraries = spartacusLibraries.concat(thirdPartyLibraries);

    return chain([
      addPackageJsonDependencies(libraries, packageJson),
      installPackageJsonDependencies(),
    ]);
  };
}

export function dependencyExists(
  dependency: NodeDependency,
  packageJson: any
): boolean {
  return packageJson[dependency.type]?.hasOwnProperty(dependency.name);
}

export function configureB2bFeatures<T extends LibraryOptions>(
  options: T,
  packageJson: any
): Rule {
  return (_tree: Tree, _context: SchematicContext): Rule => {
    const spartacusVersion = getPrefixedSpartacusSchematicsVersion();
    return chain([
      addB2bProviders(options),
      addPackageJsonDependencies(
        [
          {
            type: NodeDependencyType.Default,
            version: spartacusVersion,
            name: SPARTACUS_SETUP,
          },
        ],
        packageJson
      ),
    ]);
  };
}

function addB2bProviders<T extends LibraryOptions>(options: T): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const { buildPaths } = getProjectTsConfigPaths(tree, options.project);
    if (!buildPaths.length) {
      throw new SchematicsException(
        'Could not find any tsconfig file. Cannot configure SpartacusConfigurationModule.'
      );
    }

    const basePath = process.cwd();
    for (const tsconfigPath of buildPaths) {
      const { appSourceFiles } = createProgram(tree, basePath, tsconfigPath);

      for (const sourceFile of appSourceFiles) {
        if (
          !sourceFile
            .getFilePath()
            .includes(`${SPARTACUS_CONFIGURATION_MODULE}.module.ts`)
        ) {
          continue;
        }

        getB2bConfiguration().forEach((provider) =>
          addModuleProvider(sourceFile, provider)
        );

        saveAndFormat(sourceFile);
        break;
      }
    }

    return tree;
  };
}

function createModuleFileName(config: FeatureConfig): string {
  return `${dasherize(config.moduleName)}-feature.module.ts`;
}

/**
 * Used a comparator function when sorting features.
 */
export function calculateCrossFeatureSort(
  featureA: string,
  featureB: string
): number {
  return calculateSortInternal(
    featureA,
    featureB,
    crossFeatureInstallationOrder
  );
}

/**
 * Used a comparator function when sorting libraries.
 */
export function calculateCrossLibrarySort(
  libraryA: string,
  libraryB: string
): number {
  return calculateSortInternal(
    libraryA,
    libraryB,
    crossLibraryInstallationOrder
  );
}

/**
 * Used to sort libraries or features in the correct order.
 */
function calculateSortInternal(
  libOrFeatureA: string,
  libOrFeatureB: string,
  order: string[]
): number {
  const indexA = order.indexOf(libOrFeatureA);
  const indexB = order.indexOf(libOrFeatureB);

  /**
   * In case a feature module is _not_ found in the `order`,
   * we want to sort it at the end of the list.
   */
  return (indexA > -1 ? indexA : Infinity) - (indexB > -1 ? indexB : Infinity);
}
