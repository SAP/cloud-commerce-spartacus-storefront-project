import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { Permission, PermissionService, RoutingService } from '@spartacus/core';

@Component({
  selector: 'cx-permission-details',
  templateUrl: './permission-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionDetailsComponent implements OnInit {
  permission$: Observable<Permission>;
  permissionCode$: Observable<
    string
  > = this.routingService
    .getRouterState()
    .pipe(map(routingData => routingData.state.params['code']));

  constructor(
    protected routingService: RoutingService,
    protected permissionsService: PermissionService
  ) {}

  ngOnInit(): void {
    this.permission$ = this.permissionCode$.pipe(
      tap(code => this.permissionsService.loadPermission(code)),
      switchMap(code => this.permissionsService.get(code)),
      filter(Boolean),
      map((permission: Permission) => ({
        ...permission,
      }))
    );
  }

  update(permission: Permission) {
    this.permissionCode$
      .pipe(take(1))
      .subscribe(permissionCode =>
        this.permissionsService.update(permissionCode, permission)
      );
  }
}
