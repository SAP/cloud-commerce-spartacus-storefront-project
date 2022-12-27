import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  Type,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterState } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  I18nTestingModule,
  LanguageService,
  RoutingService,
} from '@spartacus/core';
import {
  CommonConfigurator,
  CommonConfiguratorUtilsService,
  ConfiguratorModelUtils,
} from '@spartacus/product-configurator/common';
import { ConfiguratorStorefrontUtilsService } from '@spartacus/product-configurator/rulebased';
import { ICON_TYPE } from '@spartacus/storefront';
import { cold } from 'jasmine-marbles';
import { EMPTY, Observable, of } from 'rxjs';
import { CommonConfiguratorTestUtilsService } from '../../../common/testing/common-configurator-test-utils.service';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { ConfiguratorGroupsService } from '../../core/facade/configurator-groups.service';
import { Configurator } from '../../core/model/configurator.model';
import * as ConfigurationTestData from '../../testing/configurator-test-data';
import { ConfiguratorAttributeFooterComponent } from '../attribute/footer/configurator-attribute-footer.component';
import { ConfiguratorAttributeHeaderComponent } from '../attribute/header/configurator-attribute-header.component';
import { ConfiguratorAttributeCheckBoxListComponent } from '../attribute/types/checkbox-list/configurator-attribute-checkbox-list.component';
import { ConfiguratorAttributeCheckBoxComponent } from '../attribute/types/checkbox/configurator-attribute-checkbox.component';
import { ConfiguratorAttributeDropDownComponent } from '../attribute/types/drop-down/configurator-attribute-drop-down.component';
import { ConfiguratorAttributeInputFieldComponent } from '../attribute/types/input-field/configurator-attribute-input-field.component';
import { ConfiguratorAttributeMultiSelectionImageComponent } from '../attribute/types/multi-selection-image/configurator-attribute-multi-selection-image.component';
import { ConfiguratorAttributeRadioButtonComponent } from '../attribute/types/radio-button/configurator-attribute-radio-button.component';
import { ConfiguratorAttributeReadOnlyComponent } from '../attribute/types/read-only/configurator-attribute-read-only.component';
import { ConfiguratorAttributeSingleSelectionImageComponent } from '../attribute/types/single-selection-image/configurator-attribute-single-selection-image.component';
import { ConfiguratorPriceComponentOptions } from '../price/configurator-price.component';
import { ConfiguratorDefaultFormComponent } from './configurator-default-form.component';
import { ConfiguratorExpertModeService } from '../../core/services/configurator-expert-mode.service';
import { MockFeatureLevelDirective } from 'projects/storefrontlib/shared/test/mock-feature-level-directive';

const PRODUCT_CODE = 'CONF_LAPTOP';
const CONFIGURATOR_ROUTE = 'configureCPQCONFIGURATOR';

const mockRouterState: any = {
  state: {
    params: {
      entityKey: PRODUCT_CODE,
      ownerType: CommonConfigurator.OwnerType.PRODUCT,
    },
    semanticRoute: CONFIGURATOR_ROUTE,
    queryParams: {},
  },
};

const OWNER = ConfiguratorModelUtils.createOwner(
  CommonConfigurator.OwnerType.PRODUCT,
  PRODUCT_CODE
);

const conflictGroup: Configurator.Group = {
  id: 'GROUP_ID_CONFLICT_1',
  name: 'The conflict text',
  groupType: Configurator.GroupType.CONFLICT_GROUP,
  subGroups: [],
  attributes: [
    { name: 'ATTRIBUTE_1_CHECKBOX', key: 'ATTRIBUTE_1' },
    { name: 'ATTRIBUTE_2_RADIOBUTTON', key: 'ATTRIBUTE_2' },
  ],
};
@Component({
  selector: 'cx-configurator-price',
  template: '',
})
class MockConfiguratorPriceComponent {
  @Input() formula: ConfiguratorPriceComponentOptions;
}

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

@Directive({
  selector: '[cxFocus]',
})
export class MockFocusDirective {
  @Input('cxFocus') protected config: string;
}

let routerStateObservable: Observable<RouterState> = EMPTY;
let configurationCreateObservable: Observable<Configurator.Configuration> =
  EMPTY;
let currentGroupObservable: Observable<string> = EMPTY;
let isConfigurationLoadingObservable: Observable<boolean> = EMPTY;
let hasConfigurationConflictsObservable: Observable<boolean> = EMPTY;

