import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import {
  Schema as ApplicationOptions,
  Style,
} from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';
import { Schema as SpartacusOptions } from '../add-spartacus/schema';
import { CART_BASE_MODULE } from '../shared/lib-configs/cart-schematics-config';
import { CHECKOUT_BASE_MODULE } from '../shared/lib-configs/checkout-schematics-config';
import {
  CART_BASE_FEATURE_NAME,
  CDC_FEATURE_NAME,
  CHECKOUT_B2B_FEATURE_NAME,
  CHECKOUT_BASE_FEATURE_NAME,
  CHECKOUT_SCHEDULED_REPLENISHMENT_FEATURE_NAME,
  DIGITAL_PAYMENTS_FEATURE_NAME,
  SPARTACUS_SCHEMATICS,
} from '../shared/libs-constants';
import { LibraryOptions } from '../shared/utils/lib-utils';
import { createProgram } from '../shared/utils/program';
import { getProjectTsConfigPaths } from '../shared/utils/project-tsconfig-paths';
import {
  cartBaseFeatureModulePath,
  cdcFeatureModulePath,
  checkoutFeatureModulePath,
  checkoutWrapperModulePath,
  digitalPaymentsFeatureModulePath,
  spartacusFeaturesModulePath,
  userFeatureModulePath,
  userWrapperModulePath,
} from '../shared/utils/test-utils';
import { Schema as SpartacusWrapperOptions } from '../wrapper-module/schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('Spartacus Wrapper Module Schematics: ng g @spartacus/schematics:wrapper-module', () => {
  const schematicRunner = new SchematicTestRunner(
    SPARTACUS_SCHEMATICS,
    collectionPath
  );

  let appTree: Tree;
  let buildPath: string;

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

  const defaultOptions: SpartacusOptions = {
    project: 'schematics-test',
    lazy: true,
    features: [],
  };

  const BASE_OPTIONS: LibraryOptions = {
    project: 'schematics-test',
    lazy: true,
  };

  beforeEach(async () => {
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

    buildPath = getProjectTsConfigPaths(appTree, BASE_OPTIONS.project)
      .buildPaths[0];
  });

  describe('One dynamic import in the file', () => {
    it('should generate appropriate feature module', async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            features: [CHECKOUT_B2B_FEATURE_NAME],
            name: 'schematics-test',
          },
          appTree
        )
        .toPromise();

      const { program } = createProgram(appTree, appTree.root.path, buildPath);

      const checkoutFeatureModule = program.getSourceFileOrThrow(
        checkoutFeatureModulePath
      );
      const checkoutWrapperModule = program.getSourceFileOrThrow(
        checkoutWrapperModulePath
      );

      expect(checkoutFeatureModule.print()).toMatchSnapshot();
      expect(checkoutWrapperModule.print()).toMatchSnapshot();
    });
  });

  describe('Multiple dynamic imports in the file', () => {
    it('should generate appropriate feature module', async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            features: [CART_BASE_FEATURE_NAME],
            name: 'schematics-test',
          },
          appTree
        )
        .toPromise();
      const options: SpartacusWrapperOptions = {
        project: 'schematics-test',
        markerModuleName: CART_BASE_MODULE,
        featureModuleName: CART_BASE_MODULE,
      };
      appTree = await schematicRunner
        .runSchematicAsync('wrapper-module', options, appTree)
        .toPromise();

      const { program } = createProgram(appTree, appTree.root.path, buildPath);

      const cartFeatureModule = program.getSourceFileOrThrow(
        cartBaseFeatureModulePath
      );
      const cartWrapperModule = program.getSourceFileOrThrow(
        'src/app/spartacus/features/cart/cart-base-wrapper.module.ts'
      );

      expect(cartFeatureModule.print()).toMatchSnapshot();
      expect(cartWrapperModule.print()).toMatchSnapshot();
    });
  });

  describe('Double execution', () => {
    it('should not change anything', async () => {
      // first execution happens under the hood
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            features: [CHECKOUT_BASE_FEATURE_NAME],
            name: 'schematics-test',
          },
          appTree
        )
        .toPromise();

      const options: SpartacusWrapperOptions = {
        project: 'schematics-test',
        markerModuleName: CHECKOUT_BASE_MODULE,
        featureModuleName: CHECKOUT_BASE_MODULE,
      };
      // the second execution
      appTree = await schematicRunner
        .runSchematicAsync('wrapper-module', options, appTree)
        .toPromise();

      const { program } = createProgram(appTree, appTree.root.path, buildPath);

      const checkoutFeatureModule = program.getSourceFileOrThrow(
        checkoutFeatureModulePath
      );
      const checkoutWrapperModule = program.getSourceFileOrThrow(
        checkoutWrapperModulePath
      );

      expect(checkoutFeatureModule.print()).toMatchSnapshot();
      expect(checkoutWrapperModule.print()).toMatchSnapshot();
    });
  });

  describe('Checkout Scheduled Replenishment', () => {
    it('should create the checkout wrapper module and import Checkout features', async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            name: 'schematics-test',
            features: [CHECKOUT_SCHEDULED_REPLENISHMENT_FEATURE_NAME],
          },
          appTree
        )
        .toPromise();

      const { program } = createProgram(appTree, appTree.root.path, buildPath);

      const checkoutFeatureModule = program.getSourceFileOrThrow(
        checkoutFeatureModulePath
      );
      const checkoutWrapperModule = program.getSourceFileOrThrow(
        checkoutWrapperModulePath
      );

      expect(checkoutFeatureModule.print()).toMatchSnapshot();
      expect(checkoutWrapperModule.print()).toMatchSnapshot();
    });
  });

  describe('Digital Payments', () => {
    it('should create the checkout wrapper module and import Base Checkout and DP', async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            name: 'schematics-test',
            features: [DIGITAL_PAYMENTS_FEATURE_NAME],
          },
          appTree
        )
        .toPromise();

      const { program } = createProgram(appTree, appTree.root.path, buildPath);

      const checkoutWrapperModule = program.getSourceFileOrThrow(
        checkoutWrapperModulePath
      );
      const checkoutFeatureModule = program.getSourceFileOrThrow(
        checkoutFeatureModulePath
      );
      const dpFeaturesModule = program.getSourceFileOrThrow(
        digitalPaymentsFeatureModulePath
      );

      expect(checkoutWrapperModule.print()).toMatchSnapshot();
      expect(checkoutFeatureModule.print()).toMatchSnapshot();
      expect(dpFeaturesModule.print()).toMatchSnapshot();
    });
  });

  describe('CDC', () => {
    it('should create the User wrapper module and import User Profile and CDC', async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            name: 'schematics-test',
            features: [CDC_FEATURE_NAME],
          },
          appTree
        )
        .toPromise();

      const { program } = createProgram(appTree, appTree.root.path, buildPath);

      const userWrapperModule = program.getSourceFileOrThrow(
        userWrapperModulePath
      );
      const userFeatureModule = program.getSourceFileOrThrow(
        userFeatureModulePath
      );
      const cdcFeaturesModule =
        program.getSourceFileOrThrow(cdcFeatureModulePath);

      expect(userWrapperModule.print()).toMatchSnapshot();
      expect(userFeatureModule.print()).toMatchSnapshot();
      expect(cdcFeaturesModule.print()).toMatchSnapshot();
    });
  });

  describe('Checkout and DP', () => {
    it('Should order the imports in the wrapper and Spartacus features modules', async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            name: 'schematics-test',
            features: [
              CHECKOUT_SCHEDULED_REPLENISHMENT_FEATURE_NAME,
              DIGITAL_PAYMENTS_FEATURE_NAME,
            ],
          },
          appTree
        )
        .toPromise();

      const { program } = createProgram(appTree, appTree.root.path, buildPath);

      const spartacusFeaturesModule = program.getSourceFileOrThrow(
        spartacusFeaturesModulePath
      );
      const checkoutFeatureModule = program.getSourceFileOrThrow(
        checkoutFeatureModulePath
      );
      const checkoutWrapperModule = program.getSourceFileOrThrow(
        checkoutWrapperModulePath
      );
      const dpFeaturesModule = program.getSourceFileOrThrow(
        digitalPaymentsFeatureModulePath
      );
      expect(spartacusFeaturesModule.print()).toMatchSnapshot();
      expect(checkoutFeatureModule.print()).toMatchSnapshot();
      expect(checkoutWrapperModule.print()).toMatchSnapshot();
      expect(dpFeaturesModule.print()).toMatchSnapshot();
    });
  });
});
