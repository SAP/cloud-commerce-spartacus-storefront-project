export const exportEntries = {
  exportToCsv: 'Export to CSV',
  columnNames: {
    code: 'Code',
    quantity: 'Quantity',
    name: 'Name',
    price: 'Price',
  },
};

export const importEntries = {
  importProducts: 'Import Products',
};

export const importEntriesDialog = {
  importProducts: 'Import Products',
  importProductsSubtitle:
    'Add products by importing a .CSV file and creating a new saved cart.',
  importProductFileDetails:
    'Text file should contain list of products with required columns separated by comma: SKU and quantity.',
  selectFile: 'Select File',
  savedCartName: 'Saved Cart Name',
  savedCartDescription: 'Saved Cart Description',
  optional: 'optional',
  charactersLeft: 'characters left: {{count}}',
  cancel: 'Cancel',
  upload: 'Upload',
  close: 'Close',
  summary: {
    info:
      'Do not close or refresh this window while products are being imported.',
    loaded: 'Products has been loaded to new cart "{{ cartName }}".',
    loading: 'Products are being processed... ({{ count }}/{{ total }})',
    successes:
      '{{ successesCount }} out of {{ total }} products have been imported successfully.',
    warning: '{{ count }} product was not imported totally.',
    warning_plural: '{{ count }} products were not imported totally.',
    error: '{{ count }} product was not imported.',
    error_plural: '{{ count }} products were not imported.',
    messages: {
      unknownIdentifier: 'Product SKU "{{ productCode}}" does not exist.',
      lowStock:
        'Quantity for {{ productName }}: {{ quantity }} has been reduced to {{ quantityAdded }}.',
      unknownError: 'Unrecognized problem with "{{ productCode}}".',
    },
  },
};

export const importExport = {
  exportEntries,
  importEntries,
  importEntriesDialog,
};
