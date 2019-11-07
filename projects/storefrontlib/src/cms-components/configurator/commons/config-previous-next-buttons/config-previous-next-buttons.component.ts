import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  Configurator,
  ConfiguratorGroupsService,
  RoutingService,
} from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'cx-config-previous-next-buttons',
  templateUrl: './config-previous-next-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigPreviousNextButtonsComponent implements OnInit {
  configuration$: Observable<Configurator.Configuration>;
  productCode: string;
  subscription = new Subscription();

  constructor(
    private routingService: RoutingService,
    private configuratorGroupsService: ConfiguratorGroupsService
  ) {}

  @Output() nextGroup = new EventEmitter();
  @Output() previousGroup = new EventEmitter();

  ngOnInit(): void {
    this.subscription.add(
      this.routingService
        .getRouterState()
        .subscribe(state => this.initConfigurationGroups(state))
    );
  }

  initConfigurationGroups(routingData) {
    this.productCode = routingData.state.params.rootProduct;
  }

  onPrevious() {
    this.navigateToPreviousGroup();
  }
  onNext() {
    this.navigateToNextGroup();
  }

  navigateToNextGroup() {
    this.configuratorGroupsService
      .getNextGroup(this.productCode)
      .pipe(take(1))
      .subscribe(groupId => {
        this.configuratorGroupsService.setCurrentGroup(
          this.productCode,
          groupId
        );
      });
  }

  navigateToPreviousGroup() {
    this.configuratorGroupsService
      .getPreviousGroup(this.productCode)
      .pipe(take(1))
      .subscribe(groupId => {
        this.configuratorGroupsService.setCurrentGroup(
          this.productCode,
          groupId
        );
      });
  }

  isFirstGroup(): Observable<Boolean> {
    return this.configuratorGroupsService
      .getPreviousGroup(this.productCode)
      .pipe(map(group => !group));
  }

  isLastGroup(): Observable<Boolean> {
    return this.configuratorGroupsService
      .getNextGroup(this.productCode)
      .pipe(map(group => !group));
  }
}
