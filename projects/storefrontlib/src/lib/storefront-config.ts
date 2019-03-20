import {
  AuthConfig,
  OccConfig,
  StateConfig,
  ConfigurableRoutesConfig,
  CmsConfig,
  SiteContextConfig,
  OccProductConfig
} from '@spartacus/core';
import { PWAModuleConfig } from './pwa/pwa.module-config';
import { LayoutConfig } from './ui/layout/config/layout-config';

export interface StorefrontModuleConfig
  extends AuthConfig,
    CmsConfig,
    OccConfig,
    StateConfig,
    PWAModuleConfig,
    SiteContextConfig,
    LayoutConfig,
    ConfigurableRoutesConfig,
    OccProductConfig {}
