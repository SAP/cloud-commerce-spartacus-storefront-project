import { TestBed } from '@angular/core/testing';
import { UrlTranslatorService } from './url-translator.service';
import { TranslateUrlPipe } from './translate-url.pipe';

describe('TranslateUrlPipe', () => {
  let pipe: TranslateUrlPipe;
  let service: UrlTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslateUrlPipe,
        { provide: UrlTranslatorService, useValue: { translate: () => {} } }
      ]
    });
    pipe = TestBed.get(TranslateUrlPipe);
    service = TestBed.get(UrlTranslatorService);
  });

  describe('transform', () => {
    it('should return result from service', () => {
      const serviceResult = 'test-sevice-result';
      spyOn(service, 'translate').and.returnValue(serviceResult);
      expect(pipe.transform({ url: 'test-url' })).toBe(serviceResult);
      expect(service.translate).toHaveBeenCalled();
    });
  });
});
