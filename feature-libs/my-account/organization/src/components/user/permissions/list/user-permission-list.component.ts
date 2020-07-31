import { Component } from '@angular/core';
import { Table } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { UserPermissionListService } from './user-permission-list.service';
import { CurrentUserService } from '../../current-user.service';

@Component({
  selector: 'cx-user-permission-list',
  templateUrl: './user-permission-list.component.html',
})
export class UserPermissionListComponent {
  code$: Observable<string> = this.currentUserService.code$;

  dataTable$: Observable<Table> = this.code$.pipe(
    switchMap((code) => this.userPermissionListService.getTable(code))
  );

  constructor(
    protected currentUserService: CurrentUserService,
    protected userPermissionListService: UserPermissionListService
  ) {}

  unassign(model) {
    this.code$
      .pipe(take(1))
      .subscribe((code) =>
        this.userPermissionListService.unassign(code, model)
      );
  }
}
