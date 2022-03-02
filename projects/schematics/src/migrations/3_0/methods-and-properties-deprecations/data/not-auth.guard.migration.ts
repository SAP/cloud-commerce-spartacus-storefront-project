import {
  CAN_ACTIVATE,
  NOT_AUTH_GUARD,
  TODO_SPARTACUS,
} from '../../../../shared/constants';
import { SPARTACUS_CORE } from '../../../../shared/feature-libs-constants';
import { MethodPropertyDeprecation } from '../../../../shared/utils/file-utils';

export const NOT_AUTH_GUARD_MIGRATION: MethodPropertyDeprecation[] = [
  {
    class: NOT_AUTH_GUARD,
    importPath: SPARTACUS_CORE,
    deprecatedNode: CAN_ACTIVATE,
    comment: `// ${TODO_SPARTACUS} canActivate method now returns Observable that can emit boolean or UrlTree.`,
  },
];
