import { Component } from '@angular/core';
import { RoutingService, UserGroupService, UserGroup } from '@spartacus/core';

@Component({
  selector: 'cx-user-group-create',
  templateUrl: './user-group-create.component.html',
})
export class UserGroupCreateComponent {
  constructor(
    protected userGroupService: UserGroupService,
    protected routingService: RoutingService
  ) {}

  createUserGroup(userGroup: UserGroup) {
    this.userGroupService.create(userGroup);
    this.routingService.go({
      cxRoute: 'userGroupDetails',
      params: { code: userGroup.uid },
    });
  }
}
