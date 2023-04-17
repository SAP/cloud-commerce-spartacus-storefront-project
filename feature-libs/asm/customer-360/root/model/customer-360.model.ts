/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Address, Country, Region, UrlCommand, User } from '@spartacus/core';

export interface Customer360Review {
  productName: string;
  productCode: string;
  createdAt: string;
  updatedAt: string;
  rating: string;
  reviewStatus: string;
  reviewText: string;
}

export interface Customer360ActivityStatus {
  code: string;
  name: string;
}

export interface Customer360ActivityType {
  code: string;
  name: string;
}

export interface Customer360Activity {
  type: Customer360ActivityType;
  associatedTypeId: string;
  description: string;
  status?: Customer360ActivityStatus;
  createdAt: string;
  updatedAt: string;
}
export interface C360TicketStatus {
  code: string;
  name: string;
}

export interface C360TicketCategory {
  code: string;
  name: string;
}

export interface Customer360SupportTicket {
  id: string;
  subject: string;
  category: C360TicketCategory;
  createdAt: string;
  updatedAt: string;
  status: C360TicketStatus;
}

export enum Customer360Type {
  REVIEW_LIST = 'c360ReviewList',
  STORE_LOCATION = 'c360StoreLocation',
  PRODUCT_INTEREST_LIST = 'c360CustomerProductInterestList',
  SUPPORT_TICKET_LIST = 'c360TicketList',
  CUSTOMER_PROFILE = 'c360CustomerProfile',
  ACTIVE_CART = 'c360Cart',
  SAVED_CART = 'c360SavedCart',
  OVERVIEW = 'c360Overview',
  ACTIVITY_LIST = 'c360ActivityList',
}

export interface Customer360SupportTicketList {
  type: Customer360Type.SUPPORT_TICKET_LIST;
  tickets: Array<Customer360SupportTicket>;
}

export interface Customer360ReviewList {
  type: Customer360Type.REVIEW_LIST;
  reviews: Array<Customer360Review>;
}

export interface Customer360StoreLocation {
  type: Customer360Type.STORE_LOCATION;
  address: string;
}

export interface Customer360Address {
  id?: string;
  line1?: string;
  line2?: string;
  town?: string;
  region?: Region;
  country?: Country;
}
export interface Customer360PaymentDetail {
  id?: string;
  cardTypeName?: string; // TODO this might change to return code
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  defaultPayment?: boolean;
}

export interface Customer360Profile {
  billingAddress?: Customer360Address;
  deliveryAddress?: Customer360Address;
  phone1?: string;
  phone2?: string; // TODO this might change to cellphone or return value will be cellphone
  paymentDetails?: Customer360PaymentDetail[];
}

export interface Customer360CustomerProfile {
  type: Customer360Type.CUSTOMER_PROFILE;
  profile?: Customer360Profile;
}

export interface Customer360ProductInterestList {
  type: Customer360Type.PRODUCT_INTEREST_LIST;
  customerProductInterests: Array<{
    product: {
      code: string;
    };
  }>;
}

export interface Customer360CartEntry {
  quantity: number;
  basePrice: string;
  totalPrice: string;
  productCode: string;
}
export interface Customer360ActiveCart {
  type: Customer360Type.ACTIVE_CART;
  code: string;
  totalPrice?: string;
  totalItemCount?: number;
  entries?: Array<Customer360CartEntry>;
}

export interface Customer360SavedCart {
  type: Customer360Type.SAVED_CART;
  code: string;
  totalPrice?: string;
  totalItemCount?: number;
  entries?: Array<Customer360CartEntry>;
}

export interface Customer360Avatar {
  url?: string;
  format?: string;
}

export interface Customer360Overview {
  type: Customer360Type.OVERVIEW;
  name?: string;
  cartSize?: number;
  cartCode?: string;
  lastOrderTotal?: string;
  lastOrderCode?: string;
  lastOrderedAt?: string;
  lastOpenedTicketId?: string;
  lastTicketCreatedAt?: string;
  email?: string;
  registeredAt?: string;
  defaultShippingAddress?: Address;
  userAvatar?: Customer360Avatar;
}

export interface Customer360ActivityList {
  type: Customer360Type.ACTIVITY_LIST;
  activities: Array<Customer360Activity>;
}

export interface Customer360Params {
  userId: string;
}

export interface AdditionalRequestParameters {
  timeout?: number;
}

export interface Customer360Query {
  type?: Customer360Type | string;
  additionalRequestParameters?: AdditionalRequestParameters;
}

export interface Customer360Request {
  queries: Array<Customer360Query>;
  options: Customer360Params;
}

export type Customer360Data =
  | Customer360ActiveCart
  | Customer360ProductInterestList
  | Customer360ReviewList
  | Customer360StoreLocation
  | Customer360SupportTicketList
  | Customer360CustomerProfile
  | Customer360SavedCart
  | Customer360Overview
  | Customer360ActivityList;

export interface Customer360Response {
  value: Array<Customer360Data>;
}

export enum AsmDialogActionType {
  NAVIGATE = 'NAVIGATE',
}

export interface AsmDialogActionEvent {
  selectedUser: User;
  actionType: AsmDialogActionType;
  route?: UrlCommand;
}

import '@spartacus/storefront';

declare module '@spartacus/storefront' {
  const enum LAUNCH_CALLER {
    ASM_CUSTOMER_360 = 'ASM_CUSTOMER_360',
  }
}
