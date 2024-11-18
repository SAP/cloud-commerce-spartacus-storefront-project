/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  GlobalMessageService,
  GlobalMessageType,
  PaginationModel,
  QueryState,
} from '@spartacus/core';
import {
  OpfActiveConfiguration,
  OpfActiveConfigurationPagination,
  OpfActiveConfigurationResponse,
  OpfBaseFacade,
  OpfMetadataModel,
  OpfMetadataStoreService,
} from '@spartacus/opf/base/root';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'cx-opf-checkout-payments',
  templateUrl: './opf-checkout-payments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpfCheckoutPaymentsComponent implements OnInit, OnDestroy {
  protected opfBaseService = inject(OpfBaseFacade);
  protected opfMetadataStoreService = inject(OpfMetadataStoreService);
  protected globalMessageService = inject(GlobalMessageService);

  protected subscription = new Subscription();

  protected paginationIndex = 0;

  @Input()
  elementsPerPage?: number;

  @Input()
  disabled = true;

  @Input()
  explicitTermsAndConditions: boolean | null | undefined;

  selectedPaymentId?: number;

  activeConfigurations$: Observable<
    QueryState<OpfActiveConfigurationResponse | undefined>
  >;

  getActiveConfiguration(): Observable<
    QueryState<OpfActiveConfigurationResponse | undefined>
  > {
    return this.opfBaseService
      .getActiveConfigurationsState({
        pageSize: this.elementsPerPage,
        pageNumber: this.paginationIndex + 1,
      })
      .pipe(
        tap((state: QueryState<OpfActiveConfigurationResponse | undefined>) => {
          if (state.error) {
            this.displayError('loadActiveConfigurations');
          } else if (!state.loading && !Boolean(state.data?.value?.length)) {
            this.displayError('noActiveConfigurations');
          }

          if (state.data?.value && !state.error && !state.loading) {
            this.opfMetadataStoreService.updateOpfMetadata({
              defaultSelectedPaymentOptionId: state.data?.value[0]?.id,
            });
          }
        })
      );
  }

  updateActiveConfiguration() {
    this.activeConfigurations$ = this.getActiveConfiguration();
  }

  /**
   * Method pre-selects (based on terms and conditions state)
   * previously selected payment option ID by customer.
   */
  protected preselectPaymentOption(): void {
    let isPreselected = false;
    this.subscription.add(
      this.opfMetadataStoreService
        .getOpfMetadataState()
        .subscribe((state: OpfMetadataModel) => {
          if (
            !isPreselected &&
            (state.termsAndConditionsChecked ||
              !this.explicitTermsAndConditions)
          ) {
            isPreselected = true;
            this.selectedPaymentId = !state.selectedPaymentOptionId
              ? state.defaultSelectedPaymentOptionId
              : state.selectedPaymentOptionId;
            this.opfMetadataStoreService.updateOpfMetadata({
              selectedPaymentOptionId: this.selectedPaymentId,
            });
          } else if (
            !state.termsAndConditionsChecked &&
            this.explicitTermsAndConditions
          ) {
            isPreselected = false;
            this.selectedPaymentId = undefined;
          }
        })
    );
  }

  protected displayError(errorKey: string): void {
    this.globalMessageService.add(
      { key: `opfCheckout.errors.${errorKey}` },
      GlobalMessageType.MSG_TYPE_ERROR
    );
  }

  changePayment(payment: OpfActiveConfiguration): void {
    this.selectedPaymentId = payment.id;
    this.opfMetadataStoreService.updateOpfMetadata({
      selectedPaymentOptionId: this.selectedPaymentId,
    });
  }

  getPaginationModel(
    pagination?: OpfActiveConfigurationPagination
  ): PaginationModel {
    const paginationModel: PaginationModel = {
      currentPage: this.paginationIndex,
      pageSize: pagination?.size,
      totalPages: pagination?.totalPages,
      totalResults: pagination?.totalElements,
    };

    return paginationModel;
  }

  pageChange(page: number) {
    this.paginationIndex = page;
    this.updateActiveConfiguration();
  }

  ngOnInit(): void {
    this.updateActiveConfiguration();
    this.preselectPaymentOption();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
