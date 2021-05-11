/// <reference types="jest" />

import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import {
  Schema as ApplicationOptions,
  Style,
} from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import {
  CLI_SMARTEDIT_FEATURE,
  LibraryOptions as SpartacusSmartEditOptions,
  SpartacusOptions,
} from '@spartacus/schematics';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');
const smartEditModulePath =
  'src/app/spartacus/features/smartedit/smart-edit-feature.module.ts';

// TODO: Improve tests after lib-util test update
describe('Spartacus SmartEdit schematics: ng-add', () => {
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    version: '0.5.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'schematics-test',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: false,
    projectRoot: '',
  };

  const spartacusDefaultOptions: SpartacusOptions = {
    project: 'schematics-test',
    configuration: 'b2c',
    lazy: true,
    features: [],
  };

  const defaultFeatureOptions: SpartacusSmartEditOptions = {
    project: 'schematics-test',
    lazy: true,
    features: [CLI_SMARTEDIT_FEATURE],
  };

  beforeEach(async () => {
    schematicRunner.registerCollection(
      '@spartacus/schematics',
      '../../projects/schematics/src/collection.json'
    );

    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions
      )
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        appTree
      )
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@spartacus/schematics',
        'ng-add',
        { ...spartacusDefaultOptions, name: 'schematics-test' },
        appTree
      )
      .toPromise();
  });

  describe('When no features are provided', () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          { ...defaultFeatureOptions, features: [] },
          appTree
        )
        .toPromise();
    });

    it('should not create the feature module', () => {
      const featureModule = appTree.readContent(smartEditModulePath);
      expect(featureModule).toBeFalsy();
    });
    it('should not add the feature to the feature module', () => {
      const spartacusFeaturesModulePath = appTree.readContent(
        'src/app/spartacus/spartacus-features.module.ts'
      );
      expect(spartacusFeaturesModulePath).toMatchSnapshot();
    });
  });

  describe('SmartEdit feature', () => {
    describe('assets', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync('ng-add', defaultFeatureOptions, appTree)
          .toPromise();
      });

      it('should add update angular.json with smartedit/assets', async () => {
        const content = appTree.readContent('/angular.json');
        const angularJson = JSON.parse(content);
        const buildAssets: any[] =
          angularJson.projects['schematics-test'].architect.build.options
            .assets;
        expect(buildAssets).toEqual([
          'src/favicon.ico',
          'src/assets',
          {
            glob: '**/*',
            input: './node_modules/@spartacus/smartedit/assets',
            output: 'assets/',
          },
        ]);

        const testAssets: any[] =
          angularJson.projects['schematics-test'].architect.test.options.assets;
        expect(testAssets).toEqual([
          'src/favicon.ico',
          'src/assets',
          {
            glob: '**/*',
            input: './node_modules/@spartacus/smartedit/assets',
            output: 'assets/',
          },
        ]);
      });
    });

    describe('eager loading', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync(
            'ng-add',
            { ...defaultFeatureOptions, lazy: false },
            appTree
          )
          .toPromise();
      });

      it('should import appropriate modules', async () => {
        const smarteditModule = appTree.readContent(smartEditModulePath);
        expect(smarteditModule).toContain(
          `import { SmartEditRootModule } from "@spartacus/smartedit/root";`
        );
        expect(smarteditModule).toContain(
          `import { SmartEditModule } from "@spartacus/smartedit";`
        );
      });

      it('should not contain lazy loading syntax', async () => {
        const smarteditModule = appTree.readContent(smartEditModulePath);
        expect(smarteditModule).not.toContain(
          `import('@spartacus/smartedit').then(`
        );
      });
    });

    describe('lazy loading', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync('ng-add', defaultFeatureOptions, appTree)
          .toPromise();
      });

      it('should import SmartEditRootModule and contain the lazy loading syntax', async () => {
        const smarteditModule = appTree.readContent(smartEditModulePath);
        expect(smarteditModule).toContain(
          `import { SmartEditRootModule, SMART_EDIT_FEATURE } from "@spartacus/smartedit/root";`
        );
        expect(smarteditModule).toContain(
          `import('@spartacus/smartedit').then(`
        );
      });

      it('should not contain the SmartEditModule import', () => {
        const smarteditModule = appTree.readContent(smartEditModulePath);
        expect(smarteditModule).not.toContain(
          `import { SmartEditModule } from "@spartacus/smartedit";`
        );
      });
    });
  });
});
