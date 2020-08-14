import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CheckoutReplenishmentOrderAdapter,
  REPLENISHMENT_ORDER_NORMALIZER,
} from '../../../checkout/index';
import {
  ReplenishmentOrder,
  ScheduleReplenishmentForm,
} from '../../../model/replenishment-order.model';
import { ConverterService } from '../../../util/converter.service';
import { OccEndpointsService } from '../../services/occ-endpoints.service';

@Injectable()
export class OccCheckoutReplenishmentOrderAdapter
  implements CheckoutReplenishmentOrderAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  scheduleReplenishmentOrder(
    cartId: string,
    scheduleReplenishmentForm: ScheduleReplenishmentForm,
    termsChecked: boolean,
    userId: string
  ): Observable<ReplenishmentOrder> {
    const params = new HttpParams()
      .set('cartId', cartId)
      .set('termsChecked', termsChecked.toString())
      .set('fields', 'FULL');

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(
        this.occEndpoints.getUrl('scheduleReplenishmentOrder', {
          userId,
        }),
        scheduleReplenishmentForm,
        { headers, params }
      )
      .pipe(this.converter.pipeable(REPLENISHMENT_ORDER_NORMALIZER));
  }
}
