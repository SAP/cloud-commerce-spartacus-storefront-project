import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  ReplenishmentOrder,
  ReplenishmentOrderList,
  RoutingService,
  TranslationService,
  UserReplenishmentOrderService,
} from '@spartacus/core';
import { ReplenishmentOrderCancellationLaunchDialogService } from '../replenishment-order-details/replenishment-order-cancellation/replenishment-order-cancellation-launch-dialog.service';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import {
  LAUNCH_CALLER,
  LaunchDialogService,
} from '../../../../layout/launch-dialog';

@Component({
  selector: 'cx-replenishment-order-history',
  templateUrl: './replenishment-order-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplenishmentOrderHistoryComponent implements OnDestroy {
  @ViewChild('element') element: ElementRef;

  private subscription = new Subscription();

  private PAGE_SIZE = 5;
  sortType: string;

  replenishmentOrders$: Observable<ReplenishmentOrderList> = this.userReplenishmentOrderService
    .getReplenishmentOrderHistoryList(this.PAGE_SIZE)
    .pipe(
      tap((replenishmentOrders: ReplenishmentOrderList) => {
        if (replenishmentOrders.pagination) {
          this.sortType = replenishmentOrders.pagination.sort;
        }
      })
    );

  isLoaded$: Observable<boolean> = this.userReplenishmentOrderService.getReplenishmentOrderHistoryListSuccess();
  // TODO(#12167): make launchDialogService a required dependency instead of replenishmentOrderCancellationLaunchDialogService and remove deprecated constructors
  /**
   * @deprecated since 3.3
   */
  constructor(
    routing: RoutingService,
    userReplenishmentOrderService: UserReplenishmentOrderService,
    replenishmentOrderCancellationLaunchDialogService: ReplenishmentOrderCancellationLaunchDialogService,
    translation: TranslationService,
    vcr: ViewContainerRef
  );

  /**
   * Default constructor will be
   *
   * @param {RoutingService} routing
   * @param {UserReplenishmentOrderService} userReplenishmentOrderService
   * @param {TranslationService} translation
   * @param {ViewContainerRef} vcr
   * @param {LaunchDialogService} launchDialogService
   */
  constructor(
    routing: RoutingService,
    userReplenishmentOrderService: UserReplenishmentOrderService,
    replenishmentOrderCancellationLaunchDialogService: ReplenishmentOrderCancellationLaunchDialogService,
    translation: TranslationService,
    vcr: ViewContainerRef,
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    launchDialogService: LaunchDialogService
  );

  constructor(
    protected routing: RoutingService,
    protected userReplenishmentOrderService: UserReplenishmentOrderService,
    protected replenishmentOrderCancellationLaunchDialogService: ReplenishmentOrderCancellationLaunchDialogService,
    protected translation: TranslationService,
    protected vcr: ViewContainerRef,
    protected launchDialogService?: LaunchDialogService
  ) {}

  changeSortCode(sortCode: string): void {
    const event: { sortCode: string; currentPage: number } = {
      sortCode,
      currentPage: 0,
    };
    this.sortType = sortCode;
    this.fetchReplenishmentOrders(event);
  }

  pageChange(page: number): void {
    const event: { sortCode: string; currentPage: number } = {
      sortCode: this.sortType,
      currentPage: page,
    };
    this.fetchReplenishmentOrders(event);
  }

  goToOrderDetail(order: ReplenishmentOrder): void {
    this.routing.go({
      cxRoute: 'replenishmentDetails',
      params: order,
    });
  }

  getSortLabels(): Observable<{
    byDate: string;
    byReplenishmentNumber: string;
    byNextOrderDate: string;
  }> {
    return combineLatest([
      this.translation.translate('sorting.date'),
      this.translation.translate('sorting.replenishmentNumber'),
      this.translation.translate('sorting.nextOrderDate'),
    ]).pipe(
      map(([textByDate, textByOrderNumber, textbyNextOrderDate]) => {
        return {
          byDate: textByDate,
          byReplenishmentNumber: textByOrderNumber,
          byNextOrderDate: textbyNextOrderDate,
        };
      })
    );
  }

  openDialog(event: Event, replenishmentOrderCode: string): void {
    // TODO(#12167): use launchDialogService only
    if (this.launchDialogService) {
      const dialog = this.launchDialogService.openDialog(
        LAUNCH_CALLER.REPLENISHMENT_ORDER,
        this.element,
        this.vcr,
        replenishmentOrderCode
      );

      if (dialog) {
        this.subscription.add(dialog.pipe(take(1)).subscribe());
      }
    } else {
      const dialog = this.replenishmentOrderCancellationLaunchDialogService.openDialog(
        this.element,
        this.vcr,
        replenishmentOrderCode
      );

      if (dialog) {
        this.subscription.add(dialog.pipe(take(1)).subscribe());
      }
    }
    event.stopPropagation();
  }

  private fetchReplenishmentOrders(event: {
    sortCode: string;
    currentPage: number;
  }): void {
    this.userReplenishmentOrderService.loadReplenishmentOrderList(
      this.PAGE_SIZE,
      event.currentPage,
      event.sortCode
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.userReplenishmentOrderService.clearReplenishmentOrderList();
  }
}
