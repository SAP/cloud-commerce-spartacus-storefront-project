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
  importProductFileText:
    'The text file should list the product SKUs and quantities, separated by a comma. File size should not exceed {{ size }} kb',
  selectFile: 'Select File',
  savedCartName: 'Saved Cart Name',
  savedCartDescription: 'Saved Cart Description',
  optional: 'optional',
  charactersLeft: 'characters left: {{count}}',
  cancel: 'Cancel',
  upload: 'Upload',
};

export const importExport = {
  exportEntries,
  importEntries,
  importEntriesDialog,
};
