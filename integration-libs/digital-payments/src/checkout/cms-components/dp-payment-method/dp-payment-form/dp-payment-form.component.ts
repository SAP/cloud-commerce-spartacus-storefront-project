import { DpLocalStorageService } from '../../../facade/dp-local-storage.service';
import {
  GlobalMessageService,
  GlobalMessageType,
  WindowRef,
} from '@spartacus/core';
import { DpCheckoutPaymentService } from '../../../facade';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cx-dp-payment-form',
  templateUrl: './dp-payment-form.component.html',
})
export class DpPaymentFormComponent implements OnInit {
  @Output()
  closeForm = new EventEmitter<any>();

  constructor(
    private dpPaymentService: DpCheckoutPaymentService,
    private dpStorageService: DpLocalStorageService,
    private globalMsgService: GlobalMessageService,
    private winRef: WindowRef
  ) {}

  ngOnInit(): void {
    this.dpPaymentService.getCardRegistrationDetails().subscribe((request) => {
      if (request && request.url) {
        this.dpStorageService.syncCardRegistrationState();
        this.redirect(request.url);
      } else if (request === null) {
        this.globalMsgService.add(
          { key: 'dpPaymentForm.error.redirect' },
          GlobalMessageType.MSG_TYPE_ERROR
        );
        this.closeForm.emit();
      }
    });
  }

  redirect(url: string) {
    const window = this.winRef.nativeWindow;

    if (window && window.location) {
      window.location.href = url;
    }
  }
}
