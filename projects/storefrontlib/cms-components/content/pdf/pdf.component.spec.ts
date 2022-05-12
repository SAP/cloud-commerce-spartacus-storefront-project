import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CmsBannerComponentMedia,
  CmsPDFDocumentComponent,
} from '@spartacus/core';
import { CmsComponentData, Media, MediaService } from '@spartacus/storefront';
import { BehaviorSubject, Observable } from 'rxjs';
import { PDFComponent } from './pdf.component';

@Pipe({
  name: 'cxTranslate',
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): any {
    if (value === 'pdf.defaultTitle') return 'Document';
    else return '';
  }
}

class MockMediaService {
  getMedia(media: any): Media {
    return {
      src: media ? media.url : undefined,
      srcset: undefined,
      alt: undefined,
    };
  }
}

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: any;
}

const mockCmsBannerComponentMedia: CmsBannerComponentMedia = {
  altText: 'test alt text',
  code: 'test code',
  mime: 'test mime',
  url: 'test url',
};

const mockComponentData: CmsPDFDocumentComponent = {
  pdfFile: mockCmsBannerComponentMedia,
  title: 'test title',
  height: 256,
};

const data$: BehaviorSubject<CmsPDFDocumentComponent> = new BehaviorSubject(
  mockComponentData
);

class MockCmsPDFDocumentComponentData {
  get data$(): Observable<CmsPDFDocumentComponent> {
    return data$.asObservable();
  }
}

describe('PdfComponent', () => {
  let pdfComponent: PDFComponent;
  let fixture: ComponentFixture<PDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PDFComponent, MockTranslatePipe, MockCxIconComponent],
      providers: [
        {
          provide: CmsComponentData,
          useClass: MockCmsPDFDocumentComponentData,
        },
        { provide: MediaService, useClass: MockMediaService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFComponent);
    pdfComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(pdfComponent).toBeTruthy();
  });

  describe('Title text', () => {
    it('should display title with .pdf', () => {
      data$.next({
        ...mockComponentData,
      });

      const textElement = fixture.nativeElement.querySelector('a > span');
      fixture.detectChanges();
      expect(textElement.textContent).toContain('test title.pdf');
    });
    it('should display altText with .pdf when title is not defined', () => {
      data$.next({ ...mockComponentData, title: undefined });

      const textElement = fixture.nativeElement.querySelector('a > span');
      fixture.detectChanges();
      expect(textElement.textContent).toContain('test alt text.pdf');
    });
    it('should display defaultTitle with .pdf when title and altText are not defined', () => {
      data$.next({
        ...mockComponentData,
        title: undefined,
        pdfFile: { ...mockComponentData.pdfFile, altText: undefined },
      });

      const textElement = fixture.nativeElement.querySelector('a > span');
      fixture.detectChanges();
      expect(textElement.textContent).toContain('Document.pdf');
    });
    it('should display title when title ends with pdf extension', () => {
      data$.next({
        ...mockComponentData,
        title: ' test title.pdf ',
      });

      const textElement = fixture.nativeElement.querySelector('a > span');
      fixture.detectChanges();
      expect(textElement.textContent).toContain('test title.pdf');
    });
  });
});
