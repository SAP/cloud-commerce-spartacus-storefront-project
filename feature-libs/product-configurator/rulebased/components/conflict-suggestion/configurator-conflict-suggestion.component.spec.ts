import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Configurator } from '../../core/model/configurator.model';
import { ConfiguratorConflictSuggestionComponent } from './configurator-conflict-suggestion.component';

describe('ConfigurationConflictSuggestionComponent', () => {
  let component: ConfiguratorConflictSuggestionComponent;
  let fixture: ComponentFixture<ConfiguratorConflictSuggestionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConfiguratorConflictSuggestionComponent],
        imports: [],
        providers: [],
      })
        .overrideComponent(ConfiguratorConflictSuggestionComponent, {
          set: {
            changeDetection: ChangeDetectionStrategy.Default,
          },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguratorConflictSuggestionComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should return true for conflict group with more than one attribute', () => {
    const conflictGroup1: Configurator.Group = {
      id: '1',
      groupType: Configurator.GroupType.CONFLICT_GROUP,
    };
    expect(component.displayConflictSuggestion(conflictGroup1)).toBe(false);
    const conflictGroup2 = {
      id: '2',
      groupType: Configurator.GroupType.CONFLICT_GROUP,
      attributes: [{ name: '1' }],
    };
    expect(component.displayConflictSuggestion(conflictGroup2)).toBe(false);
    const conflictGroup3 = {
      id: '3',
      groupType: Configurator.GroupType.CONFLICT_GROUP,
      attributes: [{ name: '1' }, { name: '2' }],
    };
    expect(component.displayConflictSuggestion(conflictGroup3)).toBe(true);
    const group = {
      id: '4',
      groupType: Configurator.GroupType.ATTRIBUTE_GROUP,
    };
    expect(component.displayConflictSuggestion(group)).toBe(false);
  });
});
