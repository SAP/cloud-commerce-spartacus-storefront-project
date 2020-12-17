import { CommonConfigurator } from '@spartacus/product/configurators/common';

export namespace Configurator {
  export interface Attribute {
    attrCode?: number;
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
    incomplete?: boolean;
    uiType?: UiType;
    dataType?: string;
    quantity?: number;
    values?: Value[];
    groupId?: string;
    selectedSingleValue?: string;
    userInput?: string;
    isLineItem?: boolean;
    maxlength?: number;
    images?: Image[];
    numDecimalPlaces?: number;
    numTotalLength?: number;
    negativeAllowed?: boolean;
    hasConflicts?: boolean;
    retractTriggered?: boolean;
  }

  export interface Value {
    valueCode?: string;
    name?: string;
    valueDisplay?: string;
    description?: string;
    selected?: boolean;
    quantity?: number;
    price?: number;
    productSystemId?: string;
    isCommerceProduct?: boolean;
    images?: Image[];
  }

  export interface Group {
    attributes?: Attribute[];
    id?: string;
    name?: string;
    description?: string;
    groupType?: GroupType;
    configurable?: boolean;
    complete?: boolean;
    consistent?: boolean;
    subGroups?: Group[];
  }

  export interface Configuration {
    configId: string;
    consistent?: boolean;
    complete?: boolean;
    totalNumberOfIssues?: number;
    productCode?: string;
    groups?: Group[];
    flatGroups?: Group[];
    priceSummary?: PriceSummary;
    overview?: Overview;
    owner?: CommonConfigurator.Owner;
    nextOwner?: CommonConfigurator.Owner;
    isCartEntryUpdateRequired?: boolean;
    interactionState?: InteractionState;
    updateType?: UpdateType;
  }

  export interface InteractionState {
    currentGroup?: string;
    menuParentGroup?: string;
    groupsVisited?: {
      [id: string]: boolean;
    };
    issueNavigationDone?: boolean;
  }

  export interface Overview {
    configId?: string;
    totalNumberOfIssues?: number;
    groups?: GroupOverview[];
    priceSummary?: PriceSummary;
    productCode?: string;
  }

  export interface GroupOverview {
    id: string;
    groupDescription?: string;
    attributes?: AttributeOverview[];
  }

  export interface AttributeOverview {
    attribute: string;
    value: string;
  }

  export interface PriceSummary {
    basePrice?: PriceDetails;
    currentTotal?: PriceDetails;
    currentTotalSavings?: PriceSavingDetails;
    selectedOptions?: PriceDetails;
  }

  export interface PriceDetails {
    currencyIso?: string;
    formattedValue?: string;
    value?: number;
  }

  export interface PriceSavingDetails extends PriceDetails {
    maxQuantity?: number;
    minQuantity?: number;
  }

  export interface AddToCartParameters {
    userId: string;
    cartId: string;
    productCode: string;
    quantity: number;
    configId: string;
    owner: CommonConfigurator.Owner;
  }

  export interface UpdateConfigurationForCartEntryParameters {
    userId?: string;
    cartId?: string;
    cartEntryNumber?: string;
    configuration?: Configurator.Configuration;
  }

  export interface Image {
    type?: ImageType;
    format?: ImageFormatType;
    url?: string;
    altText?: string;
    galleryIndex?: number;
  }

  export enum GroupType {
    ATTRIBUTE_GROUP = 'AttributeGroup',
    SUB_ITEM_GROUP = 'SubItemGroup',
    CONFLICT_HEADER_GROUP = 'ConflictHeaderGroup',
    CONFLICT_GROUP = 'ConflictGroup',
  }

  export enum UiType {
    NOT_IMPLEMENTED = 'not_implemented',
    RADIOBUTTON = 'radioGroup',
    RADIOBUTTON_PRODUCT = 'radioGroupProduct',
    CHECKBOX = 'checkBox',
    CHECKBOXLIST = 'checkBoxList',
    CHECKBOXLIST_PRODUCT = 'checkBoxListProduct',
    DROPDOWN = 'dropdown',
    DROPDOWN_PRODUCT = 'dropdownProduct',
    LISTBOX = 'listbox',
    LISTBOX_MULTI = 'listboxmulti',
    READ_ONLY = 'readonly',
    STRING = 'string',
    NUMERIC = 'numeric',
    AUTO_COMPLETE_CUSTOM = 'input_autocomplete',
    MULTI_SELECTION_IMAGE = 'multi_selection_image',
    MULTI_SELECTION_BUNDLE = 'multi_selection_bundle',
    SINGLE_SELECTION_IMAGE = 'single_selection_image',
    SINGLE_SELECTION_BUNDLE = 'single_selection_bundle',
  }

  export enum ImageFormatType {
    VALUE_IMAGE = 'VALUE_IMAGE',
    ATTRIBUTE_IMAGE = 'ATTRIBUTE_IMAGE',
  }

  export enum ImageType {
    PRIMARY = 'PRIMARY',
    GALLERY = 'GALLERY',
  }

  export enum UpdateType {
    ATTRIBUTE = 'Attribute',
    ATTRIBUTE_QUANTITY = 'AttributeQuantity',
    VALUE_QUANTITY = 'ValueQuantity',
  }
}
