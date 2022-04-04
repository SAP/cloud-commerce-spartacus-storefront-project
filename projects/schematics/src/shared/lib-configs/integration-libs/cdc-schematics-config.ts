import {
  CLI_CDC_FEATURE,
  CLI_USER_PROFILE_FEATURE,
  SPARTACUS_CDC,
  SPARTACUS_CDC_ROOT,
  SPARTACUS_USER,
} from '../../libs-constants';
import { FeatureConfig, Module } from '../../utils/lib-utils';
import { USER_PROFILE_MODULE } from '../user-schematics-config';

export const CDC_FOLDER_NAME = 'cdc';
export const CDC_MODULE_NAME = 'Cdc';

export const CDC_MODULE = 'CdcModule';
export const CDC_ROOT_MODULE = 'CdcRootModule';
export const CDC_FEATURE_CONSTANT = 'CDC_FEATURE';
export const CDC_CONFIG = 'CdcConfig';

const CDC_FEATURE_MODULE: Module = {
  importPath: SPARTACUS_CDC,
  name: CDC_MODULE,
};
export const CDC_SCHEMATICS_CONFIG: FeatureConfig = {
  library: {
    cli: CLI_CDC_FEATURE,
    mainScope: SPARTACUS_CDC,
  },
  folderName: CDC_FOLDER_NAME,
  moduleName: CDC_MODULE_NAME,
  featureModule: CDC_FEATURE_MODULE,
  rootModule: {
    importPath: SPARTACUS_CDC_ROOT,
    name: CDC_ROOT_MODULE,
    content: `${CDC_ROOT_MODULE}`,
  },
  lazyLoadingChunk: {
    moduleSpecifier: SPARTACUS_CDC_ROOT,
    namedImports: [CDC_FEATURE_CONSTANT],
  },
  customConfig: {
    import: [
      {
        moduleSpecifier: SPARTACUS_CDC_ROOT,
        namedImports: [CDC_CONFIG],
      },
    ],
    content: `<${CDC_CONFIG}>{
        cdc: [
          {
            baseSite: 'electronics-spa',
            javascriptUrl: '<url-to-cdc-script>',
            sessionExpiration: 3600
          },
        ],
      }`,
  },
  dependencyManagement: {
    [SPARTACUS_USER]: [CLI_USER_PROFILE_FEATURE],
  },
  wrappers: {
    [USER_PROFILE_MODULE]: CDC_MODULE,
  },
};
