import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { OpfDynamicScript } from '@spartacus/opf/base/root';
import { OpfCtaScriptsService } from '../opf-cta-scripts';
import { OpfCtaElementComponent } from './opf-cta-element.component';

describe('OpfCtaButton', () => {
  let component: OpfCtaElementComponent;
  let fixture: ComponentFixture<OpfCtaElementComponent>;
  let domSanitizer: DomSanitizer;
  let opfCtaScriptsServiceMock: jasmine.SpyObj<OpfCtaScriptsService>;

  const dynamicScriptMock: OpfDynamicScript = {
    html: '<div  style="border-style: solid;text-align:center;border-radius:10px;align-content:center;background-color:yellow;color:black"><h2>Thanks for purchasing our great products</h2><h3>Please use promo code:<b>123abc</b> for your next purchase<h3></div><script>console.log(\'CTA Script #1 is running\')</script>',
    cssUrls: [
      {
        url: 'https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/4.2.1/adyen.css',
        sri: '',
      },
    ],
    jsUrls: [
      {
        url: 'https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/4.2.1/adyen.js',
        sri: '',
      },
    ],
  };

  beforeEach(() => {
    opfCtaScriptsServiceMock = jasmine.createSpyObj('OpfCtaScriptsService', [
      'removeScriptTags',
      'loadAndRunScript',
    ]);

    TestBed.configureTestingModule({
      declarations: [OpfCtaElementComponent],
      providers: [
        { provide: OpfCtaScriptsService, useValue: opfCtaScriptsServiceMock },
      ],
    });
    fixture = TestBed.createComponent(OpfCtaElementComponent);
    component = fixture.componentInstance;
    domSanitizer = TestBed.inject(DomSanitizer);
    opfCtaScriptsServiceMock.loadAndRunScript.and.returnValue(
      Promise.resolve(dynamicScriptMock)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should renderHtml call bypassSecurityTrustHtml', () => {
    const html = '<script>console.log("script");</script>';
    spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.stub();
    component.renderHtml(html);

    expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(html);
  });

  it('should call loadAndRunScript', () => {
    component.ngAfterViewInit();
    expect(opfCtaScriptsServiceMock.loadAndRunScript).toHaveBeenCalled();
  });
});