import {
  ANGULAR_CORE,
  CHANGE_DETECTOR_REF,
  FORM_ERRORS_COMPONENT,
  KEY_VALUE_DIFFERS,
  SPARTACUS_STOREFRONTLIB,
} from '../../../../shared/constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const FORM_ERRORS_COMPONENT_MIGRATION: ConstructorDeprecation = {
  // /projects/storefrontlib/shared/components/form/form-errors/form-errors.component.ts
  class: FORM_ERRORS_COMPONENT,
  importPath: SPARTACUS_STOREFRONTLIB,
  deprecatedParams: [],
  addParams: [
    { className: CHANGE_DETECTOR_REF, importPath: ANGULAR_CORE },
    { className: KEY_VALUE_DIFFERS, importPath: ANGULAR_CORE },
  ],
};
