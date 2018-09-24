import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NavigationModule } from '../navigation/navigation.module';
import { CategoryNavigationComponent } from './category-navigation.component';
import * as fromRoot from '../../routing/store';
import * as fromCmsReducer from '../../cms/store/reducers';
import { CmsModuleConfig } from '../../cms/cms-module-config';
import { BootstrapModule } from '../../bootstrap.module';

const UseCmsModuleConfig: CmsModuleConfig = {
  cmsComponentMapping: {
    CategoryNavigationComponent: 'CategoryNavigationComponent'
  }
};

describe('CategoryNavigationComponent', () => {
  let component: CategoryNavigationComponent;
  let fixture: ComponentFixture<CategoryNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NavigationModule,
        BootstrapModule,
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          cms: combineReducers(fromCmsReducer.getReducers())
        })
      ],
      declarations: [CategoryNavigationComponent],
      providers: [{ provide: CmsModuleConfig, useValue: UseCmsModuleConfig }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryNavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create category navigation component in CmsLib', () => {
    expect(component).toBeTruthy();
  });
});
