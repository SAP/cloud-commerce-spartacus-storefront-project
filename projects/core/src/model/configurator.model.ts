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
    selectedSingleValue?: string;
    userInput?: string;
    isLineItem?: boolean;
    maxlength?: number;
  }

  export interface Value {
    valueCode?: string;
    valueDisplay?: string;
    description?: string;
    selected?: boolean;
    quantity?: number;
    price?: number;
    productSystemId?: string;
    isCommerceProduct?: boolean;
  }

  export interface Group {
    attributes?: Attribute[];
    id?: string;
    name?: string;
    description?: string;
    groupType?: GroupType;
    configurable?: boolean;
  }

  export interface Configuration {
    configId: string;
    consistent?: boolean;
    complete?: boolean;
    productCode?: string;
    groups?: Group[];
  }

  export enum GroupType {
    CSTIC_GROUP = 'CSTIC_GROUP',
  }

  export enum UiType {
    NOT_IMPLEMENTED = 'not_implemented',
    RADIOBUTTON = 'radioGroup',
    CHECKBOX = 'checkBoxList',
    DROPDOWN = 'dropdown',
    LISTBOX = 'listbox',
    LISTBOX_MULTI = 'listboxmulti',
    READ_ONLY = 'readonly',
    STRING = 'string',
    AUTO_COMPLETE_CUSTOM = 'input_autocomplete',
  }
}
