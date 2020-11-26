import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Budget } from '@spartacus/organization/administration/core';
import { Observable } from 'rxjs';
import { shareReplay, startWith, switchMap } from 'rxjs/operators';
import { ItemService } from '../../shared/item.service';
import { BudgetItemService } from '../services/budget-item.service';

@Component({
  selector: 'cx-org-budget-details',
  templateUrl: './budget-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ItemService,
      useExisting: BudgetItemService,
    },
  ],
  host: { class: 'content-wrapper' },
})
export class BudgetDetailsComponent implements OnInit {
  model$: Observable<Budget>;

  ngOnInit() {
    this.model$ = this.itemService.key$.pipe(
      switchMap((code) => this.itemService.load(code)),
      shareReplay({ bufferSize: 1, refCount: true }),
      startWith({})
    );
  }

  constructor(protected itemService: ItemService<Budget>) {}
}
