import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import {
  Schema as ApplicationOptions,
  Style,
} from '@schematics/angular/application/schema';
import {
  ProjectType,
  WorkspaceProject,
} from '@schematics/angular/utility/workspace-models';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';
import { Schema as SpartacusOptions } from '../../add-spartacus/schema';
import {
  buildDefaultPath,
  getProjectFromWorkspace,
  getSourceRoot,
  getWorkspace,
} from './workspace-utils';

const collectionPath = path.join(__dirname, '../../collection.json');
const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

describe('Workspace utils', () => {
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
  const defaultOptions: SpartacusOptions = {
    project: 'schematics-test',
    configuration: 'b2c',
    lazy: true,
    features: [],
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
    appTree = await schematicRunner
      .runSchematicAsync('add-spartacus', defaultOptions, appTree)
      .toPromise();
  });

  describe('getSourceRoot', () => {
    it('should return the source root of the default project', async () => {
      const sourceRoot = getSourceRoot(appTree, {});
      expect(sourceRoot).toEqual('src');
    });
  });

  describe('getWorkspace', () => {
    it('should return data about project', async () => {
      const workspaceInfo = getWorkspace(appTree);
      expect(workspaceInfo.path).toEqual('/angular.json');
      expect(workspaceInfo.workspace.defaultProject).toEqual(appOptions.name);
    });
  });

  describe('getProjectFromWorkspace', () => {
    it('should return workspace project object', async () => {
      const workspaceProjectObject = getProjectFromWorkspace(
        appTree,
        defaultOptions
      );
      expect(workspaceProjectObject.projectType).toEqual('application');
      expect(workspaceProjectObject.sourceRoot).toEqual('src');
    });
  });

  describe('buildDefaultPath', () => {
    let project: WorkspaceProject;
    beforeEach(() => {
      project = {
        projectType: ProjectType.Application,
        root: 'foo',
        prefix: 'app',
      };
    });

    it('should handle projectType of application', () => {
      const result = buildDefaultPath(project);
      expect(result).toEqual('/foo/src/app');
    });

    it('should handle projectType of library', () => {
      project = { ...project, projectType: ProjectType.Library };
      const result = buildDefaultPath(project);
      expect(result).toEqual('/foo/src/lib');
    });

    it('should handle sourceRoot', () => {
      project = { ...project, sourceRoot: 'foo/bar/custom' };
      const result = buildDefaultPath(project);
      expect(result).toEqual('/foo/bar/custom/app');
    });
  });
});
