/// <reference types="jest" />

import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import {
  cartBaseFeatureModulePath,
  CHECKOUT_B2B_FEATURE_NAME,
  CHECKOUT_BASE_FEATURE_NAME,
  CHECKOUT_SCHEDULED_REPLENISHMENT_FEATURE_NAME,
  checkoutFeatureModulePath,
  checkoutWrapperModulePath,
  generateDefaultWorkspace,
  LibraryOptions as SpartacusCheckoutOptions,
  orderFeatureModulePath,
  SPARTACUS_CHECKOUT,
  SPARTACUS_CONFIGURATION_MODULE,
  SPARTACUS_SCHEMATICS,
  userFeatureModulePath,
} from '@spartacus/schematics';
import * as path from 'path';
import { peerDependencies } from '../../package.json';

const collectionPath = path.join(__dirname, '../collection.json');
const scssFilePath = 'src/styles/spartacus/checkout.scss';

describe('Spartacus Checkout schematics: ng-add', () => {
  const schematicRunner = new SchematicTestRunner(
    SPARTACUS_CHECKOUT,
    collectionPath
  );

  let appTree: UnitTestTree;

  const libraryNoFeaturesOptions: SpartacusCheckoutOptions = {
    project: 'schematics-test',
    lazy: true,
    features: [],
  };

  const checkoutBaseFeatureOptions: SpartacusCheckoutOptions = {
    ...libraryNoFeaturesOptions,
    features: [CHECKOUT_BASE_FEATURE_NAME],
  };

  const checkoutB2BFeatureOptions: SpartacusCheckoutOptions = {
    ...libraryNoFeaturesOptions,
    features: [CHECKOUT_B2B_FEATURE_NAME],
  };

  const checkoutScheduledReplenishmentFeatureOptions: SpartacusCheckoutOptions =
    {
      ...libraryNoFeaturesOptions,
      features: [CHECKOUT_SCHEDULED_REPLENISHMENT_FEATURE_NAME],
    };

  describe('Without features', () => {
    beforeAll(async () => {
      appTree = await generateDefaultWorkspace(schematicRunner, appTree);

      appTree = await schematicRunner.runSchematic(
        'ng-add',
        { ...libraryNoFeaturesOptions, features: [] },
        appTree
      );
    });

    it('should not create any of the feature modules', () => {
      expect(appTree.exists(checkoutFeatureModulePath)).toBeFalsy();
    });

    it('should install necessary Spartacus libraries', () => {
      const packageJson = JSON.parse(appTree.readContent('package.json'));
      let dependencies: Record<string, string> = {};
      dependencies = { ...packageJson.dependencies };
      dependencies = { ...dependencies, ...packageJson.devDependencies };

      for (const toAdd in peerDependencies) {
        // skip the SPARTACUS_SCHEMATICS, as those are added only when running by the Angular CLI, and not in the testing environment
        if (
          !peerDependencies.hasOwnProperty(toAdd) ||
          toAdd === SPARTACUS_SCHEMATICS
        ) {
          continue;
        }
        // TODO: after 4.0: use this test, as we'll have synced versions between lib's and root package.json
        // const expectedVersion = (peerDependencies as Record<
        //   string,
        //   string
        // >)[toAdd];
        const expectedDependency = dependencies[toAdd];
        expect(expectedDependency).toBeTruthy();
        // expect(expectedDependency).toEqual(expectedVersion);
      }
    });
  });

  describe('Checkout feature', () => {
    describe('base', () => {
      describe('general setup', () => {
        beforeAll(async () => {
          appTree = await generateDefaultWorkspace(schematicRunner, appTree);
          appTree = await schematicRunner.runSchematic(
            'ng-add',
            checkoutBaseFeatureOptions,
            appTree
          );
        });

        it('should add the feature using the lazy loading syntax', async () => {
          const module = appTree.readContent(checkoutFeatureModulePath);
          expect(module).toMatchSnapshot();

          expect(appTree.readContent(checkoutWrapperModulePath)).toBeFalsy();
        });

        it('should NOT install the required feature dependencies', async () => {
          const cartBaseFeatureModule = appTree.readContent(
            cartBaseFeatureModulePath
          );
          expect(cartBaseFeatureModule).toBeFalsy();

          const orderFeatureModule = appTree.readContent(
            orderFeatureModulePath
          );
          expect(orderFeatureModule).toBeFalsy();

          const userFeatureModule = appTree.readContent(userFeatureModulePath);
          expect(userFeatureModule).toBeFalsy();
        });

        describe('styling', () => {
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

      describe('eager loading', () => {
        beforeAll(async () => {
          appTree = await generateDefaultWorkspace(schematicRunner, appTree);
          appTree = await schematicRunner.runSchematic(
            'ng-add',
            { ...checkoutBaseFeatureOptions, lazy: false },
            appTree
          );
        });

        it('should import appropriate modules', async () => {
          const module = appTree.readContent(checkoutFeatureModulePath);
          expect(module).toMatchSnapshot();

          expect(appTree.readContent(checkoutWrapperModulePath)).toBeFalsy();
        });
      });
    });

    describe('b2b', () => {
      describe('general setup', () => {
        beforeAll(async () => {
          appTree = await generateDefaultWorkspace(schematicRunner, appTree);
          appTree = await schematicRunner.runSchematic(
            'ng-add',
            checkoutBaseFeatureOptions,
            appTree
          );

          appTree = await schematicRunner.runSchematic(
            'ng-add',
            checkoutB2BFeatureOptions,
            appTree
          );
        });

        it('should add the feature using the lazy loading syntax', async () => {
          const module = appTree.readContent(checkoutFeatureModulePath);
          expect(module).toMatchSnapshot();

          const wrapperModule = appTree.readContent(checkoutWrapperModulePath);
          expect(wrapperModule).toMatchSnapshot();
        });

        it('should NOT install the required feature dependencies', async () => {
          const cartBaseFeatureModule = appTree.readContent(
            cartBaseFeatureModulePath
          );
          expect(cartBaseFeatureModule).toBeFalsy();

          const orderFeatureModule = appTree.readContent(
            orderFeatureModulePath
          );
          expect(orderFeatureModule).toBeFalsy();

          const userFeatureModule = appTree.readContent(userFeatureModulePath);
          expect(userFeatureModule).toBeFalsy();
        });

        describe('styling', () => {
          it('should create a proper scss file', () => {
            const scssContent = appTree.readContent(scssFilePath);
            expect(scssContent).toMatchSnapshot();
          });

          it('should update angular.json', async () => {
            const content = appTree.readContent('/angular.json');
            expect(content).toMatchSnapshot();
          });
        });

        describe('b2b features', () => {
          it('configuration should be added', () => {
            const configurationModule = appTree.readContent(
              `src/app/spartacus/${SPARTACUS_CONFIGURATION_MODULE}.module.ts`
            );
            expect(configurationModule).toMatchSnapshot();
          });
        });
      });

      describe('eager loading', () => {
        beforeAll(async () => {
          appTree = await generateDefaultWorkspace(schematicRunner, appTree);
          appTree = await schematicRunner.runSchematic(
            'ng-add',
            { ...checkoutBaseFeatureOptions, lazy: false },
            appTree
          );

          appTree = await schematicRunner.runSchematic(
            'ng-add',
            { ...checkoutB2BFeatureOptions, lazy: false },
            appTree
          );
        });

        it('should import appropriate modules', async () => {
          const module = appTree.readContent(checkoutFeatureModulePath);
          expect(module).toMatchSnapshot();

          expect(appTree.readContent(checkoutWrapperModulePath)).toBeFalsy();
        });
      });
    });

    describe('scheduled replenishment', () => {
      describe('general setup', () => {
        beforeAll(async () => {
          appTree = await generateDefaultWorkspace(schematicRunner, appTree);
          appTree = await schematicRunner.runSchematic(
            'ng-add',
            checkoutBaseFeatureOptions,
            appTree
          );

          appTree = await schematicRunner.runSchematic(
            'ng-add',
            checkoutB2BFeatureOptions,
            appTree
          );

          appTree = await schematicRunner.runSchematic(
            'ng-add',
            checkoutScheduledReplenishmentFeatureOptions,
            appTree
          );
        });

        it('should add the feature using the lazy loading syntax', async () => {
          const module = appTree.readContent(checkoutFeatureModulePath);
          expect(module).toMatchSnapshot();

          const wrapperModule = appTree.readContent(checkoutWrapperModulePath);
          expect(wrapperModule).toMatchSnapshot();
        });

        it('should NOT install the required feature dependencies', async () => {
          const cartBaseFeatureModule = appTree.readContent(
            cartBaseFeatureModulePath
          );
          expect(cartBaseFeatureModule).toBeFalsy();

          const orderFeatureModule = appTree.readContent(
            orderFeatureModulePath
          );
          expect(orderFeatureModule).toBeFalsy();

          const userFeatureModule = appTree.readContent(userFeatureModulePath);
          expect(userFeatureModule).toBeFalsy();
        });

        describe('styling', () => {
          it('should create a proper scss file', () => {
            const scssContent = appTree.readContent(scssFilePath);
            expect(scssContent).toMatchSnapshot();
          });

          it('should update angular.json', async () => {
            const content = appTree.readContent('/angular.json');
            expect(content).toMatchSnapshot();
          });
        });

        describe('b2b features', () => {
          it('configuration should be added', () => {
            const configurationModule = appTree.readContent(
              `src/app/spartacus/${SPARTACUS_CONFIGURATION_MODULE}.module.ts`
            );
            expect(configurationModule).toMatchSnapshot();
          });
        });
      });

      describe('eager loading', () => {
        beforeAll(async () => {
          appTree = await generateDefaultWorkspace(schematicRunner, appTree);
          appTree = await schematicRunner.runSchematic(
            'ng-add',
            { ...checkoutBaseFeatureOptions, lazy: false },
            appTree
          );

          appTree = await schematicRunner.runSchematic(
            'ng-add',
            { ...checkoutB2BFeatureOptions, lazy: false },
            appTree
          );

          appTree = await schematicRunner.runSchematic(
            'ng-add',
            { ...checkoutScheduledReplenishmentFeatureOptions, lazy: false },
            appTree
          );
        });

        it('should import appropriate modules', async () => {
          const module = appTree.readContent(checkoutFeatureModulePath);
          expect(module).toMatchSnapshot();

          expect(appTree.readContent(checkoutWrapperModulePath)).toBeFalsy();
        });
      });
    });
  });
});
