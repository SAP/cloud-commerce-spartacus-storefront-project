import {
  chain,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { NodeDependency } from '@schematics/angular/utility/dependencies';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { ANGULAR_HTTP, RXJS } from '../shared/constants';
import {
  SPARTACUS_FEATURES_MODULE,
  SPARTACUS_STOREFRONTLIB,
} from '../shared/libs-constants';
import {
  analyzeCrossFeatureDependencies,
  analyzeCrossLibraryDependenciesByFeatures,
} from '../shared/utils/dependency-utils';
import {
  addFeatures,
  analyzeFeature,
  orderFeatures,
} from '../shared/utils/feature-utils';
import { getIndexHtmlPath } from '../shared/utils/file-utils';
import { appendHtmlElementToHead } from '../shared/utils/html-utils';
import {
  addPackageJsonDependencies,
  checkAppStructure,
  installPackageJsonDependencies,
} from '../shared/utils/lib-utils';
import {
  addModuleImport,
  getModulePropertyInitializer,
} from '../shared/utils/new-module-utils';
import {
  getPrefixedSpartacusSchematicsVersion,
  getSpartacusCurrentFeatureLevel,
  mapPackageToNodeDependencies,
  prepare3rdPartyDependencies,
  prepareSpartacusDependencies,
  readPackageJson,
  updatePackageJsonDependencies,
} from '../shared/utils/package-utils';
import { createProgram, saveAndFormat } from '../shared/utils/program';
import { getProjectTsConfigPaths } from '../shared/utils/project-tsconfig-paths';
import {
  getDefaultProjectNameFromWorkspace,
  getProjectFromWorkspace,
  getProjectTargets,
  getWorkspace,
  scaffoldStructure,
} from '../shared/utils/workspace-utils';
import { addSpartacusConfiguration } from './configuration';
import { Schema as SpartacusOptions } from './schema';
import { setupSpartacusModule } from './spartacus';
import { setupSpartacusFeaturesModule } from './spartacus-features';
import { setupStoreModules } from './store';

function installStyles(options: SpartacusOptions): Rule {
  return (tree: Tree, context: SchematicContext): void => {
    const project = getProjectFromWorkspace(tree, options);
    const rootStyles = getProjectTargets(project)?.build?.options?.styles?.[0];
    const styleFilePath =
      typeof rootStyles === 'object'
        ? ((rootStyles as any)?.input as string)
        : rootStyles;

    if (!styleFilePath) {
      context.logger.warn(
        `Could not find the default style file for this project.`
      );
      context.logger.warn(
        `Please consider manually setting up spartacus styles`
      );
      return;
    }

    if (styleFilePath.split('.').pop() !== 'scss') {
      context.logger.warn(
        `Could not find the default SCSS style file for this project. `
      );
      context.logger.warn(
        `Please make sure your project is configured with SCSS and consider manually setting up spartacus styles.`
      );
      return;
    }

    const buffer = tree.read(styleFilePath);

    if (!buffer) {
      context.logger.warn(
        `Could not read the default style file within the project ${styleFilePath}`
      );
      context.logger.warn(
        `Please consider manually importing spartacus styles.`
      );
      return;
    }

    const htmlContent = buffer.toString();
    let insertion =
      '\n' +
      `$styleVersion: ${
        options.featureLevel || getSpartacusCurrentFeatureLevel()
      };\n@import '~@spartacus/styles/index';\n`;

    if (options?.theme) {
      insertion += `\n@import '~@spartacus/styles/scss/theme/${options.theme}';\n`;
    }

    if (htmlContent.includes(insertion)) {
      return;
    }

    const recorder = tree.beginUpdate(styleFilePath);

    recorder.insertLeft(htmlContent.length, insertion);
    tree.commitUpdate(recorder);
  };
}

function updateMainComponent(
  project: WorkspaceProject,
  options: SpartacusOptions
): Rule {
  return (host: Tree, context: SchematicContext): Tree | void => {
    const filePath = project.sourceRoot + '/app/app.component.html';
    const buffer = host.read(filePath);

    if (!buffer) {
      context.logger.warn(`Could not read app.component.html file.`);
      return;
    }

    const htmlContent = buffer.toString();
    const insertion = `<cx-storefront></cx-storefront>\n`;

    if (htmlContent.includes(insertion)) {
      return;
    }

    const recorder = host.beginUpdate(filePath);

    if (options && options.overwriteAppComponent) {
      recorder.remove(0, htmlContent.length);
      recorder.insertLeft(0, insertion);
    } else {
      recorder.insertLeft(htmlContent.length, `\n${insertion}`);
    }

    host.commitUpdate(recorder);

    return host;
  };
}

function updateIndexFile(tree: Tree, options: SpartacusOptions): Rule {
  return (host: Tree): Tree => {
    const projectIndexHtmlPath = getIndexHtmlPath(tree);
    const baseUrl = options.baseUrl || 'OCC_BACKEND_BASE_URL_VALUE';

    const metaTags = [
      `<meta name="occ-backend-base-url" content="${baseUrl}" />`,
      `<meta name="media-backend-base-url" content="MEDIA_BACKEND_BASE_URL_VALUE" />`,
    ];

    metaTags.forEach((metaTag) => {
      appendHtmlElementToHead(host, projectIndexHtmlPath, metaTag);
    });

    return host;
  };
}

function increaseBudgets(): Rule {
  return (tree: Tree): Tree => {
    const { path, workspace: angularJson } = getWorkspace(tree);
    const projectName = getDefaultProjectNameFromWorkspace(tree);

    const project = angularJson.projects[projectName];
    const architect = project.architect;
    const build = architect?.build;
    const configurations = build?.configurations;
    const productionConfiguration = configurations?.production;
    const productionBudgets = (
      ((productionConfiguration as any).budgets ?? []) as {
        type: string;
        maximumError: string;
      }[]
    ).map((budget) => {
      if (budget.type === 'initial') {
        return {
          ...budget,
          maximumError: '2.5mb',
        };
      }
      return budget;
    });

    const updatedAngularJson = {
      ...angularJson,
      projects: {
        ...angularJson.projects,
        [projectName]: {
          ...project,
          architect: {
            ...architect,
            build: {
              ...build,
              configurations: {
                ...configurations,
                production: {
                  ...productionConfiguration,
                  budgets: productionBudgets,
                },
              },
            },
          },
        },
      },
    };

    tree.overwrite(path, JSON.stringify(updatedAngularJson, null, 2));
    return tree;
  };
}

function prepareDependencies(features: string[]): NodeDependency[] {
  const spartacusDependencies = prepareSpartacusDependencies();

  const libraries = analyzeCrossLibraryDependenciesByFeatures(features);
  const spartacusVersion = getPrefixedSpartacusSchematicsVersion();
  const spartacusLibraryDependencies = libraries.map((library) =>
    mapPackageToNodeDependencies(library, spartacusVersion)
  );

  const dependencies: NodeDependency[] = spartacusDependencies
    .concat(spartacusLibraryDependencies)
    .concat(prepare3rdPartyDependencies());

  return dependencies;
}

function updateAppModule(project: string): Rule {
  return (tree: Tree): Tree => {
    const { buildPaths } = getProjectTsConfigPaths(tree, project);

    if (!buildPaths.length) {
      throw new SchematicsException(
        'Could not find any tsconfig file. Cannot configure AppModule.'
      );
    }

    const basePath = process.cwd();
    for (const tsconfigPath of buildPaths) {
      const { appSourceFiles } = createProgram(tree, basePath, tsconfigPath);

      for (const sourceFile of appSourceFiles) {
        if (sourceFile.getFilePath().includes(`app.module.ts`)) {
          addModuleImport(sourceFile, {
            order: 1,
            import: {
              moduleSpecifier: ANGULAR_HTTP,
              namedImports: ['HttpClientModule'],
            },
            content: 'HttpClientModule',
          });
          addModuleImport(sourceFile, {
            order: 2,
            import: {
              moduleSpecifier: SPARTACUS_STOREFRONTLIB,
              namedImports: ['AppRoutingModule'],
            },
            content: 'AppRoutingModule',
          });

          saveAndFormat(sourceFile);
          break;
        }
      }
    }
    return tree;
  };
}

function logDependencyFeatures(
  options: SpartacusOptions,
  context: SchematicContext,
  features: string[]
) {
  const selectedFeatures = options.features ?? [];
  const notSelectedFeatures = features.filter(
    (feature) => !selectedFeatures.includes(feature)
  );
  if (notSelectedFeatures.length) {
    context.logger.info(
      `\n⚙️ Configuring the additional features as the dependencies of ${selectedFeatures.join(
        ', '
      )}: ${notSelectedFeatures.join(', ')}\n`
    );
  }
}

function orderInstalledFeatures(options: SpartacusOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const basePath = process.cwd();
    const { buildPaths } = getProjectTsConfigPaths(tree, options.project);

    for (const tsconfigPath of buildPaths) {
      const { appSourceFiles } = createProgram(tree, basePath, tsconfigPath);

      for (const spartacusFeaturesModule of appSourceFiles) {
        if (
          !spartacusFeaturesModule
            .getFilePath()
            .includes(`${SPARTACUS_FEATURES_MODULE}.module.ts`)
        ) {
          continue;
        }

        const analysis = analyzeFeature(spartacusFeaturesModule);
        if (analysis.unrecognized) {
          context.logger.warn(
            `⚠️ Unrecognized feature found in ${spartacusFeaturesModule.getFilePath()}: ${
              analysis.unrecognized
            }.`
          );
          context.logger.warn(
            `Please make sure the order of features in the NgModule's 'imports' array is correct.`
          );
          return noop();
        }

        const ordered = orderFeatures(analysis);
        getModulePropertyInitializer(
          spartacusFeaturesModule,
          'imports',
          false
        )?.replaceWithText(`[${ordered.join(',\n')}]`);

        saveAndFormat(spartacusFeaturesModule);
        break;
      }
    }
  };
}

