import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import * as fromStore from '../../store';

@Component({
  selector: 'y-dynamic-slot,[y-dynamic-slot]',
  templateUrl: './dynamic-slot.component.html',
  styleUrls: ['./dynamic-slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicSlotComponent implements OnInit, OnDestroy {
  currentSlot$: Observable<any>;

  @Input() position: string;
  @Input() limit: number;
  @Input() contextParameters: any;
  @Input() componentClass: string;

  constructor(private store: Store<fromStore.CmsState>) {}

  ngOnInit() {
    this.currentSlot$ = this.store
      .select(fromStore.currentSlotSelectorFactory(this.position))
      .filter(data => data !== undefined);
  }

  ngOnDestroy() {}
}
