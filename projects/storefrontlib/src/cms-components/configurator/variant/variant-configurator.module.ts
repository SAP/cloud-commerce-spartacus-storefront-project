import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  CmsConfig,
  ConfigModule,
  I18nModule,
  ProductModule,
  UrlModule,
  UserService,
} from '@spartacus/core';
import { IconModule } from '../../../cms-components/misc/icon/icon.module';
import { CmsPageGuard } from '../../../cms-structure/guards/cms-page.guard';
import { PageLayoutComponent } from '../../../cms-structure/page/page-layout/page-layout.component';
import { HamburgerMenuModule } from '../../../layout/header/hamburger-menu/hamburger-menu.module';
import { ConfigAddToCartButtonComponent } from '../commons/config-add-to-cart-button/config-add-to-cart-button.component';
import { ConfigAttributeFooterComponent } from '../commons/config-attribute-footer/config-attribute-footer.component';
import { ConfigAttributeHeaderComponent } from '../commons/config-attribute-header/config-attribute-header.component';
import { ConfigAttributeCheckBoxListComponent } from '../commons/config-attribute-types/config-attribute-checkbox-list/config-attribute-checkbox-list.component';
import { ConfigAttributeDropDownComponent } from '../commons/config-attribute-types/config-attribute-drop-down/config-attribute-drop-down.component';
import { ConfigAttributeInputFieldComponent } from '../commons/config-attribute-types/config-attribute-input-field/config-attribute-input-field.component';
import { ConfigAttributeMultiSelectImageComponent } from '../commons/config-attribute-types/config-attribute-multi-select-image/config-attribute-multi-select-image.component';
import { ConfigAttributeRadioButtonComponent } from '../commons/config-attribute-types/config-attribute-radio-button/config-attribute-radio-button.component';
import { ConfigAttributeReadOnlyComponent } from '../commons/config-attribute-types/config-attribute-read-only/config-attribute-read-only.component';
import { ConfigFormComponent } from '../commons/config-form/config-form.component';
import { ConfigGroupMenuComponent } from '../commons/config-group-menu/config-group-menu.component';
import { ConfigGroupTitleComponent } from '../commons/config-group-title/config-group-title.component';
import { ConfigPreviousNextButtonsComponent } from '../commons/config-previous-next-buttons/config-previous-next-buttons.component';
import { ConfigPriceSummaryComponent } from '../commons/config-price-summary/config-price-summary.component';
import { ConfigTabBarComponent } from '../commons/config-tab-bar/config-tab-bar.component';
import { GenericConfiguratorModule } from '../generic/generic-configurator.module';

@NgModule({
  imports: [
    CommonModule,
    GenericConfiguratorModule,
    ProductModule,
    RouterModule.forChild([
      {
        path: 'configureCPQCONFIGURATOR/:ownerType',
        children: [
          {
            path: 'entityKey/:entityKey',
            component: PageLayoutComponent,
            data: { pageLabel: '/configureCPQCONFIGURATOR' },
          },
        ],
        canActivate: [CmsPageGuard],
      },
    ]),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        VariantConfigurationTabBar: {
          component: ConfigTabBarComponent,
          guards: [],
        },
        VariantConfigurationGroupTitle: {
          component: ConfigGroupTitleComponent,
          guards: [],
        },
        VariantConfigurationForm: {
          component: ConfigFormComponent,
          guards: [],
        },
        VariantConfigurationMenu: {
          component: ConfigGroupMenuComponent,
          guards: [],
        },
        VariantConfigurationPriceSummary: {
          component: ConfigPriceSummaryComponent,
          guards: [],
        },
        VariantConfigurationPrevNext: {
          component: ConfigPreviousNextButtonsComponent,
          guards: [],
        },
        VariantConfigurationAddToCartButton: {
          component: ConfigAddToCartButtonComponent,
          guards: [],
        },
      },
      layoutSlots: {
        VariantConfigurationTemplate: {
          header: {
            md: {
              slots: [
                'PreHeader',
                'SiteContext',
                'SiteLinks',
                'SiteLogo',
                'SearchBox',
                'SiteLogin',
                'MiniCart',
              ],
            },
            xs: {
              slots: ['PreHeader', 'SiteLogo', 'SearchBox', 'MiniCart'],
            },
          },

          navigation: {
            xs: {
              slots: [
                'SiteLogin',
                'VariantConfigMenu',
                'SiteContext',
                'SiteLinks',
              ],
            },
          },

          md: {
            slots: [
              'VariantConfigHeader',
              'VariantConfigMenu',
              'VariantConfigContent',
              'VariantConfigBottombar',
            ],
          },
          xs: {
            slots: [
              'VariantConfigHeader',
              'VariantConfigContent',
              'VariantConfigBottombar',
            ],
          },
        },
      },
    }),

    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    UrlModule,
    HamburgerMenuModule,
    I18nModule,
    IconModule,
  ],

  declarations: [
    ConfigFormComponent,
    ConfigAttributeRadioButtonComponent,
    ConfigAttributeDropDownComponent,
    ConfigAttributeCheckBoxListComponent,
    ConfigAttributeMultiSelectImageComponent,
    ConfigAttributeInputFieldComponent,
    ConfigAttributeReadOnlyComponent,
    ConfigAttributeHeaderComponent,
    ConfigAttributeFooterComponent,
    ConfigPreviousNextButtonsComponent,
    ConfigGroupMenuComponent,
    ConfigGroupTitleComponent,
    ConfigAddToCartButtonComponent,
    ConfigPriceSummaryComponent,
    ConfigTabBarComponent,
  ],
  exports: [
    ConfigFormComponent,
    ConfigAttributeRadioButtonComponent,
    ConfigAttributeDropDownComponent,
    ConfigAttributeCheckBoxListComponent,
    ConfigAttributeMultiSelectImageComponent,
    ConfigAttributeInputFieldComponent,
    ConfigAttributeReadOnlyComponent,
    ConfigAttributeHeaderComponent,
    ConfigAttributeFooterComponent,
    ConfigPreviousNextButtonsComponent,
    ConfigGroupMenuComponent,
    ConfigGroupTitleComponent,
    ConfigAddToCartButtonComponent,
    ConfigPriceSummaryComponent,
    ConfigTabBarComponent,
  ],
  providers: [UserService],
  entryComponents: [
    ConfigFormComponent,
    ConfigAttributeRadioButtonComponent,
    ConfigAttributeDropDownComponent,
    ConfigAttributeCheckBoxListComponent,
    ConfigAttributeMultiSelectImageComponent,
    ConfigAttributeInputFieldComponent,
    ConfigAttributeReadOnlyComponent,
    ConfigAttributeHeaderComponent,
    ConfigAttributeFooterComponent,
    ConfigPreviousNextButtonsComponent,
    ConfigGroupMenuComponent,
    ConfigGroupTitleComponent,
    ConfigAddToCartButtonComponent,
    ConfigPriceSummaryComponent,
    ConfigTabBarComponent,
  ],
})
export class VariantConfiguratorModule {}
