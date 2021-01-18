import { NgModule } from '@angular/core';
import {
  AddressBookModule,
  AnonymousConsentManagementBannerModule,
  AnonymousConsentsDialogModule,
  AsmModule,
  BannerCarouselModule,
  BannerModule,
  BreadcrumbModule,
  CartComponentModule,
  CartPageEventModule,
  CategoryNavigationModule,
  CheckoutComponentModule,
  CloseAccountModule,
  CmsParagraphModule,
  ConsentManagementModule,
  FooterNavigationModule,
  ForgotPasswordModule,
  HamburgerMenuModule,
  LinkModule,
  MyCouponsModule,
  MyInterestsModule,
  NavigationModule,
  NotificationPreferenceModule,
  OrderCancellationModule,
  OrderConfirmationModule,
  OrderDetailsModule,
  OrderHistoryModule,
  OrderReturnModule,
  PageEventModule,
  PaymentMethodsModule,
  ProductCarouselModule,
  ProductDetailsPageModule,
  ProductFacetNavigationModule,
  ProductImagesModule,
  ProductIntroModule,
  ProductListingPageModule,
  ProductListModule,
  ProductPageEventModule,
  ProductReferencesModule,
  ProductSummaryModule,
  ProductTabsModule,
  ProductVariantsModule,
  QualtricsModule,
  ReplenishmentOrderConfirmationModule,
  ReplenishmentOrderDetailsModule,
  ReplenishmentOrderHistoryModule,
  ResetPasswordModule,
  ReturnRequestDetailModule,
  ReturnRequestListModule,
  SearchBoxModule,
  SiteContextSelectorModule,
  StockNotificationModule,
  TabParagraphContainerModule,
  UpdateEmailModule,
  UpdatePasswordModule,
  UpdateProfileModule,
  UserComponentModule,
  WishListModule,
} from '@spartacus/storefront';
import {
  AnonymousConsentsModule,
  AsmOccModule,
  AuthModule,
  CartModule,
  CartOccModule,
  CheckoutModule,
  CheckoutOccModule,
  CostCenterOccModule,
  ExternalRoutesModule,
  PersonalizationModule,
  ProductModule,
  ProductOccModule,
  SmartEditModule,
  UserModule,
  UserOccModule,
} from '@spartacus/core';
import { StorefinderModule } from './features/storefinder.module';
import { AdministrationModule } from './features/administration.module';
import { OrderApprovalModule } from './features/order-approval.module';

@NgModule({
  imports: [
    // Auth Core
    AuthModule.forRoot(),

    // Basic Cms Components
    HamburgerMenuModule,
    SiteContextSelectorModule,
    LinkModule,
    BannerModule,
    CmsParagraphModule,
    TabParagraphContainerModule,
    BannerCarouselModule,
    CategoryNavigationModule,
    NavigationModule,
    FooterNavigationModule,
    BreadcrumbModule,

    // User Core
    UserModule.forRoot(),
    UserOccModule,
    // User UI
    UserComponentModule,
    AddressBookModule,
    UpdateEmailModule,
    UpdatePasswordModule,
    UpdateProfileModule,
    CloseAccountModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    PaymentMethodsModule,
    NotificationPreferenceModule,
    MyInterestsModule,
    StockNotificationModule,
    ConsentManagementModule,
    MyCouponsModule,

    // Anonymous Consents Core
    AnonymousConsentsModule.forRoot(),
    // Anonymous Consents UI
    AnonymousConsentsDialogModule,
    AnonymousConsentManagementBannerModule,

    // Product Core
    ProductModule.forRoot(),
    ProductOccModule,

    // Product UI
    ProductDetailsPageModule,
    ProductListingPageModule,
    ProductListModule,
    SearchBoxModule,
    ProductFacetNavigationModule,
    ProductTabsModule,
    ProductCarouselModule,
    ProductReferencesModule,
    ProductImagesModule,
    ProductSummaryModule,
    ProductVariantsModule,
    ProductIntroModule,

    // Cart Core
    CartModule.forRoot(),
    CartOccModule,
    // Cart UI
    CartComponentModule,
    WishListModule,

    // Checkout Core
    CheckoutModule.forRoot(),
    CheckoutOccModule,
    CostCenterOccModule,
    // Checkout UI
    CheckoutComponentModule,
    OrderConfirmationModule,

    // Order
    OrderHistoryModule,
    OrderDetailsModule,
    OrderCancellationModule,
    OrderReturnModule,
    ReturnRequestListModule,
    ReturnRequestDetailModule,
    ReplenishmentOrderHistoryModule,
    ReplenishmentOrderDetailsModule,
    ReplenishmentOrderConfirmationModule,

    // SmartEdit
    SmartEditModule.forRoot(),
    // Personalization
    PersonalizationModule.forRoot(),

    // Qualtrics Core
    // Qualtrics UI
    QualtricsModule,

    // Asm Core
    AsmOccModule,
    // Asm UI
    AsmModule,

    // Page Events
    CartPageEventModule,
    PageEventModule,
    ProductPageEventModule,

    /************************* Opt-in features *************************/

    ExternalRoutesModule.forRoot(), // to opt-in explicitly, is added by default schematics

    /************************* External features *************************/

    StorefinderModule,
    AdministrationModule,
    OrderApprovalModule,
  ],
})
export class SpartacusFeaturesModule {}
