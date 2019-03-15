import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {
  CmsComponent,
  CmsConfig,
  CmsService,
  ComponentMapperService,
  CxApiService,
  ContentSlotComponentData
} from '@spartacus/core';
import { CmsComponentData } from '../model/cms-component-data';
import { isPlatformServer } from '@angular/common';

@Directive({
  selector: '[cxComponentWrapper]'
})
export class ComponentWrapperDirective implements OnInit, OnDestroy {
  @Input() cxComponentWrapper: ContentSlotComponentData;

  cmpRef: ComponentRef<any>;
  webElement: any;

  constructor(
    private vcr: ViewContainerRef,
    private componentMapper: ComponentMapperService,
    private injector: Injector,
    private cmsService: CmsService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private config: CmsConfig,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!this.shouldRenderComponent()) {
      return;
    }

    if (this.componentMapper.isWebComponent(this.cxComponentWrapper.flexType)) {
      this.launchWebComponent();
    } else {
      this.launchComponent();
    }
  }

  private shouldRenderComponent(): boolean {
    const isSSR = isPlatformServer(this.platformId);
    const isComponentDisabledInSSR = (
      this.config.cmsComponents[this.cxComponentWrapper.flexType] || {}
    ).disableSSR;
    return !(isSSR && isComponentDisabledInSSR);
  }

  private launchComponent() {
    const factory = this.componentMapper.getComponentFactoryByCode(
      this.cxComponentWrapper.flexType
    );

    if (factory) {
      this.cmpRef = this.vcr.createComponent(
        factory,
        undefined,
        this.getInjectorForComponent()
      );

      this.cd.detectChanges();

      if (this.cmsService.isLaunchInSmartEdit()) {
        this.addSmartEditContract(this.cmpRef.location.nativeElement);
      }
    }
  }

  private async launchWebComponent() {
    const elementName = await this.componentMapper.initWebComponent(
      this.cxComponentWrapper.flexType,
      this.renderer
    );

    if (elementName) {
      this.webElement = this.renderer.createElement(elementName);

      this.webElement.cxApi = {
        ...this.injector.get(CxApiService),
        CmsComponentData: this.getCmsDataForComponent()
      };

      this.renderer.appendChild(
        this.vcr.element.nativeElement.parentElement,
        this.webElement
      );
    }
  }

  private getCmsDataForComponent<T extends CmsComponent>(): CmsComponentData<
    T
  > {
    return {
      uid: this.cxComponentWrapper.uid,
      data$: this.cmsService.getComponentData(this.cxComponentWrapper.uid)
    };
  }

  private getInjectorForComponent(): Injector {
    const configProviders =
      (this.config.cmsComponents[this.cxComponentWrapper.flexType] || {})
        .providers || [];
    return Injector.create({
      providers: [
        {
          provide: CmsComponentData,
          useValue: this.getCmsDataForComponent()
        },
        ...configProviders
      ],
      parent: this.injector
    });
  }

  private addSmartEditContract(element: Element) {
    element.classList.add('smartEditComponent');
    this.renderer.setAttribute(
      element,
      'data-smartedit-component-id',
      this.cxComponentWrapper.uid
    );
    this.renderer.setAttribute(
      element,
      'data-smartedit-component-type',
      this.cxComponentWrapper.typeCode
    );
    this.renderer.setAttribute(
      element,
      'data-smartedit-catalog-version-uuid',
      this.cxComponentWrapper.catalogUuid
    );
    this.renderer.setAttribute(
      element,
      'data-smartedit-component-uuid',
      this.cxComponentWrapper.uuid
    );
  }

  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    if (this.webElement) {
      this.renderer.removeChild(
        this.vcr.element.nativeElement.parentElement,
        this.webElement
      );
    }
  }
}
