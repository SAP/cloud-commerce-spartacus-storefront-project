import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WindowRef } from '@spartacus/core';
import { DirectionMode } from '../../../layout/direction/config/direction.model';
import { IconLoaderService } from './icon-loader.service';
import { IconConfig, IconResourceType, ICON_TYPE } from './icon.model';

const FONT_AWESOME_RESOURCE =
  'https://use.fontawesome.com/releases/v5.8.1/css/all.css';

export const MockIconConfig: IconConfig = {
  icon: {
    symbols: {
      SEARCH: 'fas fa-search',
      VISA: 'fab fa-cc-visa',
      AMEX: 'fab fa-amex',
      MASTERCARD: 'fab fa-master-card',
      PAYPAL: 'fab fa-paypal',
      CART: 'cartSymbol',
      INFO: 'infoSymbol',
      HAPPY: '😊',
      SAD: ':-(',
      RIGHT: 'someRight otherRight',
      LEFT: 'someLeft otherLeft',
      BAD_SVG: '<img src="." onerror="alert(5)">',
      BAD_CLASS: '" onmouseover="alert(0)" data-foo="',
      BAD_STYLESHEET: 'badStylesheet',
      BAD_TEXT: '<img src="." onerror="alert(4)">',
      UNKNOWN: 'unknownIconResourceType',
    },
    resources: [
      {
        type: IconResourceType.SVG,
        url: './assets/sprite.svg',
        types: [ICON_TYPE.CART],
      },
      {
        type: IconResourceType.SVG,
        types: [ICON_TYPE.INFO],
      },
      {
        type: IconResourceType.SVG,
        url: 'javascript:alert(1)',
        types: ['BAD_SVG'],
      },
      {
        type: IconResourceType.LINK,
        url: FONT_AWESOME_RESOURCE,
      },
      {
        type: IconResourceType.LINK,
        url: FONT_AWESOME_RESOURCE,
        types: ['PAYPAL'],
      },
      {
        type: IconResourceType.LINK,
        url: 'different-font.css',
        types: ['MASTERCARD'],
      },
      {
        type: IconResourceType.LINK,
        url: 'javascript:alert(2)',
        types: ['BAD_STYLESHEET'],
      },
      {
        type: IconResourceType.TEXT,
        types: ['HAPPY', 'SAD', 'BAD_TEXT'],
      },
      {
        type: 'foo',
        types: ['UNKNOWN'],
      },
    ],
    flipDirection: {
      CARET_RIGHT: DirectionMode.RTL,
      CARET_LEFT: DirectionMode.LTR,
      RIGHT: DirectionMode.RTL,
      LEFT: DirectionMode.LTR,
    },
  },
};

function unwrapSafeHtml(html: SafeHtml | undefined): string {
  if (!html) {
    return '';
  }
  return html['changingThisBreaksApplicationSecurity'];
}

