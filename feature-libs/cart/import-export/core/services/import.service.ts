import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ImportExportConfig } from '../config/import-export-config';
// import { FileValidity, InvalidFileInfo } from '../model/import-to-cart.model';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  constructor(protected importExportConfig: ImportExportConfig) {}

  /**
   * Extracts CSV file and process into a JSON data
   *
   * @param file CSV file to extract the data
   * @returns processed data from CSV or error data in CSV extraction
   */
  loadFile(file: File): Observable<string[][]> {
    return new Observable((observer: Observer<string[][]>) => {
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        observer.next(this.readCsvData(fileReader.result as string));
        observer.complete();
      };
      fileReader.onerror = () => {
        fileReader.abort();
        observer.error({ notParsable: true });
      };
    });
  }

  /**
   * Checks validity of the file
   *
   * @param file CSV file to check
   * @param validityConfig optional object to pass any custom validity config
   * @returns validity boolean and invalid file information object if any
   */
  // protected checkValidity(
  //   file: File,
  //   validityConfig?: FileValidity
  // ): { isFileValid: Boolean; invalidFileInfo: InvalidFileInfo } {
  //   let isFileValid: Boolean = true;
  //   const invalidFileInfo: InvalidFileInfo = {};
  //   validityConfig = this.setValidityConfig(validityConfig);
  //   if (
  //     validityConfig?.maxSize &&
  //     file.size / 1000000 > validityConfig?.maxSize
  //   ) {
  //     isFileValid = false;
  //     invalidFileInfo.tooLarge = true;
  //   }
  //   if (!validityConfig?.allowedExtensions?.includes(file.type)) {
  //     isFileValid = false;
  //     invalidFileInfo.invalidExtension = true;
  //   }
  //   if (
  //     validityConfig?.checkEmptyFile &&
  //     file.size <= (validityConfig?.minSize ?? 0)
  //   ) {
  //     isFileValid = false;
  //     invalidFileInfo.empty = true;
  //   }
  //   return { isFileValid, invalidFileInfo };
  // }

  /**
   * Processes the CSV data
   *
   * @param csvString raw extracted data from CSV
   * @param ignoreHeader flag allows for ignore headers row while reading
   * @returns Processed data containing productCode and quantity
   */
  protected readCsvData(csvString: string, ignoreHeader = true): string[][] {
    return csvString
      .split('\n')
      .map((row) =>
        row.split(this.separator).map((cell) => cell.replace(/"/g, ''))
      )
      .filter(
        (value, index) => !(ignoreHeader && index === 0) || value[0] !== ''
      );
  }

  private get separator() {
    return this.importExportConfig.importExport?.file.separator ?? ',';
  }
}
