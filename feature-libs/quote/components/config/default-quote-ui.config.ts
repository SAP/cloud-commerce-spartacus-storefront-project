/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ConfirmActionDialogMappingConfig,
  QuoteUIConfig,
} from './quote-ui.config';

/**
 * default confirm action dialog configuration
 */
const defaultConfirmActionDialogConfig = {
  showWarningNote: false,
  showExpirationDate: false,
  showSuccessMessage: true,
};

const defaultDialogMappings: ConfirmActionDialogMappingConfig = {
  BUYER_OFFER: {
    EDIT: {
      i18nKey: 'quote.actions.confirmDialog.buyer_offer.edit',
      showWarningNote: true,
      showExpirationDate: true,
      showSuccessMessage: false,
    },
    CANCEL: {
      i18nKey: 'quote.actions.confirmDialog.buyer_offer.cancel',
      ...defaultConfirmActionDialogConfig,
    },
    CHECKOUT: {
      i18nKey: 'quote.actions.confirmDialog.buyer_offer.checkout',
      ...defaultConfirmActionDialogConfig,
      showSuccessMessage: false,
    },
  },
  EXPIRED: {
    EDIT: {
      i18nKey: 'quote.actions.confirmDialog.expired.edit',
      showWarningNote: true,
      showExpirationDate: false,
      showSuccessMessage: false,
    },
    REQUOTE: {
      i18nKey: 'quote.actions.confirmDialog.expired.requote',
      showWarningNote: true,
      showExpirationDate: false,
      showSuccessMessage: false,
    },
  },
  BUYER: {
    SUBMIT: {
      i18nKey: 'quote.actions.confirmDialog.buyer.submit',
      ...defaultConfirmActionDialogConfig,
    },
    CANCEL: {
      i18nKey: 'quote.actions.confirmDialog.buyer.cancel',
      ...defaultConfirmActionDialogConfig,
    },
  },
  SELLER: {
    SUBMIT: {
      i18nKey: 'quote.actions.confirmDialog.seller.submit',
      ...defaultConfirmActionDialogConfig,
      showWarningNote: true,
    },
  },
  SELLERAPPROVER: {
    SUBMIT: {
      i18nKey: 'quote.actions.confirmDialog.sellerapprover.submit',
      ...defaultConfirmActionDialogConfig,
    },
    REJECT: {
      i18nKey: 'quote.actions.confirmDialog.sellerapprover.reject',
      ...defaultConfirmActionDialogConfig,
    },
  },
  ALL:{
    EDIT:{
      i18nKey: 'quote.actions.confirmDialog.all.edit',
      ...defaultConfirmActionDialogConfig,
      showWarningNote: true,
      showExpirationDate: false,
      showSuccessMessage: false,
    },
  },
};

export const defaultQuoteUIConfig: QuoteUIConfig = {
  quote: {
    maxCharsForComments: 1000,
    truncateCardTileContentAfterNumChars: 100,
    updateDebounceTime: {
      expiryDate: 500,
    },
    confirmActionDialogMapping: defaultDialogMappings,
  },
};
