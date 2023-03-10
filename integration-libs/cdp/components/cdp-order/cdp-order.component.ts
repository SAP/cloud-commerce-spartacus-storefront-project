import { Component, OnInit } from '@angular/core';
import {
  CxDatePipe,
  OccEndpointsService,
  RoutingService,
  UserIdService,
} from '@spartacus/core';
//import { Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { cdpOrderAdapter } from './adapter/cdp-order-adapter';
import { finalOrder } from './model/order/finalOrder';
import { order } from './model/orderDetail/order';
import { result } from './model/result';
import { BehaviorSubject } from 'rxjs';
import { product } from './model/ImageDetail/product';

@Component({
  selector: 'cx-order',
  templateUrl: './cdp-order.component.html',
  styleUrls: ['./cdp-order.component.scss'],
  providers: [CxDatePipe],
})
export class OrderComponent implements OnInit {
  constructor(
    private userIdService: UserIdService,
    private cdpOrderAdapter: cdpOrderAdapter,
    protected datePipe: CxDatePipe,
    protected routing: RoutingService,
    protected occEndpointsService: OccEndpointsService
  ) {}

  result: finalOrder = { orders: [] };
  totalPrice: number = 0;
  totalItem: number[] = [];
  orderDetail: Record<string, order> = {};
  i: number = 0;
  output: result;
  orderStatus: Record<string, Record<string, number>> = {};
  orderImage: Record<string, product[]> = {};
  userId: string;
  tabTitleParam$ = new BehaviorSubject(0);

  ngOnInit(): void {
    this.getMyData();
  }

  public getMyData(): void {
    const obser = this.userIdService
      .takeUserId()
      .pipe(switchMap((userId) => this.cdpOrderAdapter.getOrder(userId)));

    obser.subscribe((res) => {
      this.result = res;
      this.tabTitleParam$.next(res.orders.length);
      this.calculateTotalAmount(this.result);
      this.getItemCount(this.result);
    });
  }

  public calculateTotalAmount(finalResult: finalOrder): void {
    for (var val of finalResult.orders) {
      this.totalPrice = val.total.value + this.totalPrice;
      console.log(this.totalPrice);
    }
  }

  public async getItemCount(finalResult: finalOrder): Promise<void> {
    for (let orderval of finalResult.orders) {
      await this.userIdService
        .takeUserId()
        .pipe(
          mergeMap((userId) =>
            this.cdpOrderAdapter.getOrderDetail(userId, orderval)
          )
        )
        .toPromise()
        .then((data) => {
          this.orderDetail[orderval.code] = data;
        });
    }
    this.getDetail();
  }

  public async getDetail() {
    // eslint-disable-next-line guard-for-in
    for (let orderCode in this.orderDetail) {
      this.orderStatus[orderCode] ??= {};
      this.orderDetail[orderCode].consignments.forEach((ord) => {
        this.orderStatus[orderCode][ord.status] ??= 0;
        ord.entries.forEach((entr) => {
          console.log(orderCode + ' status ' + ord.status + entr.quantity);
          this.orderStatus[orderCode][ord.status] =
            this.orderStatus[orderCode][ord.status] + entr.quantity;
        });
      });
      this.orderImage[orderCode] ??= [];
      //this.orderImage[orderCode]??={images:[]};
      this.orderDetail[orderCode].entries.forEach((entr) => {
        this.cdpOrderAdapter.getImages(entr.product.code).subscribe((data) => {
          this.orderImage[orderCode].push(data);
          data.images.forEach((img) => {
            img.url =
              this.occEndpointsService.getBaseUrl({
                prefix: false,
                baseSite: false,
              }) + img.url;
          });
        });
      });
    }
    console.log(this.orderImage);
  }

  goToOrderDetail(order: order): void {
    this.routing.go({
      cxRoute: 'orderDetails',
      params: order,
    });
  }
}