class MockRoutingService {
  getRouterState(): Observable<RouterState> {
    return routerStateObservable;
  }
}

class MockConfiguratorCommonsService {
  getOrCreateConfiguration(): Observable<Configurator.Configuration> {
    return configurationCreateObservable;
  }

  removeConfiguration(): void {}

  updateConfiguration(): void {}

  isConfigurationLoading(): Observable<boolean> {
    return isConfigurationLoadingObservable;
  }

  hasConflicts(): Observable<boolean> {
    return hasConfigurationConflictsObservable;
  }
}

class MockConfiguratorGroupsService {
  getCurrentGroup(): Observable<string> {
    return currentGroupObservable;
  }

  getNextGroup(): Observable<string> {
    return of('');
  }

  getPreviousGroup(): Observable<string> {
    return of('');
  }

  isGroupVisited(): Observable<boolean> {
    return of(true);
  }

  subscribeToUpdateConfiguration() {}

  setGroupStatusVisited(): void {}

  navigateToConflictSolver(): void {}

  navigateToFirstIncompleteGroup(): void {}

  isConflictGroupType() {}
}

class MockConfiguratorExpertModeService {
  setExpModeRequested(): void {}

  getExpModeRequested() {}

  setExpModeActive(): void {}

  getExpModeActive() {}
}

