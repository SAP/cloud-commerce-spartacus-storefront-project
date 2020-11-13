import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, first, switchMap, take } from 'rxjs/operators';
import {
  OutletContextData,
  TableDataOutletContext,
} from '@spartacus/storefront';
import {
  LoadStatus,
  OrganizationItemStatus,
} from '@spartacus/organization/administration/core';
import { OrganizationItemService } from '../organization-item.service';
import { OrganizationListService } from '../organization-list/organization-list.service';
import { MessageService } from '../organization-message/services/message.service';
import { OrganizationSubListService } from '../organization-sub-list/organization-sub-list.service';
import { OrganizationCellComponent } from '../organization-table/organization-cell.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-assign-cell',
  template: `
    <button *ngIf="hasItem" (click)="toggleAssign()" class="link">
      {{ isAssigned ? 'unassign' : 'assign' }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignCellComponent<T> extends OrganizationCellComponent {
  constructor(
    protected outlet: OutletContextData<TableDataOutletContext>,
    protected organizationItemService: OrganizationItemService<T>,
    protected messageService: MessageService,
    protected organizationSubListService: OrganizationListService<T>
  ) {
    super(outlet);
  }

  get isAssigned(): boolean {
    return (this.item as any)?.selected;
  }

  toggleAssign() {
    const isAssigned = this.isAssigned;
    this.organizationItemService.key$
      .pipe(
        first(),
        switchMap((key) =>
          isAssigned
            ? this.unassign(key, this.link)
            : this.assign(key, this.link)
        ),
        take(1),
        filter(
          (data: OrganizationItemStatus<T>) =>
            data.status === LoadStatus.SUCCESS
        )
      )
      .subscribe((data) =>
        this.notify(data.item, isAssigned ? 'unassigned' : 'assigned')
      );
  }

  protected assign(
    key: string,
    linkKey: string
  ): Observable<OrganizationItemStatus<T>> {
    return (this.organizationSubListService as OrganizationSubListService<
      T
    >).assign(key, linkKey);
  }

  protected unassign(
    key: string,
    linkKey: string
  ): Observable<OrganizationItemStatus<T>> {
    return (this.organizationSubListService as OrganizationSubListService<
      T
    >).unassign(key, linkKey);
  }

  /**
   * Returns the key for the linked object.
   *
   * At the moment, we're using a generic approach to assign objects,
   * but the object do not have a normalized shape. Therefor, we need
   * to evaluate the context to return the right key for the associated
   * item.
   */
  protected get link(): string {
    return (
      this.outlet.context.code ??
      this.outlet.context.customerId ??
      this.outlet.context.uid
    );
  }

  protected notify(item, state) {
    this.messageService.add({
      message: {
        key: `${this.organizationSubListService.viewType}.${state}`,
        params: {
          item,
        },
      },
    });
  }
}
