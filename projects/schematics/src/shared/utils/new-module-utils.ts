import { dasherize } from '@angular-devkit/core/src/utils/strings';
import {
  externalSchematic,
  noop,
  Rule,
  Tree,
} from '@angular-devkit/schematics';
import { getDecoratorMetadata } from '@schematics/angular/utility/ast-utils';
import {
  ArrayLiteralExpression,
  CallExpression,
  Expression,
  Identifier,
  Node,
  ObjectLiteralElementLike,
  SourceFile,
  ts as tsMorph,
} from 'ts-morph';
import { ANGULAR_CORE, ANGULAR_SCHEMATICS } from '../constants';
import { packageFeatureConfigMapping } from '../updateable-constants';
import { getSpartacusProviders, normalizeConfiguration } from './config-utils';
import { getTsSourceFile } from './file-utils';
import {
  getImportDeclaration,
  isImportedFrom,
  isImportedFromSpartacusLibs,
} from './import-utils';
import { getSourceRoot } from './workspace-utils';

export type ModuleProperty =
  | 'imports'
  | 'exports'
  | 'declarations'
  | 'providers';
export interface Import {
  moduleSpecifier: string;
  namedImports: string[];
}

export function ensureModuleExists(options: {
  name: string;
  path: string;
  module: string;
  project: string;
}): Rule {
  return (host: Tree): Rule => {
    const modulePath = `${getSourceRoot(host, { project: options.project })}/${
      options.path
    }`;
    const filePath = `${modulePath}/${dasherize(options.name)}.module.ts`;
    if (host.exists(filePath)) {
      const moduleFile = getTsSourceFile(host, filePath);
      const metadata = getDecoratorMetadata(
        moduleFile,
        'NgModule',
        ANGULAR_CORE
      )[0];

      if (metadata) {
        return noop();
      }
    }
    return externalSchematic(ANGULAR_SCHEMATICS, 'module', {
      name: dasherize(options.name),
      flat: true,
      commonModule: false,
      path: modulePath,
      module: options.module,
    });
  };
}

export function addModuleImport(
  sourceFile: SourceFile,
  insertOptions: {
    import: Import | Import[];
    content: string;
    order?: number;
  },
  createIfMissing = true
): Expression | undefined {
  return addToModuleInternal(
    sourceFile,
    'imports',
    insertOptions,
    createIfMissing
  );
}

export function addModuleExport(
  sourceFile: SourceFile,
  insertOptions: {
    import: Import | Import[];
    content: string;
    order?: number;
  },
  createIfMissing = true
): Expression | undefined {
  return addToModuleInternal(
    sourceFile,
    'exports',
    insertOptions,
    createIfMissing
  );
}

export function addModuleDeclaration(
  sourceFile: SourceFile,
  insertOptions: {
    import: Import | Import[];
    content: string;
    order?: number;
  },
  createIfMissing = true
): Expression | undefined {
  return addToModuleInternal(
    sourceFile,
    'declarations',
    insertOptions,
    createIfMissing
  );
}

export function addModuleProvider(
  sourceFile: SourceFile,
  insertOptions: {
    import: Import | Import[];
    content: string;
    order?: number;
  },
  createIfMissing = true
): Expression | undefined {
  return addToModuleInternal(
    sourceFile,
    'providers',
    insertOptions,
    createIfMissing
  );
}

function addToModuleInternal(
  sourceFile: SourceFile,
  propertyName: ModuleProperty,
  insertOptions: {
    import: Import | Import[];
    content: string;
    order?: number;
  },
  createIfMissing = true
): Expression | undefined {
  const moduleNode = getModule(sourceFile);
  if (!moduleNode) {
    return undefined;
  }

  const initializer = getModulePropertyInitializer(
    sourceFile,
    propertyName,
    createIfMissing
  );
  if (!initializer) {
    return undefined;
  }

  if (isDuplication(initializer, propertyName, insertOptions.content)) {
    return undefined;
  }

  const imports = ([] as Import[]).concat(insertOptions.import);
  imports.forEach((specifiedImport) =>
    sourceFile.addImportDeclaration({
      moduleSpecifier: specifiedImport.moduleSpecifier,
      namedImports: specifiedImport.namedImports,
    })
  );

  let createdNode: Expression | undefined;
  if (insertOptions.order || insertOptions.order === 0) {
    initializer.insertElement(insertOptions.order, insertOptions.content);
  } else {
    createdNode = initializer.addElement(insertOptions.content);
  }

  return createdNode;
}

function isDuplication(
  initializer: ArrayLiteralExpression,
  propertyName: 'imports' | 'exports' | 'declarations' | 'providers',
  content: string
): boolean {
  if (propertyName === 'providers') {
    const normalizedContent = normalizeConfiguration(content);
    const configs = getSpartacusProviders(initializer.getSourceFile());
    for (const config of configs) {
      const normalizedConfig = normalizeConfiguration(config);
      if (normalizedContent === normalizedConfig) {
        return true;
      }
    }

    return false;
  }

  return isTypeTokenDuplicate(initializer, content);
}

function isTypeTokenDuplicate(
  initializer: ArrayLiteralExpression,
  typeToken: string
): boolean {
  typeToken = normalizeTypeToken(typeToken);

  for (const element of initializer.getElements()) {
    const elementText = normalizeTypeToken(element.getText());
    if (elementText === typeToken) {
      return true;
    }
  }

  return false;
}

