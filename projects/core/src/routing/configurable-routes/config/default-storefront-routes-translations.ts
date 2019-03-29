import { StorefrontRoutesTranslations } from './storefront-routes-translations';

export const defaultStorefrontRoutesTranslations: {
  default?: StorefrontRoutesTranslations;
  [languageCode: string]: StorefrontRoutesTranslations;
} = {
  default: {
    home: { paths: [''] },
    cart: { paths: ['cart'] },
    search: { paths: ['search/:query'] },
    login: { paths: ['login'] },
    register: { paths: ['register'] },
    resetPassword: { paths: ['login/pw/change'] },
    forgotPassword: { paths: ['forgot-password'] },
    checkout: { paths: ['checkout'] },
    orderConfirmation: { paths: ['order-confirmation'] },
    product: {
      paths: ['product/:productCode'],
      paramsMapping: { productCode: 'code' }
    },
    category: {
      paths: ['category/:categoryCode'],
      paramsMapping: { categoryCode: 'code' }
    },
    brand: { paths: ['Brands/:brandName/c/:brandCode'] },
    termsAndConditions: { paths: ['termsAndConditions'] },
    orders: { paths: ['my-account/orders'] },
    orderDetails: {
      paths: ['my-account/orders/:orderCode'],
      paramsMapping: { orderCode: 'code' }
    },
    addressBook: { paths: ['my-account/address-book'] },
    paymentManagement: { paths: ['my-account/payment-details'] },
    pageNotFound: { paths: ['notFound'] }
  },

  en: {} as any
};