describe('ConfiguratorDefaultFormComponent', () => {
  let configuratorUtils: CommonConfiguratorUtilsService;
  let configuratorCommonsService: ConfiguratorCommonsService;
  let configuratorGroupsService: ConfiguratorGroupsService;
  let configExpertModeService: ConfiguratorExpertModeService;
  let mockLanguageService;
  let htmlElem: HTMLElement;
  let fixture: ComponentFixture<ConfiguratorDefaultFormComponent>;
  let component: ConfiguratorDefaultFormComponent;

  beforeEach(
    waitForAsync(() => {
      mockLanguageService = {
        getAll: () => of([]),
        getActive: jasmine.createSpy().and.returnValue(of('en')),
      };

      TestBed.configureTestingModule({
        imports: [I18nTestingModule, ReactiveFormsModule, NgSelectModule],
        declarations: [
          MockCxIconComponent,
          MockConfiguratorPriceComponent,
          MockFocusDirective,
          MockFeatureLevelDirective,
          ConfiguratorDefaultFormComponent,
          ConfiguratorAttributeHeaderComponent,
          ConfiguratorAttributeFooterComponent,
          ConfiguratorAttributeRadioButtonComponent,
          ConfiguratorAttributeInputFieldComponent,
          ConfiguratorAttributeDropDownComponent,
          ConfiguratorAttributeReadOnlyComponent,
          ConfiguratorAttributeCheckBoxComponent,
          ConfiguratorAttributeCheckBoxListComponent,
          ConfiguratorAttributeMultiSelectionImageComponent,
          ConfiguratorAttributeSingleSelectionImageComponent,
        ],
        providers: [
          {
            provide: RoutingService,
            useClass: MockRoutingService,
          },

          {
            provide: ConfiguratorCommonsService,
            useClass: MockConfiguratorCommonsService,
          },
          {
            provide: ConfiguratorGroupsService,
            useClass: MockConfiguratorGroupsService,
          },
          { provide: LanguageService, useValue: mockLanguageService },
          {
            provide: ConfiguratorStorefrontUtilsService,
            useClass: ConfiguratorStorefrontUtilsService,
          },
          {
            provide: ConfiguratorExpertModeService,
            useClass: MockConfiguratorExpertModeService,
          },
        ],
      })
        .overrideComponent(ConfiguratorAttributeHeaderComponent, {
          set: {
            changeDetection: ChangeDetectionStrategy.Default,
          },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    configuratorUtils = TestBed.inject(
      CommonConfiguratorUtilsService as Type<CommonConfiguratorUtilsService>
    );
    configuratorCommonsService = TestBed.inject(
      ConfiguratorCommonsService as Type<ConfiguratorCommonsService>
    );
    configuratorGroupsService = TestBed.inject(
      ConfiguratorGroupsService as Type<ConfiguratorGroupsService>
    );
    spyOn(
      configuratorCommonsService,
      'isConfigurationLoading'
    ).and.callThrough();
    spyOn(configuratorGroupsService, 'setGroupStatusVisited').and.callThrough();

    configExpertModeService = TestBed.inject(
      ConfiguratorExpertModeService as Type<ConfiguratorExpertModeService>
    );
    spyOn(configExpertModeService, 'setExpModeRequested').and.callThrough();
    spyOn(configExpertModeService, 'setExpModeActive').and.callThrough();

    configuratorUtils.setOwnerKey(OWNER);
    isConfigurationLoadingObservable = of(false);
    hasConfigurationConflictsObservable = of(false);
  });

  function createComponent(): ConfiguratorDefaultFormComponent {
    fixture = TestBed.createComponent(ConfiguratorDefaultFormComponent);
    component = fixture.componentInstance;
    htmlElem = fixture.nativeElement;
    component.owner = OWNER;
    return fixture.componentInstance;
  }

  it('should call configurator group service to check group type', () => {
    routerStateObservable = of(mockRouterState);
    spyOn(configuratorGroupsService, 'isConflictGroupType').and.callThrough();
    createComponent().isConflictGroupType(
      Configurator.GroupType.CONFLICT_GROUP
    );
    expect(configuratorGroupsService.isConflictGroupType).toHaveBeenCalledWith(
      Configurator.GroupType.CONFLICT_GROUP
    );
  });

  describe('resolve issues navigation', () => {
    it('should go to neither conflict solver nor first incomplete group', () => {
      spyOn(
        configuratorGroupsService,
        'navigateToConflictSolver'
      ).and.callThrough();
      spyOn(
        configuratorGroupsService,
        'navigateToFirstIncompleteGroup'
      ).and.callThrough();
      routerStateObservable = of({
        ...mockRouterState,
      });

      createComponent().ngOnInit();

      expect(
        configuratorGroupsService.navigateToConflictSolver
      ).toHaveBeenCalledTimes(0);
      expect(
        configuratorGroupsService.navigateToFirstIncompleteGroup
      ).toHaveBeenCalledTimes(0);
    });

    it('should go to conflict solver in case the router requires this - has conflicts', () => {
      spyOn(
        configuratorGroupsService,
        'navigateToConflictSolver'
      ).and.callThrough();
      spyOn(
        configuratorGroupsService,
        'navigateToFirstIncompleteGroup'
      ).and.callThrough();
      routerStateObservable = of({
        ...mockRouterState,
        state: {
          ...mockRouterState.state,
          queryParams: { resolveIssues: 'true' },
        },
      });
      hasConfigurationConflictsObservable = of(true);
      createComponent().ngOnInit();
      expect(
        configuratorGroupsService.navigateToConflictSolver
      ).toHaveBeenCalledTimes(1);
      expect(
        configuratorGroupsService.navigateToFirstIncompleteGroup
      ).toHaveBeenCalledTimes(0);
    });

    it('should go to first incomplete group in case the router requires this - has conflicts, but should be skipped', () => {
      spyOn(
        configuratorGroupsService,
        'navigateToConflictSolver'
      ).and.callThrough();
      spyOn(
        configuratorGroupsService,
        'navigateToFirstIncompleteGroup'
      ).and.callThrough();
      routerStateObservable = of({
        ...mockRouterState,
        state: {
          ...mockRouterState.state,
          queryParams: { resolveIssues: 'true', skipConflicts: 'true' },
        },
      });
      hasConfigurationConflictsObservable = of(true);
      createComponent().ngOnInit();
      expect(
        configuratorGroupsService.navigateToConflictSolver
      ).toHaveBeenCalledTimes(0);
      expect(
        configuratorGroupsService.navigateToFirstIncompleteGroup
      ).toHaveBeenCalledTimes(1);
    });

    it('should go to first incomplete group in case the router requires this - has no conflicts', () => {
      spyOn(
        configuratorGroupsService,
        'navigateToConflictSolver'
      ).and.callThrough();
      spyOn(
        configuratorGroupsService,
        'navigateToFirstIncompleteGroup'
      ).and.callThrough();
      routerStateObservable = of({
        ...mockRouterState,
        state: {
          ...mockRouterState.state,
          queryParams: { resolveIssues: 'true' },
        },
      });
      createComponent().ngOnInit();

      expect(
        configuratorGroupsService.navigateToConflictSolver
      ).toHaveBeenCalledTimes(0);
      expect(
        configuratorGroupsService.navigateToFirstIncompleteGroup
      ).toHaveBeenCalledTimes(1);
    });

    it('should not call setExpMode method', () => {
      routerStateObservable = of({
        ...mockRouterState,
        state: {
          ...mockRouterState.state,
          queryParams: { expMode: 'false' },
        },
      });
      createComponent().ngOnInit();
      expect(configExpertModeService.setExpModeRequested).toHaveBeenCalledTimes(
        0
      );
    });
  });

  it('should update a configuration through the facade layer ', () => {
    spyOn(configuratorCommonsService, 'updateConfiguration').and.callThrough();
    isConfigurationLoadingObservable = cold('xy', {
      x: true,
      y: false,
    });
    routerStateObservable = of(mockRouterState);
    createComponent().updateConfiguration({
      ownerKey: OWNER.key,
      changedAttribute: ConfigurationTestData.attributeCheckbox,
    });

    expect(configuratorCommonsService.updateConfiguration).toHaveBeenCalled();
  });

  describe('createGroupId', () => {
    it('should return empty string because groupID is undefined', () => {
      expect(createComponent().createGroupId(undefined)).toBeUndefined();
    });

    it('should return group ID string', () => {
      expect(createComponent().createGroupId('1234')).toBe('1234-group');
    });
  });

  describe('Rendering', () => {
    it('should support radio button attribute type', () => {
      const component = createComponent();
      component.group = ConfigurationTestData.productConfiguration.groups[0];
      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectNumberOfElements(
        expect,
        htmlElem,
        'cx-configurator-attribute-radio-button',
        1
      );
    });

    it('should display the radio button component for attribute type RADIOBUTTON_ADDITIONAL_INPUT', () => {
      const component = createComponent();
      const configurationWithAdditionalValueType =
        ConfigurationTestData.productConfiguration;
      configurationWithAdditionalValueType.groups[0].attributes?.push({
        name: 'AdditionalVal',
        uiType: Configurator.UiType.RADIOBUTTON_ADDITIONAL_INPUT,
      });
      component.group = configurationWithAdditionalValueType.groups[0];
      fixture.detectChanges();
      //now we expect 2 attributes resulting in a radio button component
      CommonConfiguratorTestUtilsService.expectNumberOfElements(
        expect,
        htmlElem,
        'cx-configurator-attribute-radio-button',
        2
      );
    });
  });

  describe('with regards to expMode', () => {
    it("should check whether expert mode status is set to 'true'", () => {
      createComponent();
      spyOn(configExpertModeService, 'getExpModeActive').and.returnValue(
        of(true)
      );

      if (component.expMode) {
        component.expMode
          .subscribe((expMode) => {
            expect(expMode).toBe(true);
          })
          .unsubscribe();
      }
    });

    it("should check whether expert mode status is set to 'false'", () => {
      createComponent();
      spyOn(configExpertModeService, 'getExpModeActive').and.returnValue(
        of(false)
      );

      if (component.expMode) {
        component.expMode
          .subscribe((expMode) => {
            expect(expMode).toBe(false);
          })
          .unsubscribe();
      }
    });

    it('should state that expert mode is requested if the router demands that', () => {
      routerStateObservable = of({
        ...mockRouterState,
        state: {
          ...mockRouterState.state,
          queryParams: { expMode: 'true' },
        },
      });
      createComponent().ngOnInit();
      expect(configExpertModeService.setExpModeRequested).toHaveBeenCalled();
    });
  });

  describe('displayConflictDescription', () => {
    it('should return true if group is conflict group and has a name', () => {
      spyOn(configuratorGroupsService, 'isConflictGroupType').and.returnValue(
        true
      );
      expect(createComponent().displayConflictDescription(conflictGroup)).toBe(
        true
      );
    });
    it('should return false if group is standard group', () => {
      spyOn(configuratorGroupsService, 'isConflictGroupType').and.returnValue(
        false
      );
      expect(createComponent().displayConflictDescription(conflictGroup)).toBe(
        false
      );
    });
    it('should return false if group is conflict group and does not have a name', () => {
      spyOn(configuratorGroupsService, 'isConflictGroupType').and.returnValue(
        true
      );
      conflictGroup.name = '';
      expect(createComponent().displayConflictDescription(conflictGroup)).toBe(
        false
      );
    });
    it('should return false if group type is undefined', () => {
      conflictGroup.groupType = undefined;
      expect(createComponent().displayConflictDescription(conflictGroup)).toBe(
        false
      );
    });
  });
});
