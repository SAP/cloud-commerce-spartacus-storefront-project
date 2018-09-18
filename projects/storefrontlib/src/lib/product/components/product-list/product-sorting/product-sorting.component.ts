import {
  Component,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'y-product-sorting',
  templateUrl: './product-sorting.component.html',
  styleUrls: ['./product-sorting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSortingComponent {
  @Input() sortOptions;
  @Input() selectedOption: string;
  @Output() sortListEvent: EventEmitter<string>;

  constructor() {
    this.sortListEvent = new EventEmitter<string>();
  }

  sortList(sortCode: string) {
    this.sortListEvent.emit(sortCode);
  }
}
