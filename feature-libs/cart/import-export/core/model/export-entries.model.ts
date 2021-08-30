import { Translatable } from '@spartacus/core';

export interface ExportColumn {
  /**
   * `Translatable` object used to translate column heading to the language currently set in a storefront.
   * If `key` value was provided it also requires to have a representation in trasnlation file.
   */
  name: Translatable;

  /**
   * Dot notation string which refers to specified `OrderEntry` attribute.
   */
  value: string;
}

export interface ExportConfig {
  /**
   * Specifies which columns besides code and quantity can be exported to CSV file.
   */
  additionalColumns?: ExportColumn[];

  /**
   * Flag used to determine if message informing about download starting proccess
   * should be visible to user.
   */
  messageEnabled?: boolean;

  /**
   * Specifies how long (in milliseconds) the message should be visible to user.
   */
  messageTimeout?: number;

  /**
   * Property dedicated to delay download start process.
   */
  downloadDelay?: number;

  /**
   * File name for exported file.
   */
  fileName?: string;
}
