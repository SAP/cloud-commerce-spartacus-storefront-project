import { Injectable } from '@angular/core';
import { ImportExportConfig } from '../config/import-export-config';

@Injectable({
  providedIn: 'root',
})
export class ExportCsvService {
  constructor(protected importExportConfig: ImportExportConfig) {}

  private get separator() {
    return this.importExportConfig.cartImportExport?.file.separator ?? ',';
  }

  /**
   * Converts array of objects into CSV data structure.
   *
   * @param objectsArray Array of objects which should be converted to CSV.
   * @returns Processed string ready to be saved into file
   */
  dataToCsv(objectsArray: string[][]): string {
    const array =
      typeof objectsArray != 'object' ? JSON.parse(objectsArray) : objectsArray;
    return array.reduce((csvString: string, row: string[]) => {
      const line = row.reduce((currentLine, column) => {
        currentLine += currentLine !== '' ? this.separator : '';
        const cell = column.includes(this.separator) ? `"${column}"` : column;
        return `${currentLine}${cell}`;
      }, '');
      return `${csvString}${line}\r\n`;
    }, '');
  }

  downloadCsv(csvData: string, filename = 'data', extension = 'csv') {
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let link = document.createElement('a');
    let url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.${extension}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
