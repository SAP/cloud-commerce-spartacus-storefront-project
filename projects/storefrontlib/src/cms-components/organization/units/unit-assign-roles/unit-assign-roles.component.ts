import { Component, OnInit } from '@angular/core';
import {
  filter,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import {
  RoutingService,
  EntitiesModel,
  OrgUnitService,
  B2BUser,
} from '@spartacus/core';
import {
  AbstractListingComponent,
  ListingModel,
} from '../../abstract-component/abstract-listing.component';
import { Params } from '@angular/router';

@Component({
  selector: 'cx-unit-assign-roles',
  templateUrl: './unit-assign-roles.component.html',
})
export class UnitAssignRolesComponent extends AbstractListingComponent
  implements OnInit {
  code: string;
  cxRoute = 'orgUnitAssignRoles';

  constructor(
    protected routingService: RoutingService,
    protected orgUnitsService: OrgUnitService
  ) {
    super(routingService);
  }

  role$: Observable<string> = this.params$.pipe(
    map((params: Params) => params['roleId'])
  );

  ngOnInit(): void {
    this.code$.pipe(take(1)).subscribe((code) => (this.code = code));

    this.data$ = <Observable<ListingModel>>combineLatest([
      this.queryParams$,
      this.role$,
    ]).pipe(
      withLatestFrom(this.code$),
      tap(([[queryParams, role], code]) =>
        this.orgUnitsService.loadUsers(code, role, queryParams)
      ),
      switchMap(([[queryParams, role], code]) =>
        this.orgUnitsService.getUsers(code, role, queryParams).pipe(
          filter(Boolean),
          map((userList: EntitiesModel<B2BUser>) => ({
            sorts: userList.sorts,
            pagination: userList.pagination,
            values: userList.values.map((user) => ({
              selected: user.selected,
              email: user.uid,
              name: user.name,
              roles: user.roles,
              parentUnit: user.orgUnit && user.orgUnit.name,
              uid: user.orgUnit && user.orgUnit.uid,
            })),
          }))
        )
      )
    );
  }

  assign({ row }) {
    this.role$
      .pipe(take(1))
      .subscribe((role) => this.orgUnitsService.assignRole(row.email, role));
  }

  unassign({ row }) {
    this.role$
      .pipe(take(1))
      .subscribe((role) => this.orgUnitsService.unassignRole(row.email, role));
  }

  changeRole({ roleId }: { roleId: string }) {
    this.updateQueryParams({}, { roleId });
  }
}
