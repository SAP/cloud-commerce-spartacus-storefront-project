import { Component, OnInit } from '@angular/core';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserGroup, UserGroupService, RoutingService } from '@spartacus/core';

@Component({
  selector: 'cx-user-group-edit',
  templateUrl: './user-group-edit.component.html',
})
export class UserGroupEditComponent implements OnInit {
  userGroup$: Observable<UserGroup>;
  code$: Observable<string> = this.routingService
    .getRouterState()
    .pipe(map((routingData) => routingData.state.params['code']));

  constructor(
    protected routingService: RoutingService,
    protected userGroupsService: UserGroupService
  ) {}

  ngOnInit(): void {
    this.userGroup$ = this.code$.pipe(
      tap((code) => this.userGroupsService.loadUserGroup(code)),
      switchMap((code) => this.userGroupsService.get(code))
    );
  }

  updateUserGroup(userGroup: UserGroup) {
    this.code$
      .pipe(take(1))
      .subscribe((userGroupCode) =>
        this.userGroupsService.update(userGroupCode, userGroup)
      );
    this.routingService.go({
      cxRoute: 'userGroupDetails',
      params: { code: userGroup.uid },
    });
  }
}
