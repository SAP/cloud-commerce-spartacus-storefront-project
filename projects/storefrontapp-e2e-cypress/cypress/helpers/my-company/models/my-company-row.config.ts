export interface MyCompanyRowConfig {
  /**
   * Label given to the table header.
   */
  label?: string;
  /**
   * Variable name given in api response
   */
  variableName?: string | string[];
  /**
   * Label given to sort by category
   */
  sortLabel?: string;
  /**
   * Url property should link to in details
   */
  link?: string;
  /**
   * Input type in form
   */
  inputType?: string;
  /**
   * Value provided to form in create process
   */
  createValue?: string;
  /**
   * Value provided to form in update process
   */
  updateValue?: string;
  /**
   * Whether to use date pipe to display in table
   */
  useDatePipe?: boolean;
  /**
   * Whether to show this property in table
   */
  showInTable?: boolean;
  /**
   * Whether to show this property in details
   */
  showInDetails?: boolean;
  /**
   * Whether to use the property value in url
   * eg. For ids
   */
  useInUrl?: boolean;
  /**
   * Label to identify property in form
   */
  formLabel?: string;
}
