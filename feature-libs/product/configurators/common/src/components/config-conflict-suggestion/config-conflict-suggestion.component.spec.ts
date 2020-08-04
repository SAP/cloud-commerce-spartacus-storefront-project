import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Configurator } from '@spartacus/core';
import { ConfigConflictSuggestionComponent } from './config-conflict-suggestion.component';

describe('ConfigurationConflictSuggestionComponent', () => {
  let component: ConfigConflictSuggestionComponent;

  let fixture: ComponentFixture<ConfigConflictSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigConflictSuggestionComponent],
      imports: [],
      providers: [],
    })
      .overrideComponent(ConfigConflictSuggestionComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigConflictSuggestionComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should return true for conflict group with more than one attribute', () => {
    const conflictGroup1 = { groupType: Configurator.GroupType.CONFLICT_GROUP };
    expect(component.displayConflictSuggestion(conflictGroup1)).toBe(false);
    const conflictGroup2 = {
      groupType: Configurator.GroupType.CONFLICT_GROUP,
      attributes: [{ name: '1' }],
    };
    expect(component.displayConflictSuggestion(conflictGroup2)).toBe(false);
    const conflictGroup3 = {
      groupType: Configurator.GroupType.CONFLICT_GROUP,
      attributes: [{ name: '1' }, { name: '2' }],
    };
    expect(component.displayConflictSuggestion(conflictGroup3)).toBe(true);
    const group = { groupType: Configurator.GroupType.ATTRIBUTE_GROUP };
    expect(component.displayConflictSuggestion(group)).toBe(false);
  });
});
