import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { B2BUserRight, B2BUserRole, I18nTestingModule } from '@spartacus/core';
import {
  B2BUserService,
  Budget,
} from '@spartacus/organization/administration/core';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { of, Subject } from 'rxjs';
import { CardTestingModule } from '../../shared/card/card.testing.module';
import { ToggleStatusModule } from '../../shared/detail/toggle-status-action/toggle-status.module';
import { ItemService } from '../../shared/item.service';
import { MessageTestingModule } from '../../shared/message/message.testing.module';
import { MessageService } from '../../shared/message/services/message.service';
import { ItemExistsDirective } from '../../shared/item-exists.directive';
import { UserDetailsComponent } from './user-details.component';
import createSpy = jasmine.createSpy;
import { DisableInfoModule } from '../../shared';

const mockCode = 'c1';

class MockUserItemService implements Partial<ItemService<Budget>> {
  key$ = of(mockCode);
  load = createSpy('load').and.returnValue(of());
  error$ = of(false);
}

class MockMessageService {
  add() {
    return new Subject();
  }
  clear() {}
  close() {}
}

class MockB2BUserService implements Partial<B2BUserService> {
  getAllRoles() {
    return [
      B2BUserRole.CUSTOMER,
      B2BUserRole.MANAGER,
      B2BUserRole.APPROVER,
      B2BUserRole.ADMIN,
    ];
  }
  getAllRights() {
    return [B2BUserRight.UNITORDERVIEWER];
  }
}

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let itemService: ItemService<Budget>;
  let b2bUserService: B2BUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        I18nTestingModule,
        UrlTestingModule,
        CardTestingModule,
        MessageTestingModule,
        ToggleStatusModule,
        DisableInfoModule,
      ],
      declarations: [UserDetailsComponent, ItemExistsDirective],
      providers: [
        { provide: ItemService, useClass: MockUserItemService },
        { provide: B2BUserService, useClass: MockB2BUserService },
      ],
    })
      .overrideComponent(UserDetailsComponent, {
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

    itemService = TestBed.inject(ItemService);

    b2bUserService = TestBed.inject(B2BUserService);

    spyOn(b2bUserService, 'getAllRights').and.callThrough();
    spyOn(b2bUserService, 'getAllRoles').and.callThrough();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load list of rights', () => {
    expect(b2bUserService.getAllRights).toHaveBeenCalled();
  });

  it('should load list of roles', () => {
    expect(b2bUserService.getAllRights).toHaveBeenCalled();
  });

  it('should trigger reload of model on each code change', () => {
    expect(itemService.load).toHaveBeenCalledWith(mockCode);
  });
});
