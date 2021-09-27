import { TestBed } from '@angular/core/testing';
import { FileOptions } from '../../models/file';
import { ExportCsvFileService } from './export-csv-file.service';
import { FileDownloadService } from './file-download.service';

const separator = ',';
const fileOptions: FileOptions = {
  fileName: 'data',
  extension: 'csv',
  type: 'text/csv;charset=utf-8;',
};

const mockEntries = [
  ['Sku', 'Quantity', 'Name', 'Price'],
  ['4567133', '1', 'PSM 80 A', '$12.00'],
  ['3881027', '1', 'Screwdriver BT-SD 3,6/1 Li', '$26.00'],
  ['3794609', '1', '2.4V Şarjli Tornavida, Tüp Ambalaj', '$30,200.00'],
];

const mockCsvString =
  'Sku,Quantity,Name,Price\r\n4567133,1,PSM 80 A,$12.00\r\n3881027,1,"Screwdriver BT-SD 3,6/1 Li",$26.00\r\n3794609,1,"2.4V Şarjli Tornavida, Tüp Ambalaj","$30,200.00"\r\n';

class MockFileDownloadService {
  download(_fileContent: string, _fileOptions: FileOptions) {}
}

describe('ExportCsvFileService', () => {
  let service: ExportCsvFileService;
  let fileDownloadService: FileDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FileDownloadService, useClass: MockFileDownloadService },
      ],
    });
    service = TestBed.inject(ExportCsvFileService);
    fileDownloadService = TestBed.inject(FileDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert array to csv string', () => {
    expect(service.convert(mockEntries, separator)).toBe(mockCsvString);
  });

  it('should convert data and download', () => {
    spyOn(service, 'convert').and.callThrough();
    spyOn(service, 'download').and.callThrough();
    spyOn(fileDownloadService, 'download').and.callThrough();
    service.download(mockEntries, separator, fileOptions);
    expect(service.convert).toHaveBeenCalledWith(mockEntries, separator);
    expect(fileDownloadService.download).toHaveBeenCalledWith(
      service.convert(mockEntries, separator),
      fileOptions
    );
  });
});
