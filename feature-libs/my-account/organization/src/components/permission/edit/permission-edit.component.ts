import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { PermissionFormService } from '../form/permission-form.service';
import { UserGroup } from '../../../core/model/user-group.model';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'cx-permission-edit',
  templateUrl: './permission-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionEditComponent {
  protected code$: Observable<string> = this.activatedRoute.parent.params.pipe(
    map((routingData) => routingData['code'])
  );

  protected permission$: Observable<UserGroup> = this.code$.pipe(
    tap((code) => this.permissionService.loadPermission(code)),
    switchMap((code) => this.permissionService.get(code)),
    shareReplay({ bufferSize: 1, refCount: true }) // we have side effects here, we want the to run only once
  );

  protected form$: Observable<FormGroup> = this.permission$.pipe(
    map((permission) => this.permissionFormSerivce.getForm(permission))
  );

  // We have to keep all observable values consistent for a view,
  // that's why we are wrapping them into one observable
  viewModel$ = this.form$.pipe(
    withLatestFrom(this.permission$, this.code$),
    map(([form, permission, uid]) => ({ form, uid, permission }))
  );

  constructor(
    protected permissionService: PermissionService,
    protected permissionFormSerivce: PermissionFormService,
    protected activatedRoute: ActivatedRoute,
    // we can't do without the router as the routingService is unable to
    // resolve the parent routing params. `paramsInheritanceStrategy: 'always'`
    // would actually fix that.
    protected routingService: RoutingService
  ) {}

  save(permissionCode: string, form: FormGroup): void {
    if (form.invalid) {
      form.markAllAsTouched();
    } else {
      form.disable();
      this.permissionService.update(permissionCode, form.value);

      this.routingService.go({
        cxRoute: 'permissionDetails',
        params: form.value,
      });
    }
  }
}
