import {
  CURRENCY_SERVICE,
  INITIALIZE,
  TODO_SPARTACUS,
} from '../../../../shared/constants';
import { SPARTACUS_CORE } from '../../../../shared/feature-libs-constants';
import { MethodPropertyDeprecation } from '../../../../shared/utils/file-utils';

// projects/core/src/site-context/facade/currency.service.ts
export const CURRENCY_SERVICE_MIGRATION: MethodPropertyDeprecation[] = [
  {
    class: CURRENCY_SERVICE,
    importPath: SPARTACUS_CORE,
    deprecatedNode: INITIALIZE,
    comment: `// ${TODO_SPARTACUS} Method '${CURRENCY_SERVICE}.${INITIALIZE}' was removed. The state initialization is done with the 'CurrencyInitializer' .`,
  },
];
