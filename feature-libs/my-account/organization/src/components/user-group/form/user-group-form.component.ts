import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { B2BUnitNode, OrgUnitService } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-user-group-form',
  templateUrl: './user-group-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGroupFormComponent implements OnInit {
  /**
   * The form is controlled from the container component.
   */
  @Input() form: FormGroup;

  units$: Observable<B2BUnitNode[]> = this.orgUnitService.getList();

  constructor(protected orgUnitService: OrgUnitService) {}

  ngOnInit(): void {
    this.orgUnitService.loadOrgUnitNodes();
  }
}
