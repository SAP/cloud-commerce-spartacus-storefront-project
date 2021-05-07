import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { ConstructorDeprecation } from '../../../shared/utils/file-utils';
import { migrateConstructorDeprecation } from '../../mechanism/constructor-deprecations/constructor-deprecations';
import { ABSTRACT_STORE_ITEM_COMPONENT_MIGRATION } from './data/abstract-store-item.component.migration';
import {
  CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V1,
  CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V2,
} from './data/cart-page-event.builder.migration';
import { COMPONENT_WRAPPER_CONSTRUCTOR_MIGRATION } from './data/component-wrapper.directive.migration';
import {
  GOOGLE_MAP_RENDERER_SERVICE_MIGRATION_V1,
  GOOGLE_MAP_RENDERER_SERVICE_MIGRATION_V2,
} from './data/google-map-renderer.service.migration';
import { HOME_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION } from './data/home-page-event.builder.migration';
import { PRODUCT_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION } from './data/product-page-event.builder.migration';
import { SCHEDULE_COMPONENT_MIGRATION } from './data/schedule.component.migration';
import { SEARCH_BOX_COMPONENT_SERVICE_MIGRATION } from './data/search-box-component.service.migration';
import { STORE_FINDER_LIST_ITEM_COMPONENT_MIGRATION } from './data/store-finder-list-item.component.migration';
import { STORE_FINDER_LIST_COMPONENT_MIGRATION } from './data/store-finder-list.component.migration';
import { STORE_FINDER_STORE_DESCRIPTION_COMPONENT_MIGRATION } from './data/store-finder-store-description.component.migration';
import { STORE_FINDER_SERVICE_MIGRATION } from './data/store-finder.service.migration';
import { UNIT_CHILDREN_COMPONENT_MIGRATION } from './data/unit-children.component.migration';
import { UNIT_COST_CENTERS_COMPONENT_MIGRATION } from './data/unit-cost-centers.component.migration';
import { UNIT_USER_LIST_COMPONENT_MIGRATION } from './data/unit-user-list.component.migration';

export const CONSTRUCTOR_DEPRECATION_DATA: ConstructorDeprecation[] = [
  UNIT_CHILDREN_COMPONENT_MIGRATION,
  UNIT_COST_CENTERS_COMPONENT_MIGRATION,
  UNIT_USER_LIST_COMPONENT_MIGRATION,
  CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V1,
  CART_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION_V2,
  HOME_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION,
  PRODUCT_PAGE_EVENT_BUILDER_COMPONENT_MIGRATION,
  SEARCH_BOX_COMPONENT_SERVICE_MIGRATION,
  COMPONENT_WRAPPER_CONSTRUCTOR_MIGRATION,
  STORE_FINDER_SERVICE_MIGRATION,
  ABSTRACT_STORE_ITEM_COMPONENT_MIGRATION,
  SCHEDULE_COMPONENT_MIGRATION,
  STORE_FINDER_LIST_ITEM_COMPONENT_MIGRATION,
  STORE_FINDER_LIST_COMPONENT_MIGRATION,
  STORE_FINDER_STORE_DESCRIPTION_COMPONENT_MIGRATION,
  GOOGLE_MAP_RENDERER_SERVICE_MIGRATION_V1,
  GOOGLE_MAP_RENDERER_SERVICE_MIGRATION_V2,
];

export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return migrateConstructorDeprecation(
      tree,
      context,
      CONSTRUCTOR_DEPRECATION_DATA
    );
  };
}
