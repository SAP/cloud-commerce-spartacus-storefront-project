/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AuthService,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  TranslationService,
} from '@commerce-storefront-toolset/core';
import { ICON_TYPE, ModalService } from '@commerce-storefront-toolset/storefront';
import { UserProfileFacade } from '@commerce-storefront-toolset/user/profile/root';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'cx-close-account-modal',
  templateUrl: './close-account-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseAccountModalComponent implements OnInit {
  iconTypes = ICON_TYPE;

  isLoggedIn$: Observable<boolean>;
  protected loading$ = new BehaviorSubject(false);

  constructor(
    protected modalService: ModalService,
    protected authService: AuthService,
    protected globalMessageService: GlobalMessageService,
    protected routingService: RoutingService,
    protected translationService: TranslationService,
    protected userProfile: UserProfileFacade
  ) {}

  get isLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isUserLoggedIn();
  }

  onSuccess(): void {
    this.dismissModal();
    this.translationService
      .translate('closeAccount.accountClosedSuccessfully')
      .pipe(first())
      .subscribe((text) => {
        this.globalMessageService.add(
          text,
          GlobalMessageType.MSG_TYPE_CONFIRMATION
        );
      });
    this.routingService.go({ cxRoute: 'home' });
  }

  onError(): void {
    this.dismissModal();
    this.translationService
      .translate('closeAccount.accountClosedFailure')
      .pipe(first())
      .subscribe((text) => {
        this.globalMessageService.add(text, GlobalMessageType.MSG_TYPE_ERROR);
      });
  }

  dismissModal(reason?: any): void {
    this.modalService.dismissActiveModal(reason);
  }

  closeAccount() {
    this.loading$.next(true);

    this.userProfile.close().subscribe({
      next: () => {
        this.onSuccess();
        this.loading$.next(false);
      },
      error: () => {
        this.onError();
        this.loading$.next(false);
      },
    });
  }
}
