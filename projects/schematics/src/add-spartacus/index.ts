import {
  chain,
  ExecutionOptions,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { getProjectTargets } from '@schematics/angular/utility/project-targets';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import {
  addSymbolToNgModuleMetadata,
  insertImport,
  isImported,
} from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import * as ts from 'typescript';
import { Schema as SpartacusOptions } from './schema';
import { experimental, JsonParseMode, parseJson } from '@angular-devkit/core';
import {
  appendHtmlElementToHead,
  getProjectStyleFile,
  getProjectTargetOptions,
} from '@angular/cdk/schematics';
import { italic, red } from '@angular-devkit/core/src/terminal';
import { branch } from '@angular-devkit/schematics/src/tree/static';
import { of } from 'rxjs';

function getWorkspace(
  host: Tree
): { path: string; workspace: experimental.workspace.WorkspaceSchema } {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter(filePath => host.exists(filePath))[0];

  if (!path) {
    throw new SchematicsException(`Could not find Angular`);
  }

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();

  return {
    path,
    workspace: (parseJson(
      content,
      JsonParseMode.Loose
    ) as {}) as experimental.workspace.WorkspaceSchema,
  };
}

function addPackageJsonDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      {
        type: NodeDependencyType.Default,
        version: '~1.0.0',
        name: '@spartacus/core',
      },
      {
        type: NodeDependencyType.Default,
        version: '~1.0.0',
        name: '@spartacus/storefront',
      },
      {
        type: NodeDependencyType.Default,
        version: '~1.0.0',
        name: '@spartacus/assets',
      },
      {
        type: NodeDependencyType.Default,
        version: '~1.0.0',
        name: '@spartacus/styles',
      },

      {
        type: NodeDependencyType.Default,
        version: '^0.800.0',
        name: '@angular/pwa',
      },
      {
        type: NodeDependencyType.Default,
        version: '^8.0.0',
        name: '@angular/service-worker',
      },

      {
        type: NodeDependencyType.Default,
        version: '^4.1.0',
        name: '@ng-bootstrap/ng-bootstrap',
      },
      {
        type: NodeDependencyType.Default,
        version: '^2.13.2',
        name: '@ng-select/ng-select',
      },

      {
        type: NodeDependencyType.Default,
        version: '^8.0.0',
        name: '@ngrx/store',
      },
      {
        type: NodeDependencyType.Default,
        version: '^8.0.0',
        name: '@ngrx/effects',
      },
      {
        type: NodeDependencyType.Default,
        version: '^8.0.0',
        name: '@ngrx/router-store',
      },

      {
        type: NodeDependencyType.Default,
        version: '^4.2.1',
        name: 'bootstrap',
      },
      { type: NodeDependencyType.Default, version: '^15.0.6', name: 'i18next' },
      {
        type: NodeDependencyType.Default,
        version: '^2.0.1',
        name: 'i18next-xhr-backend',
      },
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(tree, dependency);
      context.logger.log(
        'info',
        `✅️ Added '${dependency.name}' into ${dependency.type}`
      );
    });

    return tree;
  };
}

function installPackageJsonDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);
    return tree;
  };
}

function getTsSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not read file (${path}).`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  return source;
}

function addImport(
  host: Tree,
  modulePath: string,
  importText: string,
  importPath: string
) {
  const moduleSource = getTsSourceFile(host, modulePath) as any;
  if (!isImported(moduleSource, importText, importPath)) {
    const change = insertImport(
      moduleSource,
      modulePath,
      importText,
      importPath
    );
    if (change) {
      const recorder = host.beginUpdate(modulePath);
      recorder.insertLeft(
        (change as InsertChange).pos,
        (change as InsertChange).toAdd
      );
      host.commitUpdate(recorder);
    }
  }
}

function importModule(host: Tree, modulePath: string, importText: string) {
  const moduleSource = getTsSourceFile(host, modulePath);
  const metadataChanges = addSymbolToNgModuleMetadata(
    moduleSource,
    modulePath,
    'imports',
    importText
  );
  if (metadataChanges) {
    const recorder = host.beginUpdate(modulePath);
    metadataChanges.forEach((change: InsertChange) => {
      recorder.insertRight(change.pos, change.toAdd);
    });
    host.commitUpdate(recorder);
  }
}

function getStorefrontConfig(options: SpartacusOptions): string {
  const baseUrl = options.baseUrl || 'https://localhost:9002';
  const baseSite = options.baseSite || 'electronics';
  return `{
      backend: {
        occ: {
          baseUrl: '${baseUrl}',
            prefix: '/rest/v2/',
            legacy: false
        }
      },
      authentication: {
        client_id: 'mobile_android',
          client_secret: 'secret'
      },
      context: {
        baseSite: ['${baseSite}']
      },
      i18n: {
        resources: translations,
          chunks: translationChunksConfig,
          fallbackLang: 'en'
      }
    }`;
}

function getLineFromTSFile(
  host: Tree,
  modulePath: string,
  position: number
): [number, number] {
  const tsFile = getTsSourceFile(host, modulePath);

  const lac = tsFile.getLineAndCharacterOfPosition(position);
  const lineStart = tsFile.getPositionOfLineAndCharacter(lac.line, 0);
  const nextLineStart = tsFile.getPositionOfLineAndCharacter(lac.line + 1, 0);

  return [lineStart, nextLineStart - lineStart];
}

function removeServiceWorkerSetup(host: Tree, modulePath: string) {
  const buffer = host.read(modulePath);

  if (!buffer) {
    return;
  }

  let fileContent = buffer.toString();

  const serviceWorkerImport = `import { ServiceWorkerModule } from '@angular/service-worker';`;
  const serviceWorkerModuleImport = `ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })`;
  if (!fileContent.includes(serviceWorkerModuleImport)) {
    return;
  }
  if (!fileContent.includes(serviceWorkerImport)) {
    return;
  }

  const recorder = host.beginUpdate(modulePath);

  recorder.remove(
    ...getLineFromTSFile(
      host,
      modulePath,
      fileContent.indexOf(serviceWorkerImport)
    )
  );

  recorder.remove(
    ...getLineFromTSFile(
      host,
      modulePath,
      fileContent.indexOf(serviceWorkerModuleImport)
    )
  );

  host.commitUpdate(recorder);

  // clean up environment import
  fileContent = (host.read(modulePath) || {}).toString();

  const environmentImport = `import { environment } from '../environments/environment';`;
  if (fileContent.includes(environmentImport)) {
    const importPos =
      fileContent.indexOf(environmentImport) + environmentImport.length;

    // check if it's not needed
    if (
      !fileContent.includes('environment', importPos + environmentImport.length)
    ) {
      const envRecorder = host.beginUpdate(modulePath);
      envRecorder.remove(...getLineFromTSFile(host, modulePath, importPos));
      host.commitUpdate(envRecorder);
    }
  }
}

function updateAppModule(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.debug('Updating appmodule');

    // find app module
    const projectTargets = getProjectTargets(host, options.project);

    if (!projectTargets.build) {
      throw new SchematicsException(`Project target "build" not found.`);
    }

    const mainPath = projectTargets.build.options.main;
    const modulePath = getAppModulePath(host, mainPath);
    context.logger.debug(`module path: ${modulePath}`);

    // add imports
    addImport(host, modulePath, 'translations', '@spartacus/assets');
    addImport(host, modulePath, 'translationChunksConfig', '@spartacus/assets');
    addImport(host, modulePath, 'B2cStorefrontModule', '@spartacus/storefront');
    addImport(
      host,
      modulePath,
      'defaultCmsContentConfig',
      '@spartacus/storefront'
    );
    addImport(host, modulePath, 'ConfigModule', '@spartacus/core');

    importModule(
      host,
      modulePath,
      `B2cStorefrontModule.withConfig(${getStorefrontConfig(options)})`
    );
    importModule(
      host,
      modulePath,
      `ConfigModule.withConfigFactory(defaultCmsContentConfig)`
    );

    removeServiceWorkerSetup(host, modulePath);

    return host;
  };
}

function installStyles(project: experimental.workspace.WorkspaceProject): Rule {
  return (host: Tree) => {
    const styleFilePath = getProjectStyleFile(project);

    if (!styleFilePath) {
      console.warn(
        red(`Could not find the default style file for this project.`)
      );
      console.warn(red(`Please consider manually setting up spartacus styles`));
      return;
    }

    if (styleFilePath.split('.').pop() !== 'scss') {
      console.warn(
        red(`Could not find the default SCSS style file for this project. `)
      );
      console.warn(
        red(
          `Please make sure your project is configured with SCSS and consider manually setting up spartacus styles.`
        )
      );
      return;
    }

    const buffer = host.read(styleFilePath);

    if (!buffer) {
      console.warn(
        red(
          `Could not read the default style file within the project ` +
            `(${italic(styleFilePath)})`
        )
      );
      console.warn(red(`Please consider manually setting up the Robot font.`));
      return;
    }

    const htmlContent = buffer.toString();
    const insertion = '\n' + `@import "~@spartacus/styles/index";\n`;

    if (htmlContent.includes(insertion)) {
      return;
    }

    const recorder = host.beginUpdate(styleFilePath);

    recorder.insertLeft(htmlContent.length, insertion);
    host.commitUpdate(recorder);
  };
}

function updateMainComponent(
  project: experimental.workspace.WorkspaceProject
): Rule {
  return (host: Tree, _context: SchematicContext) => {
    const filePath = project.sourceRoot + '/app/app.component.html';

    const buffer = host.read(filePath);

    if (!buffer) {
      console.warn(red(`Could not read app.component.html file.`));
      return;
    }

    const htmlContent = buffer.toString();
    const insertion = '\n' + `<cx-storefront></cx-storefront>\n`;

    if (htmlContent.includes(insertion)) {
      return;
    }

    const recorder = host.beginUpdate(filePath);

    recorder.insertLeft(htmlContent.length, insertion);
    host.commitUpdate(recorder);

    return host;
  };
}

export function getIndexHtmlPath(
  project: experimental.workspace.WorkspaceProject
): string {
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.index) {
    throw new SchematicsException(
      'No project "index.html" file could be found.'
    );
  }

  return buildOptions.index;
}

function updateIndexFile(
  project: experimental.workspace.WorkspaceProject
): Rule {
  return (host: Tree) => {
    const projectIndexHtmlPath = getIndexHtmlPath(project);

    const metaTags = [
      '<meta name="occ-backend-base-url" content="OCC_BACKEND_BASE_URL_VALUE" />',
      '<meta name="media-backend-base-url" content="MEDIA_BACKEND_BASE_URL_VALUE" />',
    ];

    metaTags.forEach(metaTag => {
      appendHtmlElementToHead(host, projectIndexHtmlPath, metaTag);
    });

    return host;
  };
}

function myExternalSchematic<OptionT extends object>(
  collectionName: string,
  schematicName: string,
  options: OptionT,
  executionOptions?: Partial<ExecutionOptions>
): Rule {
  return (input: Tree, context: SchematicContext) => {
    const collection = context.engine.createCollection(collectionName);
    const schematic = collection.createSchematic(schematicName, true);
    return schematic.call(
      options,
      of(branch(input)),
      context,
      executionOptions
    );
  };
}

export function addSpartacus(options: SpartacusOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {

    console.log('options', options);


    const { workspace } = getWorkspace(tree);

    if (!options.project) {
      throw new SchematicsException('Option "project" is required.');
    }

    const project = workspace.projects[options.project];
    if (!project) {
      throw new SchematicsException(
        `Project is not defined in this workspace.`
      );
    }

    if (project.projectType !== 'application') {
      throw new SchematicsException(
        `Spartacus requires a project type of "application".`
      );
    }

    return chain([
      addPackageJsonDependencies(),
      myExternalSchematic('@angular/pwa', 'ng-add', {}),
      updateAppModule(options),
      installStyles(project),
      updateMainComponent(project),
      updateIndexFile(project),
      installPackageJsonDependencies(),
    ])(tree, context);
  };
}
