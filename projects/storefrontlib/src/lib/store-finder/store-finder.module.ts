import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  ConfigModule,
  I18nModule,
  StoreFinderCoreModule,
  UrlTranslationModule,
} from '@spartacus/core';
import { LayoutConfig } from '../../layout/config/layout-config';
import { BootstrapModule } from '../bootstrap.module';
import { CmsModule } from '../cms/cms.module';
import { PaginationAndSortingModule } from '../ui/components/pagination-and-sorting/pagination-and-sorting.module';
import { SpinnerModule } from '../ui/components/spinner/spinner.module';
import { ScheduleComponent } from './components/schedule-component/schedule.component';
import { StoreFinderGridComponent } from './components/store-finder-grid/store-finder-grid.component';
import { StoreFinderHeaderComponent } from './components/store-finder-header/store-finder-header.component';
import { StoreFinderListItemComponent } from './components/store-finder-list-item/store-finder-list-item.component';
import { StoreFinderMapComponent } from './components/store-finder-map/store-finder-map.component';
// tslint:disable-next-line:max-line-length
import { StoreFinderPaginationDetailsComponent } from './components/store-finder-pagination-details/store-finder-pagination-details.component';
import { StoreFinderListComponent } from './components/store-finder-search-result/store-finder-list/store-finder-list.component';
import { StoreFinderSearchResultComponent } from './components/store-finder-search-result/store-finder-search-result.component';
import { StoreFinderSearchComponent } from './components/store-finder-search/store-finder-search.component';
import { StoreFinderStoreDescriptionComponent } from './components/store-finder-store-description/store-finder-store-description.component';
import { StoreFinderStoresCountComponent } from './components/store-finder-stores-count/store-finder-stores-count.component';
import { StoreFinderComponent } from './components/store-finder/store-finder.component';

@NgModule({
  imports: [
    CommonModule,
    CmsModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationAndSortingModule,
    BootstrapModule,
    SpinnerModule,
    UrlTranslationModule,
    StoreFinderCoreModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig | LayoutConfig>{
      cmsComponents: {
        StoreFinderComponent: {
          selector: 'cx-store-finder',
          childRoutes: [
            {
              path: 'find',
              component: StoreFinderSearchResultComponent,
            },
            {
              path: 'view-all',
              component: StoreFinderStoresCountComponent,
            },
            {
              path: 'country/:country',
              component: StoreFinderGridComponent,
            },
            {
              path: 'country/:country/region/:region',
              component: StoreFinderGridComponent,
            },
            {
              path: 'country/:country/region/:region/:store',
              component: StoreFinderStoreDescriptionComponent,
            },
            {
              path: 'country/:country/:store',
              component: StoreFinderStoreDescriptionComponent,
            },
          ],
        },
      },
      layoutSlots: {
        StoreFinderPageTemplate: {
          slots: ['MiddleContent', 'SideContent'],
        },
      },
    }),
  ],
  declarations: [
    StoreFinderSearchComponent,
    StoreFinderListComponent,
    StoreFinderMapComponent,
    StoreFinderListItemComponent,
    StoreFinderStoresCountComponent,
    StoreFinderGridComponent,
    StoreFinderStoreDescriptionComponent,
    ScheduleComponent,
    StoreFinderHeaderComponent,
    StoreFinderSearchResultComponent,
    StoreFinderComponent,
    StoreFinderPaginationDetailsComponent,
  ],
  exports: [
    StoreFinderSearchComponent,
    StoreFinderListComponent,
    StoreFinderMapComponent,
    StoreFinderListItemComponent,
    StoreFinderStoresCountComponent,
    StoreFinderGridComponent,
    StoreFinderStoreDescriptionComponent,
    ScheduleComponent,
    StoreFinderHeaderComponent,
    StoreFinderSearchResultComponent,
    StoreFinderComponent,
    StoreFinderPaginationDetailsComponent,
  ],
  entryComponents: [
    StoreFinderComponent,
    StoreFinderSearchResultComponent,
    StoreFinderStoresCountComponent,
    StoreFinderGridComponent,
    StoreFinderStoreDescriptionComponent,
    StoreFinderStoreDescriptionComponent,
  ],
})
export class StoreFinderModule {}
