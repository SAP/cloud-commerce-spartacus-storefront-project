import { Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConsentTemplate, I18nTestingModule } from '@spartacus/core';
import { ICON_TYPE } from '../../../../../cms-components/misc';
import { ConsentManagementFormComponent } from './consent-management-form.component';

@Component({ selector: 'cx-icon', template: '' })
class MockIconComponent {
  @Input() type: ICON_TYPE;
}

describe('ConsentManagementFormComponent', () => {
  let component: ConsentManagementFormComponent;
  let fixture: ComponentFixture<ConsentManagementFormComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [MockIconComponent, ConsentManagementFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentManagementFormComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component method tests', () => {
    describe('ngOnInit', () => {
      describe('when a consent is given', () => {
        const mockConsentTemplate: ConsentTemplate = {
          id: 'TEMPLATE_ID',
          currentConsent: {
            consentGivenDate: new Date(),
          },
        };
        it('should set internal flag to true', () => {
          component.consentTemplate = mockConsentTemplate;
          component.ngOnInit();
          expect(component['consentGiven']).toEqual(true);
        });
      });
      describe('when a consent is withdrawn', () => {
        const mockConsentTemplate: ConsentTemplate = {
          currentConsent: {
            consentWithdrawnDate: new Date(),
          },
        };
        it('should set internal flag to false', () => {
          component.consentTemplate = mockConsentTemplate;
          component.ngOnInit();
          expect(component['consentGiven']).toEqual(false);
        });
      });
    });

    describe('onConsentChange', () => {
      const mockConsentTemplate: ConsentTemplate = {
        id: 'mock ID',
      };
      it('should emit an event', () => {
        const consentGiven = true;
        component.consentGiven = consentGiven;
        component.consentTemplate = mockConsentTemplate;
        spyOn(component.consentChanged, 'emit').and.stub();

        component.onConsentChange();

        expect(component.consentChanged.emit).toHaveBeenCalledWith({
          given: !consentGiven,
          template: mockConsentTemplate,
        });
      });
    });

    describe('isRequired', () => {
      it('should return TRUE if the id is included in the required array', () => {
        const templateId = 'TEMPLATE_ID';
        component.isAnonymousConsentsEnabled = true;
        component.requiredConsents = [templateId, 'OTHER1', 'OTHER2'];

        expect(component.isRequired(templateId)).toBeTruthy();
      });
      it('should return FALSE if the id is NOT included in the required array', () => {
        const templateId = 'TEMPLATE_ID';
        component.requiredConsents = ['OTHER1', 'OTHER2'];

        expect(component.isRequired(templateId)).toBeFalsy();

        component.requiredConsents = [];
        expect(component.isRequired(templateId)).toBeFalsy();
      });
    });
  });

  describe('component UI tests', () => {
    describe('when a checkbox is clicked', () => {
      const mockConsentTemplate: ConsentTemplate = {
        id: 'mock ID',
      };
      it('should call onConsentChange()', () => {
        spyOn(component, 'onConsentChange').and.stub();

        component.consentTemplate = mockConsentTemplate;
        component.consentGiven = true;
        component.ngOnInit();
        fixture.detectChanges();

        const checkbox = el.query(By.css('input')).nativeElement as HTMLElement;
        checkbox.dispatchEvent(new MouseEvent('click'));

        expect(component.onConsentChange).toHaveBeenCalled();
      });
      it('should disable required consents', () => {
        // TODO(issue:4989) Anonymous consents - remove `component.isLevel13 = true`
        component.isLevel13 = true;
        component.isAnonymousConsentsEnabled = true;
        component.consentTemplate = mockConsentTemplate;
        component.requiredConsents = [mockConsentTemplate.id];

        fixture.detectChanges();

        const checkbox = el.query(By.css('input')).nativeElement as HTMLElement;

        expect(checkbox.hasAttribute('disabled')).toBeTruthy();
      });
    });
  });
});
