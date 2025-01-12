import { ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { OpfGlobalFunctionsService } from '@spartacus/opf/global-functions/core';
import {
  OpfGlobalFunctionsDomain,
  OpfGlobalFunctionsFacade,
  OpfRegisterGlobalFunctionsInput,
} from '@spartacus/opf/global-functions/root';
import { OpfPaymentRenderPattern } from '@spartacus/opf/payment/root';
import { of } from 'rxjs';
import { OpfCheckoutPaymentWrapperComponent } from './opf-checkout-payment-wrapper.component';
import { OpfCheckoutPaymentWrapperService } from './opf-checkout-payment-wrapper.service';
describe('OpfCheckoutPaymentWrapperComponent', () => {
  let component: OpfCheckoutPaymentWrapperComponent;
  let fixture: ComponentFixture<OpfCheckoutPaymentWrapperComponent>;
  let mockService: jasmine.SpyObj<OpfCheckoutPaymentWrapperService>;
  let mockGlobalFunctionsService: jasmine.SpyObj<OpfGlobalFunctionsService>;
  let domSanitizer: DomSanitizer;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('OpfCheckoutPaymentWrapperService', [
      'getRenderPaymentMethodEvent',
      'initiatePayment',
      'reloadPaymentMode',
    ]);

    mockGlobalFunctionsService = jasmine.createSpyObj(
      'OpfGlobalFunctionsFacade',
      ['registerGlobalFunctions', 'unregisterGlobalFunctions']
    );

    TestBed.configureTestingModule({
      declarations: [OpfCheckoutPaymentWrapperComponent],
      providers: [
        { provide: OpfCheckoutPaymentWrapperService, useValue: mockService },
        {
          provide: OpfGlobalFunctionsFacade,
          useValue: mockGlobalFunctionsService,
        },
        {
          provide: ViewContainerRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpfCheckoutPaymentWrapperComponent);
    component = fixture.componentInstance;
    domSanitizer = TestBed.inject(DomSanitizer);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bypassSecurityTrustHtml call bypassSecurityTrustHtml', () => {
    const html = '<script>console.log("script");</script>';
    spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.stub();
    component.bypassSecurityTrustHtml(html);

    expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(html);
  });

  it('should bypassSecurityTrustResourceUrl call bypassSecurityTrustResourceUrl', () => {
    const url = 'https://sap.com';
    spyOn(domSanitizer, 'bypassSecurityTrustResourceUrl').and.stub();
    component.bypassSecurityTrustResourceUrl(url);

    expect(domSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      url
    );
  });

  it('should call initiatePayment on ngOnInit', () => {
    const mockPaymentSessionData = {
      paymentSessionId: 'session123',
      pattern: OpfPaymentRenderPattern.HOSTED_FIELDS,
    };

    mockService.initiatePayment.and.returnValue(of(mockPaymentSessionData));

    component.selectedPaymentId = 123;
    component.ngOnInit();

    const globalFunctionsInput: OpfRegisterGlobalFunctionsInput = {
      domain: OpfGlobalFunctionsDomain.CHECKOUT,
      paymentSessionId: mockPaymentSessionData.paymentSessionId,
    };

    expect(mockService.initiatePayment).toHaveBeenCalledWith(123);
    expect(
      mockGlobalFunctionsService.registerGlobalFunctions
    ).toHaveBeenCalledWith(jasmine.objectContaining(globalFunctionsInput));
  });

  it('should call unregisterGlobalFunctions if paymentSessionData is not HOSTED_FIELDS', () => {
    const mockPaymentSessionData = {
      paymentSessionId: 'session123',
      pattern: OpfPaymentRenderPattern.FULL_PAGE,
    };

    mockService.initiatePayment.and.returnValue(of(mockPaymentSessionData));

    component.selectedPaymentId = 123;
    component.ngOnInit();

    expect(
      mockGlobalFunctionsService.unregisterGlobalFunctions
    ).toHaveBeenCalled();
  });

  it('should call reloadPaymentMode on retryInitiatePayment', () => {
    component.retryInitiatePayment();

    expect(mockService.reloadPaymentMode).toHaveBeenCalled();
  });

  it('should return true if paymentSessionData is HOSTED_FIELDS', () => {
    const mockPaymentSessionData = {
      paymentSessionId: 'session123',
      pattern: 'HOSTED_FIELDS',
    };

    const result = (component as any)?.isHostedFields(mockPaymentSessionData);

    expect(result).toBeTruthy();
  });

  it('should return false if paymentSessionData is not HOSTED_FIELDS', () => {
    const mockPaymentSessionData = {
      paymentSessionId: 'session123',
      pattern: 'NON_HOSTED_FIELDS',
    };

    const result = (component as any)?.isHostedFields(mockPaymentSessionData);

    expect(result).toBeFalsy();
  });
});
