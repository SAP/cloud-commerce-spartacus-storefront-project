import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import {
  SPARTACUS_CORE,
  SPARTACUS_FEATURES_MODULE,
  SPARTACUS_FEATURES_NG_MODULE,
  SPARTACUS_STOREFRONTLIB,
} from '../shared/feature-libs-constants';
import { addModuleImport } from '../shared/utils/new-module-utils';
import { createProgram, saveAndFormat } from '../shared/utils/program';
import { getProjectTsConfigPaths } from '../shared/utils/project-tsconfig-paths';

/** Migration which ensures the spartacus features are being correctly set up */
export function setupSpartacusFeaturesModule(project: string): Rule {
  return (tree: Tree): Tree => {
    const { buildPaths } = getProjectTsConfigPaths(tree, project);

    if (!buildPaths.length) {
      throw new SchematicsException(
        `Could not find any tsconfig file. Cannot configure ${SPARTACUS_FEATURES_NG_MODULE}.`
      );
    }

    const basePath = process.cwd();
    for (const tsconfigPath of buildPaths) {
      configureSpartacusModules(tree, tsconfigPath, basePath);
    }
    return tree;
  };
}

function configureSpartacusModules(
  tree: Tree,
  tsconfigPath: string,
  basePath: string
): void {
  const { appSourceFiles } = createProgram(tree, basePath, tsconfigPath);

  for (const sourceFile of appSourceFiles) {
    if (
      sourceFile
        .getFilePath()
        .includes(`${SPARTACUS_FEATURES_MODULE}.module.ts`)
    ) {
      [
        `// Auth Core
        AuthModule.forRoot(),`,
        'LogoutModule,',
        'LoginRouteModule,',
      ].forEach((content) => {
        addModuleImport(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_CORE,
              namedImports: ['AuthModule'],
            },
            {
              moduleSpecifier: SPARTACUS_STOREFRONTLIB,
              namedImports: ['LogoutModule', 'LoginRouteModule'],
            },
          ],
          content,
        });
      });

      [
        `// Basic Cms Components
        HamburgerMenuModule,`,
        'SiteContextSelectorModule,',
        'LinkModule,',
        'BannerModule,',
        'CmsParagraphModule,',
        'TabParagraphContainerModule,',
        'BannerCarouselModule,',
        'CategoryNavigationModule,',
        'NavigationModule,',
        'FooterNavigationModule,',
        'BreadcrumbModule,',
      ].forEach((content) => {
        addModuleImport(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_STOREFRONTLIB,
              namedImports: [
                'HamburgerMenuModule',
                'SiteContextSelectorModule',
                'LinkModule',
                'BannerModule',
                'CmsParagraphModule',
                'TabParagraphContainerModule',
                'BannerCarouselModule',
                'CategoryNavigationModule',
                'FooterNavigationModule',
                'NavigationModule',
                'BreadcrumbModule',
              ],
            },
          ],
          content,
        });
      });

      [
        `// User Core,
        UserModule,`,
        'UserOccModule,',
        `// User UI,
        AddressBookModule,`,
        'PaymentMethodsModule,',
        'NotificationPreferenceModule,',
        'MyInterestsModule,',
        'StockNotificationModule,',
        'ConsentManagementModule,',
        'MyCouponsModule,',
      ].forEach((content) => {
        addModuleImport(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_CORE,
              namedImports: ['UserModule', 'UserOccModule'],
            },
            {
              moduleSpecifier: SPARTACUS_STOREFRONTLIB,
              namedImports: [
                'AddressBookModule',
                'PaymentMethodsModule',
                'NotificationPreferenceModule',
                'MyInterestsModule',
                'StockNotificationModule',
                'ConsentManagementModule',
                'MyCouponsModule',
              ],
            },
          ],
          content,
        });
      });

      [
        `// Anonymous Consents Core,
        AnonymousConsentsModule.forRoot(),`,
        `// Anonymous Consents UI,
        AnonymousConsentsDialogModule,`,
        'AnonymousConsentManagementBannerModule,',
      ].forEach((content) => {
        addModuleImport(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_CORE,
              namedImports: ['AnonymousConsentsModule'],
            },
            {
              moduleSpecifier: SPARTACUS_STOREFRONTLIB,
              namedImports: [
                'AnonymousConsentManagementBannerModule',
                'AnonymousConsentsDialogModule',
              ],
            },
          ],
          content,
        });
      });

      [
        `// Product Core,
        ProductModule.forRoot(),`,
        'ProductOccModule,',
        `// Product UI,
        ProductDetailsPageModule,`,
        'ProductListingPageModule,',
        'ProductListModule,',
        'SearchBoxModule,',
        'ProductFacetNavigationModule,',
        'ProductTabsModule,',
        'ProductCarouselModule,',
        'ProductReferencesModule,',
        'ProductImagesModule,',
        'ProductSummaryModule,',
        'ProductIntroModule,',
      ].forEach((content) => {
        addModuleImport(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_CORE,
              namedImports: ['ProductModule', 'ProductOccModule'],
            },
            {
              moduleSpecifier: SPARTACUS_STOREFRONTLIB,
              namedImports: [
                'ProductCarouselModule',
                'ProductDetailsPageModule',
                'ProductFacetNavigationModule',
                'ProductImagesModule',
                'ProductIntroModule',
                'ProductListingPageModule',
                'ProductListModule',
                'ProductPageEventModule',
                'ProductReferencesModule',
                'ProductSummaryModule',
                'ProductTabsModule',
                'SearchBoxModule',
              ],
            },
          ],
          content,
        });
      });

      ['CostCenterOccModule,'].forEach((content) => {
        addModuleImport(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_CORE,
              namedImports: ['CostCenterOccModule'],
            },
          ],
          content,
        });
      });

      [
        `// Page Events,
        NavigationEventModule,`,
        'HomePageEventModule,',
        'ProductPageEventModule,',
      ].forEach((content) => {
        addModuleImport(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_STOREFRONTLIB,
              namedImports: [
                'NavigationEventModule',
                'HomePageEventModule',
                'ProductPageEventModule',
              ],
            },
          ],
          content,
        });
      });

      [
        // TODO:#schematics - don't add comments?
        `// External routes,
      ExternalRoutesModule.forRoot(),`,
      ].forEach((content) => {
        addModuleImport(sourceFile, {
          import: [
            {
              moduleSpecifier: SPARTACUS_CORE,
              namedImports: ['ExternalRoutesModule'],
            },
          ],
          content,
        });
      });

      saveAndFormat(sourceFile);

      break;
    }
  }
}
