import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '@spartacus/core';
import { Budget } from '@spartacus/organization/administration/core';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { of, Subject } from 'rxjs';
import { OrganizationCardTestingModule } from '../../shared/organization-card/organization-card.testing.module';
import { OrganizationItemService } from '../../shared/organization-item.service';
import { MessageService } from '../../shared/organization-message/services/message.service';
import { UserGroupDetailsComponent } from './user-group-details.component';
import createSpy = jasmine.createSpy;

const mockCode = 'u1';

class MockUserGroupItemService
  implements Partial<OrganizationItemService<Budget>> {
  key$ = of(mockCode);
  load = createSpy('load').and.returnValue(of());
}

class MockMessageService {
  add() {
    return new Subject();
  }
  clear() {}
  close() {}
}

describe('UserGroupDetailsComponent', () => {
  let component: UserGroupDetailsComponent;
  let fixture: ComponentFixture<UserGroupDetailsComponent>;
  let itemService: OrganizationItemService<Budget>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        I18nTestingModule,
        UrlTestingModule,
        OrganizationCardTestingModule,
      ],
      declarations: [UserGroupDetailsComponent],
      providers: [
        {
          provide: OrganizationItemService,
          useClass: MockUserGroupItemService,
        },
      ],
    })
      .overrideComponent(UserGroupDetailsComponent, {
        set: {
          providers: [
            {
              provide: MessageService,
              useClass: MockMessageService,
            },
          ],
        },
      })
      .compileComponents();

    itemService = TestBed.inject(OrganizationItemService);

    fixture = TestBed.createComponent(UserGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger reload of model on each code change', () => {
    expect(itemService.load).toHaveBeenCalledWith(mockCode);
  });
});
