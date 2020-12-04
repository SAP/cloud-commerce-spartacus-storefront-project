/**
 *
 * An interface representing the models used for the communication with the CPQ configurator
 */
export namespace Cpq {
  /**
   * Response of create configuration requests
   */
  export interface ConfigurationCreatedResponseData {
    /**
     * CPQ configuration ID of the newly created configuration
     */
    configurationId: string;
  }

  /**
   * An interface representing the CPQ configuration.
   */
  export interface Configuration {
    productSystemId: string;
    productName?: string;
    completed?: boolean;
    incompleteMessages?: string[];
    incompleteAttributes?: string[];
    invalidMessages?: string[];
    failedValidations?: string[];
    errorMessages?: string[];
    conflictMessages?: string[];
    numberOfConflicts?: number;
    tabs?: Tab[];
    attributes?: Attribute[];
  }

  /**
   *
   * An interface representing the CPQ configuration tab.
   */
  export interface Tab {
    id: number;
    name?: string;
    displayName?: string;
    isIncomplete?: boolean;
    isSelected?: boolean;
  }

  /**
   *
   * An interface representing the CPQ configuration attribute.
   */
  export interface Attribute {
    pA_ID: number;
    stdAttrCode: number;
    name?: string;
    description?: string;
    label?: string;
    displayAs: number;
    required?: boolean;
    incomplete?: boolean;
    isEnabled?: boolean;
    isLineItem?: boolean;
    hasConflict?: boolean;
    userInput?: string;
    quantity?: number;
    values?: Value[];
  }

  /**
   *
   * An interface representing the CPQ configuration attribute value.
   */
  export interface Value {
    paV_ID: number;
    valueCode?: string;
    valueDisplay?: string;
    description?: string;
    productSystemId?: string;
    selected?: boolean;
    price?: string;
    quantity?: string;
  }

  /**
   *
   * An interface representing the structure for update of CPQ configuration attribute.
   */
  export interface UpdateAttribute {
    configurationId: string;
    standardAttributeCode: string;
    changeAttributeValue: ChangeAttributeValue;
  }

  /**
   *
   * An interface representing the update request body structure for update of CPQ configuration attribute.
   */
  export interface ChangeAttributeValue {
    attributeValueIds?: string;
    userInput?: string;
    quantity?: string;
  }

  /**
   *
   * An enum representing possible displayAs value.
   */
  export enum DisplayAs {
    RADIO_BUTTON = 1,
    CHECK_BOX = 2,
    DROPDOWN = 3,
    LIST_BOX = 4,
    LIST_BOX_MULTI = 5,
    READ_ONLY = 71,
    INPUT = 95,
    AUTO_COMPLETE_CUSTOM = 102,
  }
}
