import {
  Directive,
  ViewContainerRef,
  Input,
  OnInit,
  OnDestroy,
  ComponentRef,
  Injector,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import { CmsComponent } from '@spartacus/core';
import { CmsComponentData } from '../cms-component-data';
import { AbstractCmsComponent } from '../abstract-cms-component';
import { CxApiService } from '../../../cx-api/cx-api.service';
import { CmsConfig, CmsService, ComponentMapperService } from '@spartacus/core';

@Directive({
  selector: '[cxComponentWrapper]'
})
export class ComponentWrapperDirective implements OnInit, OnDestroy {
  @Input()
  componentType: string;
  @Input()
  componentUid: string;
  @Input()
  componentCssClass: string;
  @Input()
  contextParameters: any;

  cmpRef: ComponentRef<any>;
  webElement: any;

  constructor(
    private vcr: ViewContainerRef,
    private componentMapper: ComponentMapperService,
    private injector: Injector,
    private cmsService: CmsService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private config: CmsConfig
  ) {}

  ngOnInit() {
    if (this.componentMapper.isWebComponent(this.componentType)) {
      this.launchWebComponent();
    } else {
      this.launchComponent();
    }
  }

  private launchComponent() {
    const factory = this.componentMapper.getComponentFactoryByCode(
      this.componentType
    );

    if (factory) {
      this.cmpRef = this.vcr.createComponent(
        factory,
        undefined,
        this.getInjectorForComponent()
      );

      // TODO: Remove after AbstractCmsComponent will be removed
      const instance: AbstractCmsComponent = this.cmpRef.instance;
      if (instance.onCmsComponentInit) {
        instance.onCmsComponentInit(this.componentUid, this.contextParameters);
      } else {
        this.cd.detectChanges();
      }
    }
  }

  private async launchWebComponent() {
    const elementName = await this.componentMapper.initWebComponent(
      this.componentType,
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
      uid: this.componentUid,
      contextParameters: this.contextParameters,
      data$: this.cmsService.getComponentData(this.componentUid)
    };
  }

  private getInjectorForComponent(): Injector {
    const configProviders =
      (this.config.cmsComponents[this.componentType] || {}).providers || [];
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
