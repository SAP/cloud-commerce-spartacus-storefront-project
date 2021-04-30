import { SPARTACUS_TRACKING } from '@spartacus/schematics';

export const TRACKING_FOLDER_NAME = 'tracking';

export const PERSONALIZATION_MODULE = 'PersonalizationModule';
export const PERSONALIZATION_FEATURE_NAME = 'personalization';
export const PERSONALIZATION_FEATURE_CONSTANT = 'PERSONALIZATION_FEATURE';
export const PERSONALIZATION_ROOT_MODULE = 'PersonalizationRootModule';
export const SPARTACUS_PERSONALIZATION = `${SPARTACUS_TRACKING}/personalization`;
export const SPARTACUS_PERSONALIZATION_ROOT = `${SPARTACUS_PERSONALIZATION}/root`;

export const TMS_BASE_MODULE = 'BaseTmsModule';
export const TMS_CONFIG = 'TmsConfig';
export const SPARTACUS_TMS_CORE = `${SPARTACUS_TRACKING}/tms/core`;
export const TMS_GTM_MODULE = 'GtmModule';
export const SPARTACUS_TMS_GTM = `${SPARTACUS_TRACKING}/tms/gtm`;
export const TMS_AEP_MODULE = 'AepModule';
export const SPARTACUS_TMS_AEP = `${SPARTACUS_TRACKING}/tms/aep`;

export const CLI_PERSONALIZATION_FEATURE = 'Personalization';
export const CLI_TMS_FEATURE = 'TagManagement';
export const CLI_TMS_GTM_FEATURE = 'Tag Management System - Google Tag Manager';
export const CLI_TMS_AEP_FEATURE =
  'Tag Management System - Adobe Experience Platform Launch';