export function addSpartacus(options: SpartacusOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const spartacusFeatureModuleExists = checkAppStructure(
      tree,
      options.project
    );
    options = {
      ...options,
      internal: {
        dirtyInstallation: spartacusFeatureModuleExists,
      },
    };

    const packageJsonFile = readPackageJson(tree);

    const features = analyzeCrossFeatureDependencies(options.features ?? []);
    const dependencies = prepareDependencies(features);
    logDependencyFeatures(options, context, features);

    const spartacusRxjsDependency: NodeDependency[] = [
      dependencies.find((dep) => dep.name === RXJS) as NodeDependency,
    ];
    return chain([
      setupStoreModules(options.project),

      scaffoldStructure(options),

      setupSpartacusModule(options.project),

      setupSpartacusFeaturesModule(options.project),

      addSpartacusConfiguration(options),

      updateAppModule(options.project),
      installStyles(options),
      updateMainComponent(getProjectFromWorkspace(tree, options), options),
      options.useMetaTags ? updateIndexFile(tree, options) : noop(),
      increaseBudgets(),

      addFeatures(options, features),
      spartacusFeatureModuleExists ? orderInstalledFeatures(options) : noop(),

      chain([
        addPackageJsonDependencies(
          prepareDependencies(features),
          packageJsonFile
        ),
        /**
         * Force installing versions of dependencies used by Spartacus.
         * E.g. ng13 uses rxjs 7, but Spartacus uses rxjs 6.
         */
        updatePackageJsonDependencies(spartacusRxjsDependency, packageJsonFile),
        installPackageJsonDependencies(),
      ]),
    ])(tree, context);
  };
}
