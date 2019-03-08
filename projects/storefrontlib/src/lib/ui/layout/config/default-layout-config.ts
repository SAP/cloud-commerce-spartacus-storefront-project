import { LayoutConfig } from './layout-config';

export const defaultLayoutConfig: LayoutConfig = {
  breakpoints: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200
  },
  layoutSlots: {
    footer: {
      slots: ['Footer']
    },
    LandingPage2Template: {
      slots: [
        'Section1',
        'Section2A',
        'Section2B',
        'Section2C',
        'Section3',
        'Section4',
        'Section5'
      ]
    },
    ContentPage1Template: {
      slots: ['Section2A', 'Section2B']
    },
    CategoryPageTemplate: {
      slots: ['Section1', 'Section2', 'Section3']
    },
    ProductListPageTemplate: {
      slots: ['ProductListSlot', 'ProductLeftRefinements']
    },
    SearchResultsListPageTemplate: {
      slots: [
        'Section2',
        'SearchResultsListSlot',
        'ProductLeftRefinements',
        'Section4'
      ]
    },
    ProductDetailsPageTemplate: {
      slots: [
        'TopHeaderSlot',
        'VariantSelectorSlot',
        'AddToCart',
        'UpSelling',
        'CrossSelling',
        'Tabs',
        'PlaceholderContentSlot'
      ]
    },
    CartPageTemplate: {
      slots: ['TopContent', 'CenterRightContentSlot', 'EmptyCartMiddleContent']
    },
    AccountPageTemplate: {
      slots: ['BodyContent', 'SideContent']
    },
    LoginPageTemplate: {
      slots: ['LeftContentSlot', 'RightContentSlot']
    },
    ErrorPageTemplate: {
      slots: ['TopContent', 'MiddleContent', 'BottomContent']
    },
    OrderConfirmationPageTemplate: {
      slots: ['BodyContent', 'SideContent']
    },
    MultiStepCheckoutSummaryPageTemplate: {
      slots: ['BodyContent', 'SideContent']
    }
  }
};
