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
  SEGMENT_REFS_FEATURE_NAME,
  SPARTACUS_SCHEMATICS,
  SPARTACUS_SEGMENT_REFS,
  LibraryOptions as SegmentRefsOptions,
  SpartacusOptions,
  TRACKING_PERSONALIZATION_FEATURE_NAME,
  segmentRefsFeatureModulePath,
  trackingPersonalizationFeatureModulePath,
} from '@spartacus/schematics';
import * as path from 'path';
import { peerDependencies } from '../../package.json';

const collectionPath = path.join(__dirname, '../collection.json');

describe('Spartacus segment-refs schematics: ng-add', () => {
  const schematicRunner = new SchematicTestRunner(
    SPARTACUS_SEGMENT_REFS,
    collectionPath,
  );

  let appTree: UnitTestTree;

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    version: '0.5.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'schematics-test',
    inlineStyle: false,
    inlineTemplate: false,
    style: Style.Scss,
    skipTests: false,
    projectRoot: '',
    standalone: false,
  };

  const spartacusDefaultOptions: SpartacusOptions = {
    project: 'schematics-test',
    lazy: true,
    features: [],
  };

  const libraryNoFeaturesOptions: SegmentRefsOptions = {
    project: 'schematics-test',
    lazy: false,
    features: [],
  };

  const segmentRefsFeatureOptions: SegmentRefsOptions = {
    ...libraryNoFeaturesOptions,
    features: [SEGMENT_REFS_FEATURE_NAME],
  };

  beforeEach(async () => {
    schematicRunner.registerCollection(
      SPARTACUS_SCHEMATICS,
      path.join(
        __dirname,
        '../../../../projects/schematics/src/collection.json',
      ),
    );

    appTree = await schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'workspace',
      workspaceOptions,
    );

    appTree = await schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'application',
      appOptions,
      appTree,
    );

    appTree = await schematicRunner.runExternalSchematic(
      SPARTACUS_SCHEMATICS,
      'ng-add',
      { ...spartacusDefaultOptions, name: 'schematics-test' },
      appTree,
    );
  });

  describe('Without features', () => {
    beforeEach(async () => {
      appTree = await schematicRunner.runSchematic(
        'ng-add',
        libraryNoFeaturesOptions,
        appTree,
      );
    });

    it('should not create any of the feature modules', () => {
      expect(appTree.exists(segmentRefsFeatureModulePath)).toBeFalsy();
    });
  });

  describe('Segment-refs feature', () => {
    describe('general setup', () => {
      beforeEach(async () => {
        appTree = await schematicRunner.runSchematic(
          'ng-add',
          {
            ...segmentRefsFeatureOptions,
            features: [TRACKING_PERSONALIZATION_FEATURE_NAME],
          },
          appTree,
        );
        appTree = await schematicRunner.runSchematic(
          'ng-add',
          segmentRefsFeatureOptions,
          appTree,
        );
      });

      it('should install necessary Spartacus libraries', () => {
        const packageJson = JSON.parse(appTree.readContent('package.json'));
        let dependencies: Record<string, string> = {};
        dependencies = { ...packageJson.dependencies };
        dependencies = { ...dependencies, ...packageJson.devDependencies };

        for (const toAdd in peerDependencies) {
          if (
            !peerDependencies.hasOwnProperty(toAdd) ||
            toAdd === SPARTACUS_SCHEMATICS
          ) {
            continue;
          }
          const expectedDependency = dependencies[toAdd];
          expect(expectedDependency).toBeTruthy();
        }
      });

      it('should add the feature using the lazy loading syntax', async () => {
        const module = appTree.readContent(segmentRefsFeatureModulePath);
        expect(module).toMatchSnapshot();
      });
    });

    describe('eager loading', () => {
      beforeEach(async () => {
        appTree = await schematicRunner.runSchematic(
          'ng-add',
          {
            ...segmentRefsFeatureOptions,
            features: [TRACKING_PERSONALIZATION_FEATURE_NAME],
          },
          appTree,
        );
        appTree = await schematicRunner.runSchematic(
          'ng-add',
          { ...segmentRefsFeatureOptions, lazy: false },
          appTree,
        );
      });

      it('should import appropriate modules', async () => {
        const module = appTree.readContent(segmentRefsFeatureModulePath);
        expect(module).toMatchSnapshot();
        expect(
          appTree.readContent(trackingPersonalizationFeatureModulePath),
        ).toBeTruthy();
      });
    });
  });
});