export function getModule(sourceFile: SourceFile): CallExpression | undefined {
  let moduleNode: CallExpression | undefined;

  function visitor(node: Node) {
    if (Node.isCallExpression(node)) {
      const expression = node.getExpression();
      if (
        Node.isIdentifier(expression) &&
        expression.getText() === 'NgModule' &&
        isImportedFrom(expression, ANGULAR_CORE)
      ) {
        moduleNode = node;
      }
    }

    node.forEachChild(visitor);
  }

  sourceFile.forEachChild(visitor);
  return moduleNode;
}

const COMMENT_REG_EXP = /\/\/.+/gm;
function normalizeTypeToken(token: string): string {
  let newToken = token;

  newToken = newToken.replace(COMMENT_REG_EXP, '');
  newToken = newToken.trim();
  // strip down the trailing comma
  if (newToken.charAt(newToken.length - 1) === ',') {
    newToken = newToken.substring(0, newToken.length - 1);
  }

  return newToken;
}

export function getModulePropertyInitializer(
  source: SourceFile,
  propertyName: ModuleProperty,
  createIfMissing = true
): ArrayLiteralExpression | undefined {
  const property = getModuleProperty(source, propertyName, createIfMissing);
  if (!property || !Node.isPropertyAssignment(property)) {
    return undefined;
  }

  return property.getInitializerIfKind(
    tsMorph.SyntaxKind.ArrayLiteralExpression
  );
}

function getModuleProperty(
  source: SourceFile,
  propertyName: ModuleProperty,
  createIfMissing = true
): ObjectLiteralElementLike | undefined {
  const moduleNode = getModule(source);
  if (!moduleNode) {
    return undefined;
  }

  const arg = moduleNode.getArguments()[0];
  if (!arg || !Node.isObjectLiteralExpression(arg)) {
    return undefined;
  }

  const property = arg.getProperty(propertyName);
  if (!property && createIfMissing) {
    arg.addPropertyAssignment({
      name: propertyName,
      initializer: '[]',
    });
  }

  return arg.getProperty(propertyName);
}

export function collectInstalledModules(spartacusFeaturesModule: SourceFile):
  | {
      spartacusCoreModules: (Expression | Identifier)[];
      featureModules: {
        spartacusLibrary: string;
        moduleNode: Expression | Identifier;
      }[];
      unrecognizedModules: (Expression | Identifier)[];
      warnings: string[];
    }
  | undefined {
  const initializer = getModulePropertyInitializer(
    spartacusFeaturesModule,
    'imports',
    false
  );
  if (!initializer) {
    return undefined;
  }

  const warnings: string[] = [];
  const spartacusCoreModules: (Expression | Identifier)[] = [];
  const featureModules: {
    spartacusLibrary: string;
    moduleNode: Expression | Identifier;
  }[] = [];
  const unrecognizedModules: (Expression | Identifier)[] = [];

  for (const element of initializer.getElements()) {
    const moduleIdentifier = getModuleIdentifier(element);
    if (!moduleIdentifier) {
      warnings.push(
        `Skipping ${element.print()} as it is not recognized as a module.`
      );
      continue;
    }

    const importDeclaration = getImportDeclaration(moduleIdentifier);
    if (!importDeclaration) {
      warnings.push(
        `Skipping ${element.print()} as there is no import found for it.`
      );
      continue;
    }

    const importPath = importDeclaration.getModuleSpecifierValue();
    if (isImportedFromSpartacusLibs(importPath)) {
      spartacusCoreModules.push(element);
      continue;
    }

    const potentialFeatureModule =
      importDeclaration.getModuleSpecifierSourceFile();
    if (!potentialFeatureModule) {
      warnings.push(
        `Skipping ${element.print()} as there is no file found for ${importDeclaration.print()}.`
      );
      continue;
    }

    const spartacusLibrary = recognizeFeatureModule(potentialFeatureModule);
    if (spartacusLibrary) {
      featureModules.push({ spartacusLibrary, moduleNode: element });
    } else {
      unrecognizedModules.push(element);
    }
  }

  return {
    spartacusCoreModules,
    featureModules,
    unrecognizedModules,
    warnings,
  };
}

function getModuleIdentifier(element: Node): Identifier | undefined {
  if (Node.isIdentifier(element)) {
    return element;
  }

  if (Node.isCallExpression(element)) {
    const propertyAccessExpression = element.getFirstChild();
    if (Node.isPropertyAccessExpression(propertyAccessExpression)) {
      const firstIdentifier = propertyAccessExpression.getFirstChild();
      if (Node.isIdentifier(firstIdentifier)) {
        return firstIdentifier;
      }
    }
  }

  return undefined;
}

function recognizeFeatureModule(featureModule: SourceFile): string | undefined {
  const initializer = getModulePropertyInitializer(
    featureModule,
    'imports',
    false
  );
  if (!initializer) {
    return undefined;
  }

  for (const element of initializer.getElements()) {
    const spartacusLibrary = getSpartacusLibraryByModuleImports(element);
    if (spartacusLibrary) {
      return spartacusLibrary;
    }
  }

  return undefined;
}

function getSpartacusLibraryByModuleImports(
  moduleExpression: Node
): string | undefined {
  const moduleIdentifier = getModuleIdentifier(moduleExpression);
  if (!moduleIdentifier) {
    return undefined;
  }

  const moduleName = moduleIdentifier.getText();
  for (const spartacusLibrary of Object.keys(packageFeatureConfigMapping)) {
    if (packageFeatureConfigMapping[spartacusLibrary].includes(moduleName)) {
      return spartacusLibrary;
    }
  }

  return undefined;
}
