import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { BannerComponent } from './banner.component';
import * as fromRoot from '../../routing/store';
import * as fromCmsReducer from '../../cms/store/reducers';
import { CmsModuleConfig } from '../../cms/cms-module-config';
import { GenericLinkComponent } from '../../ui/components/generic-link/generic-link.component';

const UseCmsModuleConfig: CmsModuleConfig = {
  cmsComponentMapping: {
    SimpleBannerComponent: 'BannerComponent'
  },
  server: {
    baseUrl: 'https://localhost:9002'
  }
};

describe('BannerComponent', () => {
  let bannerComponent: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let store: Store<fromCmsReducer.CmsState>;
  let el: DebugElement;

  const componentData = {
    uid: 'SiteLogoComponent',
    typeCode: 'SimpleBannerComponent',
    name: 'Site Logo Component',
    container: 'false',
    external: 'false',
    media: {
      code: '/images/theme/logo_hybris.jpg',
      mime: 'image/svg+xml',
      altText: 'hybris Accelerator',
      url: '/medias/logo-hybris.jpg'
    },
    type: 'Simple Banner Component',
    urlLink: '/logo'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          cms: combineReducers(fromCmsReducer.getReducers())
        }),
        RouterTestingModule
      ],
      declarations: [BannerComponent, GenericLinkComponent],
      providers: [{ provide: CmsModuleConfig, useValue: UseCmsModuleConfig }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    bannerComponent = fixture.componentInstance;
    el = fixture.debugElement;

    store = TestBed.get(Store);
    spyOn(store, 'select').and.returnValue(of(componentData));
  });

  it('should create banner component in CmsLib', () => {
    expect(bannerComponent).toBeTruthy();
  });

  it('should contain image source', () => {
    expect(bannerComponent.component).toBeNull();
    bannerComponent.bootstrap();
    expect(bannerComponent.component).toBe(componentData);
    expect(el.query(By.css('img')).nativeElement.src).toContain(
      bannerComponent.component.media.url
    );
  });
});
