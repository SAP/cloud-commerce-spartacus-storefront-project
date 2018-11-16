import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigurableRoutesService } from '@spartacus/core';
import { StorefrontComponent } from './storefront.component';

@Component({
  template: '',
  selector: 'cx-footer'
})
class MockFoooterComponent {}

@Component({
  template: '',
  selector: 'cx-global-message'
})
class MockGlobalMessageComponent {}

@Component({
  template: '',
  selector: 'cx-header'
})
class MockHeaderComponent {}

class MockConfigurableRoutesService {
  changeLanguage() {}
}

describe('StorefrontComponent', () => {
  let component: StorefrontComponent;
  let configurableRoutesService: ConfigurableRoutesService;
  let fixture: ComponentFixture<StorefrontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        StorefrontComponent,
        MockHeaderComponent,
        MockGlobalMessageComponent,
        MockFoooterComponent
      ],
      providers: [
        {
          provide: ConfigurableRoutesService,
          useClass: MockConfigurableRoutesService
        }
      ]
    }).compileComponents();

    configurableRoutesService = TestBed.get(ConfigurableRoutesService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorefrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set current language for routes', () => {
      spyOn(configurableRoutesService, 'changeLanguage');
      component.ngOnInit();
      expect(configurableRoutesService.changeLanguage).toHaveBeenCalled();
    });
  });
});
