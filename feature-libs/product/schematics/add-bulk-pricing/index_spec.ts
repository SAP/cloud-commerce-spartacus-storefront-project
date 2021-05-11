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
  LibraryOptions as SpartacusBulkPricingOptions,
  SpartacusOptions,
} from '@spartacus/schematics';
import * as path from 'path';
import { CLI_BULK_PRICING_FEATURE } from '../constants';

const collectionPath = path.join(__dirname, '../collection.json');
const bulkPricingModulePath =
  'src/app/spartacus/features/product/product-bulk-pricing-feature.module.ts';
const scssFilePath = 'src/styles/spartacus/product.scss';

// TODO: Improve tests after lib-util test update
describe('Spartacus BulkPricing schematics: ng-add', () => {
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

  const defaultFeatureOptions: SpartacusBulkPricingOptions = {
    project: 'schematics-test',
    lazy: true,
    features: [CLI_BULK_PRICING_FEATURE],
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

  describe('BulkPricing feature', () => {
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
        const bulkPricingModule = appTree.readContent(bulkPricingModulePath);
        expect(bulkPricingModule).toContain(
          `import { BulkPricingRootModule } from "@spartacus/product/bulk-pricing/root";`
        );
        expect(bulkPricingModule).toContain(
          `import { BulkPricingModule } from "@spartacus/product/bulk-pricing";`
        );
      });

      it('should not contain lazy loading syntax', async () => {
        const bulkPricingModule = appTree.readContent(bulkPricingModulePath);
        expect(bulkPricingModule).not.toContain(
          `import('@spartacus/product/bulk-pricing').then(`
        );
      });
    });

    describe('lazy loading', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync('ng-add', defaultFeatureOptions, appTree)
          .toPromise();
      });

      it('should import BulkPricingRootModule and contain the lazy loading syntax', async () => {
        const bulkPricingModule = appTree.readContent(bulkPricingModulePath);
        expect(bulkPricingModule).toContain(
          `import { BulkPricingRootModule, PRODUCT_BULK_PRICING_FEATURE } from "@spartacus/product/bulk-pricing/root";`
        );
        expect(bulkPricingModule).toContain(
          `import('@spartacus/product/bulk-pricing').then(`
        );
      });

      it('should not contain the BulkPricingModule import', () => {
        const bulkPricingModule = appTree.readContent(bulkPricingModulePath);
        expect(bulkPricingModule).not.toContain(
          `import { BulkPricingModule } from "@spartacus/product/bulk-pricing";`
        );
      });
    });

    describe('i18n', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync('ng-add', defaultFeatureOptions, appTree)
          .toPromise();
      });

      it('should import the i18n resource and chunk from assets', async () => {
        const bulkPricingModule = appTree.readContent(bulkPricingModulePath);
        expect(bulkPricingModule).toContain(
          `import { bulkPricingTranslationChunksConfig, bulkPricingTranslations } from "@spartacus/product/bulk-pricing/assets";`
        );
      });
      it('should provideConfig', async () => {
        const bulkPricingModule = appTree.readContent(bulkPricingModulePath);
        expect(bulkPricingModule).toContain(
          `resources: bulkPricingTranslations,`
        );
        expect(bulkPricingModule).toContain(
          `chunks: bulkPricingTranslationChunksConfig,`
        );
      });
    });

    describe('styling', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync('ng-add', defaultFeatureOptions, appTree)
          .toPromise();
      });

      it('should create a proper scss file', () => {
        const scssContent = appTree.readContent(scssFilePath);
        expect(scssContent).toMatchSnapshot();
      });

      it('should update angular.json', async () => {
        const content = appTree.readContent('/angular.json');
        expect(content).toMatchSnapshot();
      });
    });
  });
});
