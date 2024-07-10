import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  CheckoutServiceDetailsFacade,
  CheckoutServiceSchedulePickerService,
} from '@spartacus/s4-service/root';

@Component({
  selector: 'cx-service-details',
  templateUrl: './checkout-service-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutServiceDetailsComponent implements OnInit, OnDestroy {
  protected activatedRoute = inject(ActivatedRoute);
  protected checkoutStepService = inject(CheckoutStepService);
  protected globalMessageService = inject(GlobalMessageService);
  protected checkoutServiceDetailsFacade = inject(CheckoutServiceDetailsFacade);
  protected fb = inject(FormBuilder);
  protected checkoutServiceSchedulePickerService = inject(
    CheckoutServiceSchedulePickerService
  );

  minServiceDate: string =
    this.checkoutServiceSchedulePickerService.getMinDateForService();
  scheduleTimes: string[] =
    this.checkoutServiceSchedulePickerService.getScheduledServiceTimes();
  form: FormGroup = this.fb.group({
    scheduleDate: [this.minServiceDate],
    scheduleTime: [this.scheduleTimes[0]],
  });

  protected subscription = new Subscription();

  selectedServiceDetails$ = this.checkoutServiceDetailsFacade
    .getSelectedServiceDetailsState()
    .pipe(
      filter((state) => !state.loading),
      map((state) => state.data)
    );

  ngOnInit(): void {
    this.selectedServiceDetails$.subscribe((selectedServiceDetails) => {
      if (
        selectedServiceDetails !== undefined &&
        selectedServiceDetails !== ''
      ) {
        const scheduledAt =
          this.checkoutServiceSchedulePickerService.convertDateTimeToReadableString(
            selectedServiceDetails
          );
        const info =
          this.checkoutServiceSchedulePickerService.getServiceDetailsFromDateTime(
            scheduledAt
          );
        this.form.patchValue({
          scheduleDate: info.date,
          scheduleTime: info.time,
        });
      }
    });
  }

  setScheduleTime(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.form.patchValue({
      scheduleTime: value,
    });
  }

  get backBtnText(): string {
    return this.checkoutStepService.getBackBntText(this.activatedRoute);
  }

  protected readonly isSetServiceDetailsHttpErrorSub = new BehaviorSubject(
    false
  );
  isSetServiceDetailsHttpError$ =
    this.isSetServiceDetailsHttpErrorSub.asObservable();

  next(): void {
    this.subscription.add(
      this.serviceProducts$.subscribe((products) => {
        if (products.length > 0) {
          const scheduleDate = this.form?.get('scheduleDate')?.value || '';
          const scheduleTime = this.form?.get('scheduleTime')?.value || '';
          const scheduleDateTime =
            this.checkoutServiceSchedulePickerService.convertToDateTime(
              scheduleDate,
              scheduleTime
            );

          this.checkoutServiceDetailsFacade
            .setServiceScheduleSlot(scheduleDateTime)
            .subscribe({
              next: () => {
                this.onSuccess();
                this.checkoutStepService.next(this.activatedRoute);
              },
              error: () => this.onError(),
            });
        } else {
          this.checkoutStepService.next(this.activatedRoute);
        }
      })
    );
  }

  back(): void {
    this.checkoutStepService.back(this.activatedRoute);
  }

  serviceProducts$ = this.checkoutServiceDetailsFacade.getServiceProducts();

  protected onSuccess(): void {
    this.isSetServiceDetailsHttpErrorSub.next(false);
  }

  protected onError(): void {
    this.globalMessageService?.add(
      { key: 'serviceOrderCheckout.unknownError' },
      GlobalMessageType.MSG_TYPE_ERROR
    );

    this.isSetServiceDetailsHttpErrorSub.next(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