describe('IconLoaderService', () => {
  let service: IconLoaderService;
  let winRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IconConfig, useValue: MockIconConfig }],
    });

    service = TestBed.inject(IconLoaderService);
    winRef = TestBed.inject(WindowRef);
  });

  it('should inject service', () => {
    expect(service).toBeTruthy();
  });

  it('should return IconResourceType', () => {
    expect(service.getResourceType(ICON_TYPE.CART)).toBe(IconResourceType.SVG);
    expect(service.getResourceType('MASTERCARD')).toBe(IconResourceType.LINK);
    expect(service.getResourceType('HAPPY')).toBe(IconResourceType.TEXT);
    expect(service.getResourceType(ICON_TYPE.VISA)).toBe(IconResourceType.LINK);
    expect(service.getResourceType('UNKNOWN')).toBe(IconResourceType.LINK);
  });

  it('should return symbol', () => {
    expect(service.getSymbol(ICON_TYPE.CART)).toEqual('cartSymbol');
    expect(service.getSymbol('MASTERCARD')).toEqual('fab fa-master-card');
    expect(service.getSymbol(ICON_TYPE.VISA)).toEqual('fab fa-cc-visa');
    expect(service.getSymbol('HAPPY')).toEqual('😊');
  });

  it('should return rtl flip direction', () => {
    expect(service.getFlipDirection(ICON_TYPE.CARET_RIGHT)).toEqual(
      DirectionMode.RTL
    );
  });

  it('should not return any flip direction', () => {
    expect(service.getFlipDirection(ICON_TYPE.CART)).toBeFalsy();
  });

  describe('Linked resources', () => {
    it('should add the font resource', () => {
      spyOn<any>(winRef.document, 'createElement').and.callThrough();
      service.addLinkResource(ICON_TYPE.VISA);
      expect(winRef.document.createElement).toHaveBeenCalledWith('link');
    });

    it('should not add the font resource for the same font icon', () => {
      spyOn<any>(winRef.document, 'createElement').and.callThrough();
      service.addLinkResource(ICON_TYPE.VISA);
      service.addLinkResource(ICON_TYPE.VISA);
      expect(winRef.document.createElement).toHaveBeenCalledTimes(1);
    });

    it('should not add the same font resource for fonts with the same font resource', () => {
      spyOn<any>(winRef.document, 'createElement').and.callThrough();
      service.addLinkResource(ICON_TYPE.VISA);
      service.addLinkResource('PAYPAL');
      expect(winRef.document.createElement).toHaveBeenCalledTimes(1);
    });

    it('should add 2 fonts resources for the different fonts', () => {
      spyOn<any>(winRef.document, 'createElement').and.callThrough();
      service.addLinkResource(ICON_TYPE.VISA);
      service.addLinkResource('MASTERCARD');
      expect(winRef.document.createElement).toHaveBeenCalledTimes(2);
    });

    it('should add stylesheet', () => {
      service.addLinkResource(ICON_TYPE.VISA);

      const styleSheetLinkElement = winRef.document.head.lastElementChild;
      expect(styleSheetLinkElement).not.toBeNull();
      expect(styleSheetLinkElement?.localName).toEqual('link');
      expect(styleSheetLinkElement?.nodeName).toEqual('LINK');
      expect(styleSheetLinkElement?.attributes.length).toEqual(3);
      expect(styleSheetLinkElement?.getAttribute('rel')).toEqual('stylesheet');
      expect(styleSheetLinkElement?.getAttribute('type')).toEqual('text/css');
      expect(styleSheetLinkElement?.getAttribute('href')).toEqual(
        'https://use.fontawesome.com/releases/v5.8.1/css/all.css'
      );
      expect(styleSheetLinkElement?.childElementCount).toEqual(0);
    });

    it('should add same stylesheet only once', () => {
      service.addLinkResource(ICON_TYPE.AMEX);
      const styleSheetLinkElement1 = winRef.document.head.lastElementChild;

      service.addLinkResource(ICON_TYPE.AMEX);
      const styleSheetLinkElement2 = winRef.document.head.lastElementChild;

      expect(styleSheetLinkElement2).toBe(styleSheetLinkElement1);
      expect(styleSheetLinkElement2).not.toBeNull();
      expect(styleSheetLinkElement2?.localName).toEqual('link');
      expect(styleSheetLinkElement2?.nodeName).toEqual('LINK');
      expect(styleSheetLinkElement2?.attributes.length).toEqual(3);
      expect(styleSheetLinkElement2?.getAttribute('rel')).toEqual('stylesheet');
      expect(styleSheetLinkElement2?.getAttribute('type')).toEqual('text/css');
      expect(styleSheetLinkElement2?.getAttribute('href')).toEqual(
        'https://use.fontawesome.com/releases/v5.8.1/css/all.css'
      );
      expect(styleSheetLinkElement2?.childElementCount).toEqual(0);
    });

    it('should add stylesheet with sanitized URL', () => {
      service.addLinkResource('BAD_STYLESHEET');

      const styleSheetLinkElement = winRef.document.head.lastElementChild;
      expect(styleSheetLinkElement).not.toBeNull();
      expect(styleSheetLinkElement?.localName).toEqual('link');
      expect(styleSheetLinkElement?.nodeName).toEqual('LINK');
      expect(styleSheetLinkElement?.attributes.length).toEqual(3);
      expect(styleSheetLinkElement?.getAttribute('rel')).toEqual('stylesheet');
      expect(styleSheetLinkElement?.getAttribute('type')).toEqual('text/css');
      expect(styleSheetLinkElement?.getAttribute('href')).toEqual(
        'unsafe:javascript:alert(2)'
      );
      expect(styleSheetLinkElement?.childElementCount).toEqual(0);
    });
  });

  describe('Styles', () => {
    it('should return configured symbol in the class when using fonts', () => {
      expect(service.getStyleClasses(ICON_TYPE.VISA)).toContain('fab');
      expect(service.getStyleClasses(ICON_TYPE.VISA)).toContain('fa-cc-visa');
    });
  });

  describe('sanitize HTML for icons', () => {
    it(`should not have bypassed HTML sanitizing for font icon`, () => {
      const domSanitizer: DomSanitizer = TestBed.inject(DomSanitizer);
      spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.stub();
      service.getHtml(ICON_TYPE.VISA);
      expect(domSanitizer.bypassSecurityTrustHtml).not.toHaveBeenCalled();
    });

    it(`should have bypassed HTML sanitizing for text icon`, () => {
      const domSanitizer: DomSanitizer = TestBed.inject(DomSanitizer);
      spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.stub();
      service.getHtml('HAPPY');
      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
    });

    it('should have bypassed HTML sanitizing for sprited SVG', () => {
      const domSanitizer: DomSanitizer = TestBed.inject(DomSanitizer);
      spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.stub();
      service.getHtml(ICON_TYPE.CART);
      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        '<svg><use xlink:href="./assets/sprite.svg#cartSymbol"></use></svg>'
      );
    });

    it('should have bypassed HTML sanitizing for non-sprited SVG', () => {
      const domSanitizer: DomSanitizer = TestBed.inject(DomSanitizer);
      spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.stub();
      service.getHtml(ICON_TYPE.INFO);
      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        '<svg><use xlink:href="#infoSymbol"></use></svg>'
      );
    });
  });

  describe('TEXT icons', () => {
    it('should generate text', () => {
      const nativeDebugElement = winRef.document.createElement('div');
      nativeDebugElement.innerHTML = unwrapSafeHtml(service.getHtml('SAD'));

      expect(nativeDebugElement.textContent).toEqual(':-(');
      expect(nativeDebugElement.childElementCount).toEqual(0);
    });

    it('should not generate dangerous html source code', () => {
      const nativeDebugElement = winRef.document.createElement('div');
      nativeDebugElement.innerHTML = unwrapSafeHtml(
        service.getHtml('BAD_TEXT')
      );

      expect(nativeDebugElement.textContent).toEqual(
        '<img src="." onerror="alert(4)">'
      );
      expect(nativeDebugElement.childElementCount).toEqual(0);
    });
  });

  describe('SVG icons', () => {
    it('should return svg path for sprited SVG', () => {
      expect(service.getSvgPath(ICON_TYPE.CART)).toEqual(
        './assets/sprite.svg#cartSymbol'
      );
    });

    it('should return svg path for non-sprited SVG', () => {
      expect(service.getSvgPath(ICON_TYPE.INFO)).toEqual('#infoSymbol');
    });

    it('should generate non-sprited SVG code', () => {
      const nativeDebugElement = winRef.document.createElement('div');
      nativeDebugElement.innerHTML = unwrapSafeHtml(
        service.getHtml(ICON_TYPE.INFO)
      );
      expect(nativeDebugElement.childElementCount).toEqual(1);

      const svgElement = nativeDebugElement.children[0];
      expect(svgElement.nodeName).toEqual('svg');
      expect(svgElement.attributes.length).toEqual(0);
      expect(svgElement.childElementCount).toEqual(1);

      const useElement = svgElement.children[0];
      expect(useElement.nodeName).toEqual('use');
      expect(useElement.attributes.length).toEqual(1);
      expect(useElement.getAttribute('xlink:href')).toEqual('#infoSymbol');
      expect(useElement.childElementCount).toEqual(0);
    });

    it('should generate sprited SVG', () => {
      const nativeDebugElement = winRef.document.createElement('div');
      nativeDebugElement.innerHTML = unwrapSafeHtml(
        service.getHtml(ICON_TYPE.CART)
      );
      expect(nativeDebugElement.childElementCount).toEqual(1);

      const svgElement = nativeDebugElement.children[0];
      expect(svgElement.nodeName).toEqual('svg');
      expect(svgElement.attributes.length).toEqual(0);
      expect(svgElement.childElementCount).toEqual(1);

      const useElement = svgElement.children[0];
      expect(useElement.nodeName).toEqual('use');
      expect(useElement.attributes.length).toEqual(1);
      expect(useElement.getAttribute('xlink:href')).toEqual(
        './assets/sprite.svg#cartSymbol'
      );
      expect(useElement.childElementCount).toEqual(0);
    });

    it('should generate a sprited SVG with a sanitized javascript: url', () => {
      const nativeDebugElement = winRef.document.createElement('div');
      nativeDebugElement.innerHTML = unwrapSafeHtml(service.getHtml('BAD_SVG'));
      expect(nativeDebugElement.childElementCount).toEqual(1);

      const svgElement = nativeDebugElement.children[0];
      expect(svgElement.nodeName).toEqual('svg');
      expect(svgElement.attributes.length).toEqual(0);
      expect(svgElement.childElementCount).toEqual(1);

      const useElement = svgElement.children[0];
      expect(useElement.nodeName).toEqual('use');
      expect(useElement.attributes.length).toEqual(1);
      expect(useElement.getAttribute('xlink:href')).toEqual(
        'unsafe:javascript:alert(1)#<img src="." onerror="alert(5)">'
      );
      expect(useElement.childElementCount).toEqual(0);
    });
  });
});
