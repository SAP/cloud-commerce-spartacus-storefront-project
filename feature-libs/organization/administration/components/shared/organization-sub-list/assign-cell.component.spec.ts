import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '@spartacus/core';
import { OutletContextData } from '@spartacus/storefront';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { Observable, of } from 'rxjs';
import { OrganizationItemService } from '../organization-item.service';
import { OrganizationListService } from '../organization-list/organization-list.service';
import { MessageService } from '../organization-message/services/message.service';
import { AssignCellComponent } from './assign-cell.component';
import { OrganizationSubListService } from './organization-sub-list.service';
import {
  LoadStatus,
  OrganizationItemStatus,
} from '@spartacus/organization/administration/core';

class MockOrganizationItemService {
  key$ = of('code1');
}

class MockMessageService {
  add() {}
}

const mockItemStatus = of({ status: LoadStatus.SUCCESS, item: {} });

class MockOrganizationListService {
  viewType = 'i18nRoot';
  assign(): Observable<OrganizationItemStatus<any>> {
    return mockItemStatus;
  }
  unassign(): Observable<OrganizationItemStatus<any>> {
    return mockItemStatus;
  }
}

describe('AssignCellComponent', () => {
  let component: AssignCellComponent<any>;
  let fixture: ComponentFixture<AssignCellComponent<any>>;
  let organizationListService: OrganizationListService<any>;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignCellComponent],
      imports: [RouterTestingModule, UrlTestingModule, I18nTestingModule],
      providers: [
        {
          provide: OutletContextData,
          useValue: {
            context: undefined,
          },
        },
        {
          provide: OrganizationItemService,
          useClass: MockOrganizationItemService,
        },
        {
          provide: MessageService,
          useClass: MockMessageService,
        },
        {
          provide: OrganizationListService,
          useClass: MockOrganizationListService,
        },
      ],
    }).compileComponents();

    organizationListService = TestBed.inject(OrganizationListService);
    messageService = TestBed.inject(MessageService);
  });

  describe('without item data', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AssignCellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not be assigned', () => {
      expect(component.isAssigned).toBeFalsy();
    });
  });

  describe('with assigned item', () => {
    beforeEach(() => {
      const data = TestBed.inject(OutletContextData);
      data.context = {
        selected: true,
        code: 'contextCode',
      };
      fixture = TestBed.createComponent(AssignCellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be assigned', () => {
      expect(component.isAssigned).toBeTruthy();
    });

    it('should unassign', () => {
      spyOn(
        organizationListService as OrganizationSubListService<any>,
        'unassign'
      ).and.callThrough();
      spyOn(messageService, 'add').and.callThrough();

      component.toggleAssign();

      expect(
        (organizationListService as OrganizationSubListService<any>).unassign
      ).toHaveBeenCalledWith('code1', 'contextCode');
      expect(messageService.add).toHaveBeenCalledWith({
        message: {
          key: `i18nRoot.unassigned`,
          params: {
            item: {},
          },
        },
      });
    });
  });

  describe('with unassigned item', () => {
    beforeEach(() => {
      const data = TestBed.inject(OutletContextData);
      data.context = {
        selected: false,
        code: 'contextCode',
      };
      fixture = TestBed.createComponent(AssignCellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have item', () => {
      expect(component.hasItem).toBeTruthy();
    });

    it('should be unassigned', () => {
      expect(component.isAssigned).toBeFalsy();
    });

    it('should assign', () => {
      spyOn(
        organizationListService as OrganizationSubListService<any>,
        'assign'
      ).and.callThrough();
      spyOn(messageService, 'add').and.callThrough();

      component.toggleAssign();

      expect(
        (organizationListService as OrganizationSubListService<any>).assign
      ).toHaveBeenCalledWith('code1', 'contextCode');
      expect(messageService.add).toHaveBeenCalledWith({
        message: {
          key: `i18nRoot.assigned`,
          params: {
            item: {},
          },
        },
      });
    });
  });
});
