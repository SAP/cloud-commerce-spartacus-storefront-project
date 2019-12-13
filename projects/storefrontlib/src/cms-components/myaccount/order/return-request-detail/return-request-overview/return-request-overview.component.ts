import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ReturnRequest } from '@spartacus/core';
import { ReturnRequestService } from '../return-request.service';

@Component({
  selector: 'cx-return-request-overview',
  templateUrl: './return-request-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestOverviewComponent {
  constructor(protected returnRequestService: ReturnRequestService) {}

  returnRequest$: Observable<
    ReturnRequest
  > = this.returnRequestService.getReturnRequest();
}
